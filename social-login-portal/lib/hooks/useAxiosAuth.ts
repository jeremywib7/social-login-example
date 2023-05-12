"use client";
import {useSession} from "next-auth/react";
import {useCallback, useEffect} from "react";
import {axiosAuth} from "../axios";
import {useRefreshToken} from "./useRefreshToken";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

const useAxiosAuth = () => {
    const {data: session} = useSession();
    const refreshToken = useRefreshToken();
    const {executeRecaptcha} = useGoogleReCaptcha();

    const handleReCaptchaVerify = useCallback(async () => {
        if (!executeRecaptcha) {
            console.log('Execute recaptcha not yet available');
            return;
        }
        return await executeRecaptcha();
    }, [executeRecaptcha]);

    // You can use useEffect to trigger the verification as soon as the component being loaded
    // useEffect(() => {
    //     handleReCaptchaVerify();
    // }, [handleReCaptchaVerify]);

    useEffect(() => {
        const requestIntercept = axiosAuth.interceptors.request.use(
            async (config) => {
                if (!config.headers["Authorization"]) {
                    config.headers["Authorization"] = `Bearer ${session?.user?.accessToken}`;
                }
                if (config.method === "post") {
                    config.headers["recaptcha"] = await handleReCaptchaVerify();
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosAuth.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    await refreshToken();
                    prevRequest.headers["Authorization"] = `Bearer ${session?.user.accessToken}`;
                    return axiosAuth(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosAuth.interceptors.request.eject(requestIntercept);
            axiosAuth.interceptors.response.eject(responseIntercept);
        };
    }, [session, refreshToken]);

    return axiosAuth;
};

export default useAxiosAuth;
