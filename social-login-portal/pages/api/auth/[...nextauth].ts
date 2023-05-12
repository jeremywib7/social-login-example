import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import {axiosAuth} from "../../../lib/axios";
import NextAuth from "next-auth";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
        }),
        FacebookProvider({
            clientId: process.env.NEXT_PUBLIC_FACEBOOK_ID,
            clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_SECRET,
        }),
        CredentialsProvider({
            credentials: {},
            async authorize(credentials, req) {
                const {email, password, token} = credentials as any;
                try {
                    const res = await axiosAuth.post('/api/v1/auth/authenticate', {
                        email,
                        password
                    }, {
                        headers: {
                            recaptcha: token
                        }
                    });
                    return res.data;
                } catch (error: any) {
                    throw new Error(error.response.data.message);
                }

            }
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 30 * 60,
    },

    jwt: {
        maxAge: 30 * 24 * 30 * 60 // 30 day
    },

    pages: {
        signIn: '/auth',
        newUser: '/register'
        // signOut: '/auth/logout',
        // error: '/auth/error',
        // verifyRequest: '/auth/verify-request',
    },

    callbacks: {
        async jwt({token, user, account}) {
            if (account) {
                let res;
                if (account.provider == "google") {
                    try {
                        res = await axiosAuth.get(process.env.NEXT_PUBLIC_PORT + "/" +
                            process.env.NEXT_PUBLIC_AUTH_ENDPOINT_VERSION + "/" + "verify-google-token", {
                            params: {
                                token: account.id_token
                            }
                        })
                    } catch (e) {
                        return {
                            error: "Google token expired",
                            refreshTokenRequired: true,
                        };
                    }
                }
                if (account.provider == "facebook") {
                    try {
                        res = await axiosAuth.get(process.env.NEXT_PUBLIC_PORT + "/" +
                            process.env.NEXT_PUBLIC_AUTH_ENDPOINT_VERSION + "/" + "verify-facebook-token", {
                            params: {
                                token: account.access_token
                            }
                        })
                    } catch (e) {
                        return {
                            error: "Facebook token expired",
                            refreshTokenRequired: true,
                        };
                    }
                }
                token.accessToken = res?.data.access_token;
            }
            return {...token, ...user};
        },
        async session({session, token}) {
            session.user = token as any;
            return session;
        },
    },
});
