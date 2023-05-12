import useAxiosAuth from "../../lib/hooks/useAxiosAuth";
import {useMutation, UseMutationResult} from "react-query";
import {ErrorMessage, HttpResponse} from "../../global-interface";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export const useRegister = (): UseMutationResult<HttpResponse, ErrorMessage, RegisterRequest> => {
    const axiosAuth = useAxiosAuth();
    return useMutation(async (data: RegisterRequest) =>
        await axiosAuth.post(`/api/v1/auth/register`, data), {});
}

export const useVerifyEmailToken = (): UseMutationResult<HttpResponse, ErrorMessage, string>  => {
    const axiosAuth = useAxiosAuth();
    return useMutation(async (verificationToken: string) =>
        await axiosAuth.get(`/api/v1/auth/verify-email-token`, {
            params: {
                token: verificationToken
            }
        }), {
            retry: false
        }
    );
}
