package com.alibou.security.exception.email;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@RequiredArgsConstructor
public class EmailTokenException extends RuntimeException {
    private final HttpStatus httpStatus;
    private final String errorMessage;

    public EmailTokenException() {
        this(HttpStatus.BAD_REQUEST, "Email token invalid or missing");
    }

}
