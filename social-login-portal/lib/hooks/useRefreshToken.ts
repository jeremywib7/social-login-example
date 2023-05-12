"use client";

import {signIn, useSession} from "next-auth/react";
import axios from "axios";

export const useRefreshToken = () => {
    const { data: session } = useSession();

    return async () => {
        const res = await axios.post("/auth/refresh", {
            refresh: session?.user.accessToken,
        });

        if (session) session.user.accessToken = res.data.refresh_token;
        else await signIn();
    };
};
