package com.alibou.security.exception.email;

public class EmailNotVerifiedException extends Exception {
    public EmailNotVerifiedException() {
        super("Email not verified");
    }
}
