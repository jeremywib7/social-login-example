package com.alibou.security.exception.email;

public class EmailAlreadyVerifiedException extends Exception {
    public EmailAlreadyVerifiedException() {
        super("Email already verified");
    }
}
