package com.thefuture.security.exception.email;

public class EmailNotVerifiedException extends Exception {
    public EmailNotVerifiedException() {
        super("Email not verified");
    }
}
