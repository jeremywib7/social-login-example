package com.alibou.security.service;

import java.util.UUID;

import com.alibou.security.config.AppConfig;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@AllArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final AppConfig appConfig;

    public void sendEmail(String toEmail, String content, String subject) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(content, true);
            helper.setTo(toEmail);
            helper.setSentDate(new Date());
            helper.setSubject(appConfig.getProjectName() + " - " + subject);
            helper.setFrom("jeremywib7@gmail.com");
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("failed to send email");
            throw new IllegalStateException("failed to send email");
        }
    }
}
