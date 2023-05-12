package com.alibou.security.recaptcha;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "recaptcha")
public record RecaptchaProperties(String verifyUrl, String secretKey) {
}
