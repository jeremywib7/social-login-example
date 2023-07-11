package com.thefuture.security.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@RequiredArgsConstructor
public class GoogleTokenException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String errorMessage;

    public GoogleTokenException() {
        this(HttpStatus.UNAUTHORIZED, "Google token invalid or expired");
    }
}
