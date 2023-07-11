package com.thefuture.security.filter;

import com.thefuture.security.exception.RecaptchaInvalidException;
import com.thefuture.security.dto.RecaptchaResponse;
import com.thefuture.security.services.RecaptchaService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class RecaptchaFilter extends OncePerRequestFilter {

    @Value("${recaptcha.enable}")
    private boolean enableRecaptcha;

    private final RecaptchaService recaptchaService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (enableRecaptcha) {
            if (request.getMethod().equals("POST")) {
                String recaptcha = request.getHeader("recaptcha");
                RecaptchaResponse recaptchaResponse = recaptchaService.validateToken(recaptcha);
                if (!recaptchaResponse.success()) {
                    log.info("Invalid reCAPTCHA token");
                    throw new RecaptchaInvalidException("Invalid reCaptcha token");
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
