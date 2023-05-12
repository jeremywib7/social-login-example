package com.alibou.security.exception;

import com.alibou.security.exception.email.EmailExistsException;
import com.alibou.security.exception.email.EmailTokenException;
import com.alibou.security.model.HttpResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
@Slf4j
public class ExceptionHandling implements ErrorController {

    @ExceptionHandler(EmailExistsException.class)
    public ResponseEntity<HttpResponse> emailExistsException(EmailExistsException exception) {
        log.error(exception.getMessage());
        return createHttpResponse(exception.getHttpStatus(),  exception.getErrorMessage());
    }

    @ExceptionHandler(EmailTokenException.class)
    public ResponseEntity<HttpResponse> tokenException(EmailTokenException exception) {
        log.error(exception.getMessage());
        return createHttpResponse(exception.getHttpStatus(),  exception.getErrorMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<HttpResponse> emailExistsException(BadCredentialsException exception) {
        log.error(exception.getMessage());
        return createHttpResponse(BAD_REQUEST,  "Username or password incorrect");
    }

    @ExceptionHandler(GoogleTokenException.class)
    public ResponseEntity<HttpResponse> emailExistsException(GoogleTokenException exception) {
        log.error(exception.getMessage());
        return createHttpResponse(exception.getHttpStatus(),  exception.getErrorMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<HttpResponse> internalServerErrorException(Exception exception) {
        System.out.println(exception.toString());
        log.error(exception.getMessage());
        return createHttpResponse(INTERNAL_SERVER_ERROR, exception.getLocalizedMessage());
    }

    public static ResponseEntity<HttpResponse> createHttpResponse(HttpStatus httpStatus, String message) {
        return new ResponseEntity<>(new HttpResponse(httpStatus.value(), httpStatus,
                httpStatus.getReasonPhrase().toUpperCase(), message), httpStatus);
    }

    @ResponseStatus(BAD_REQUEST)
    @ResponseBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<HttpResponse> methodArgumentNotValidException(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();
        List<org.springframework.validation.FieldError> fieldErrors = result.getFieldErrors();
        return createHttpResponseWithFieldErrors(fieldErrors);
    }

    private ResponseEntity<HttpResponse> createHttpResponseWithFieldErrors(List<FieldError> fieldErrors) {
        HttpResponse httpResponse = new HttpResponse(HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST,
                HttpStatus.BAD_REQUEST.getReasonPhrase().toUpperCase(), "Validation error");
        for (org.springframework.validation.FieldError fieldError : fieldErrors) {
            httpResponse.addFieldError(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return new ResponseEntity<>(httpResponse, HttpStatus.BAD_REQUEST);
    }

    @RequestMapping("/error")
    public ResponseEntity<HttpResponse> notFound404() {
        return createHttpResponse(NOT_FOUND, "There is no mapping for this URL");
    }
}
