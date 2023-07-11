package com.thefuture.security.services;

import com.sun.mail.util.MailConnectException;
import com.thefuture.security.config.AppConfig;
import com.thefuture.security.dto.GoogleUserProfile;
import com.thefuture.security.exception.GoogleTokenException;
import com.thefuture.security.exception.email.EmailAlreadyVerifiedException;
import com.thefuture.security.exception.email.EmailExistsException;
import com.thefuture.security.exception.email.EmailNotVerifiedException;
import com.thefuture.security.exception.email.EmailTokenException;
import com.thefuture.security.model.FacebookUser;
import com.thefuture.security.request.AuthenticationRequest;
import com.thefuture.security.request.RegisterRequest;
import com.thefuture.security.response.AuthenticationResponse;
import com.thefuture.security.dto.Token;
import com.thefuture.security.repositories.TokenRepository;
import com.thefuture.security.dto.TokenType;
import com.thefuture.security.dto.Role;
import com.thefuture.security.model.User;
import com.thefuture.security.repositories.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.*;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.UUID;


@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AppConfig appConfig;
    private final NetHttpTransport transport = new NetHttpTransport();
    private final GsonFactory jsonFactory = new GsonFactory();

    @Value("${spring.mail.frontend-verify-page}")
    private String verifyPage;

    @Value("${google-client-id}")
    private String clientId;

    public String register(RegisterRequest request) throws EmailExistsException {
        if (repository.existsByEmail(request.getEmail())) {
            throw new EmailExistsException();
        }
        String emailVerificationToken = UUID.randomUUID().toString();
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .emailVerificationToken(emailVerificationToken)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        repository.save(user);
        String link = appConfig.getFrontendBaseUrl() + "/" + verifyPage + "/" + emailVerificationToken;
        String content;
        content = generateVerificationEmail(request.getFirstname(), link);
        try {
            emailService.sendEmail(request.getEmail(), content, "Verify your email");
            log.info("Email sent");
        } catch (Exception e) {
            log.error(e.getMessage());
            repository.delete(user);
            throw new RuntimeException("Failed to send email");
        }
        return "An email with verification link has been sent";
    }

    public AuthenticationResponse authenticateWithCredentials(AuthenticationRequest request) throws EmailNotVerifiedException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();
        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException();
        }
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticateWithGoogle(String googleToken) throws GeneralSecurityException, IOException {
        var googleUserProfile = verifyGoogleToken(googleToken);
        if (googleUserProfile == null) {
            throw new GoogleTokenException();
        }
        String jwtToken = generateJwtToken(googleUserProfile);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    public String generateJwtToken(GoogleUserProfile googleUserProfile) {
        var user = repository.findByEmail(googleUserProfile.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return jwtToken;
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public String verifyEmail(String token) throws EmailAlreadyVerifiedException {
        User user = repository.findByEmailVerificationToken(token).orElseThrow(EmailTokenException::new);
        if (user.isEmailVerified()) {
            throw new EmailAlreadyVerifiedException();
        }
        user.setEmailVerified(true);
        repository.save(user);
        return "Email verified successfully";
    }

    public GoogleUserProfile verifyGoogleToken(String token) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singleton(clientId))
                .build();
        GoogleIdToken idToken = verifier.verify(token);
        if (idToken == null) {
            return null;
        }
        GoogleIdToken.Payload payload = idToken.getPayload();
        String userId = payload.getSubject();
        String email = payload.getEmail();
        boolean emailVerified = payload.getEmailVerified();
        String name = (String) payload.get("name");
        String pictureUrl = (String) payload.get("picture");
        String locale = (String) payload.get("locale");
        String familyName = (String) payload.get("family_name");
        String givenName = (String) payload.get("given_name");
        return new GoogleUserProfile(userId, email, emailVerified, name, pictureUrl, locale, familyName, givenName);
    }

    public FacebookUser verifyFacebookToken(String accessToken) {
        String url = "https://graph.facebook.com/v16.0/me?fields=id,name,email,picture&access_token=" + accessToken;
        WebClient webClient = WebClient.create();
        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(FacebookUser.class)
                .block();
    }

    public String generateVerificationEmail(String name, String link) {
        try {
            String template = "";
            File file = ResourceUtils.getFile("classpath:templates/email-verification.html");
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line;
            while ((line = reader.readLine()) != null) {
                template += line;
            }
            reader.close();
            return template.replace("[name]", name).replace("[link]", link);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
