export interface HttpResponse {
    data : {
        timestamp: Date;
        httpStatusCode: number;
        httpStatus: string;
        reason: string;
        message: string;
        fieldErrors?: [];
    }
}

export interface ErrorMessage {
    response: {
        data: {
            message: string
        }
    }
}
