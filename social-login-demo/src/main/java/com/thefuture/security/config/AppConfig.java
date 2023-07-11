package com.thefuture.security.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

@Component
@Getter
@Setter
@RequiredArgsConstructor
public class AppConfig {
    @Value("${production}")
    private boolean production;


    private String projectName;
    private String backendBaseUrl;
    private String frontendBaseUrl;

    @PostConstruct
    public void init() {
        setProjectName("Social Login");
        if (production) {
            setBackendBaseUrl("https://example.com");
            setFrontendBaseUrl("https://example.com");
        } else {
            setBackendBaseUrl("http://localhost:8080");
            setFrontendBaseUrl("http://localhost:2023");
        }
    }
}
