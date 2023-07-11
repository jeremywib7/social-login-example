package com.thefuture.security.controllers;

import com.thefuture.security.services.AuthenticationService;
import com.thefuture.security.exception.email.EmailAlreadyVerifiedException;
import com.thefuture.security.exception.email.EmailExistsException;
import com.thefuture.security.exception.email.EmailNotVerifiedException;
import com.thefuture.security.model.FacebookUser;
import com.thefuture.security.model.HttpResponse;
import com.thefuture.security.request.AuthenticationRequest;
import com.thefuture.security.request.RegisterRequest;
import com.thefuture.security.response.AuthenticationResponse;
import com.thefuture.security.exception.ExceptionHandling;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<HttpResponse> register(@Valid @RequestBody RegisterRequest request) throws EmailExistsException {
        return ExceptionHandling.createHttpResponse(OK, service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request) throws EmailNotVerifiedException {
        return ResponseEntity.ok(service.authenticateWithCredentials(request));
    }

    @GetMapping("/verify-email-token")
    public ResponseEntity<HttpResponse> verifyEmail(@RequestParam String token) throws EmailAlreadyVerifiedException {
        return ExceptionHandling.createHttpResponse(OK, service.verifyEmail(token));
    }

    @GetMapping("/verify-google-token")
    public ResponseEntity<AuthenticationResponse> verifyGoogleToken(@RequestParam() String token) throws GeneralSecurityException, IOException {
        return ResponseEntity.ok(service.authenticateWithGoogle(token));
    }

    @GetMapping("/verify-facebook-token")
    public ResponseEntity<FacebookUser> verifyFacebookToken(@RequestParam String token) {
        return ResponseEntity.ok(service.verifyFacebookToken(token));
    }
}
