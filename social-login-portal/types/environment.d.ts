declare namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_BASE_URL: string;
        NEXT_PUBLIC_GOOGLE_ID: string;
        NEXT_PUBLIC_GOOGLE_SECRET: string;
        NEXT_PUBLIC_FACEBOOK_ID: string;
        NEXT_PUBLIC_FACEBOOK_SECRET: string;
        NEXT_PUBLIC_KEYCLOAK_ID: string;
        NEXT_PUBLIC_KEYCLOAK_SECRET: string;

        NEXT_PUBLIC_PORT: string;
        NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
        NEXT_PUBLIC_AUTH_ENDPOINT_VERSION: string;
        NODE_ENV: 'development' | 'production';
        PWD: string;
    }
}
