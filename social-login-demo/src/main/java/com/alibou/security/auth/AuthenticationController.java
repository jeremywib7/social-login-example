package com.alibou.security.auth;

import com.alibou.security.exception.email.EmailAlreadyVerifiedException;
import com.alibou.security.exception.email.EmailExistsException;
import com.alibou.security.exception.email.EmailNotVerifiedException;
import com.alibou.security.model.FacebookUser;
import com.alibou.security.model.HttpResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;

import static com.alibou.security.exception.ExceptionHandling.createHttpResponse;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<HttpResponse> register(@Valid @RequestBody RegisterRequest request) throws EmailExistsException {
        return createHttpResponse(OK, service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request) throws EmailNotVerifiedException {
        return ResponseEntity.ok(service.authenticateWithCredentials(request));
    }

    @GetMapping("/verify-email-token")
    public ResponseEntity<HttpResponse> verifyEmail(@RequestParam String token) throws EmailAlreadyVerifiedException {
        return createHttpResponse(OK, service.verifyEmail(token));
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
