package com.alibou.security.exception;

public class RecaptchaInvalidException extends RuntimeException {
    public RecaptchaInvalidException(String message) {
        super(message);
    }
}
