export interface DefaultJWT {
    accessToken: string
}

export interface Error {
    response: {
        data: {
            message: string;
        }
    }
}
