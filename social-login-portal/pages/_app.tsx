import type {AppProps} from 'next/app'
//theme
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primeflex/primeflex.min.css"
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";
import React from "react";
import {SessionProvider} from "next-auth/react";
import "../global.css";
import {ToastProvider} from "../components/ToastContext";
import {GoogleReCaptchaProvider, useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {QueryClient, QueryClientProvider} from "react-query";

export default function App({Component, pageProps}: AppProps) {
    const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';
    const {executeRecaptcha} = useGoogleReCaptcha();

    const reactQueryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5000,
            },
        },
    });

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={reCaptchaKey}
            scriptProps={{
                async: true,
                defer: false,
                appendTo: "head",
                nonce: undefined,
            }}>
            <QueryClientProvider client={reactQueryClient}>
                <SessionProvider session={pageProps.session}>
                    <ToastProvider>
                        <Component {...pageProps} />
                    </ToastProvider>
                </SessionProvider>
            </QueryClientProvider>
        </GoogleReCaptchaProvider>

    );
}
