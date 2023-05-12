import {Button} from "primereact/button";
import React, {useEffect} from "react";
import {Skeleton} from "primereact/skeleton";
import {useRouter} from "next/router";
import {useVerifyEmailToken} from "../api/auth";

const EmailVerify = () => {
    const router = useRouter();
    const {token} = router.query;
    const {isLoading, isSuccess, isError, mutate, error, data} = useVerifyEmailToken();
    const getErrorMessage = () => {
        return (error?.response.data.message);
    };

    useEffect(() => {
        if (token) {
            mutate(token as string);
        }
    }, [token]);

    return (
        <>
            <div
                className="surface-section flex min-w-screen min-h-screen justify-content-center align-items-center px-4 py-8 md:px-6 lg:px-8">
                {isLoading &&
                    <div className="flex flex-column justify-content-center align-items-center">
                        <Skeleton height="3rem" width="40rem"></Skeleton>
                        <Skeleton height="2rem" width="20rem" className="mt-5 mb-5"></Skeleton>
                        <Skeleton width="15rem" height="2rem"></Skeleton>
                    </div>}
                {isError &&
                    <div className="text-center text-3xl">
                        <p className="text-700 mb-3">{getErrorMessage()}</p>
                        {getErrorMessage() === "Token invalid or missing" &&
                            <p className="text-700 text-3xl">Please check your email and click on the link again to
                                verify
                                your email address. If you continue to have issues, please contact support for
                                assistance.</p>}
                        {getErrorMessage() === "Email already verified" &&
                            <div>
                                <p className="text-700 text-3xl">You can login now</p>
                                <Button type="button" label="Login" icon="pi pi-sign-in"></Button>
                            </div>}
                    </div>}
                {isSuccess &&
                    <div className="text-center">
                        <div className="mt-6 mb-5 font-bold text-6xl text-900">{data.data.message}</div>
                        <p className="text-700 text-3xl mt-0 mb-6">You can login now</p>
                        <Button type="button" label="Login" icon="pi pi-sign-in"></Button>
                    </div>}
            </div>
        </>
    );
}

export default EmailVerify;
