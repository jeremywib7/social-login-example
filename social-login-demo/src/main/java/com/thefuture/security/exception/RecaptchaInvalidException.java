package com.thefuture.security.exception;

public class RecaptchaInvalidException extends RuntimeException {
    public RecaptchaInvalidException(String message) {
        super(message);
    }
}
