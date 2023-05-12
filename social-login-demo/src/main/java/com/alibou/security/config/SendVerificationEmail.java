package com.alibou.security.config;

import com.google.firebase.auth.ActionCodeSettings;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.UpdateRequest;

import java.util.concurrent.ExecutionException;

public class SendVerificationEmail {
    public void sendVerificationEmail(String email, String uid) {
        try {
            UserRecord user = FirebaseAuth.getInstance().getUser(uid);
            if (user.isEmailVerified()) {
                return;
            }

            ActionCodeSettings actionCodeSettings = ActionCodeSettings.builder()
                    .setUrl("https://example.com/email-verification?uid=" + uid)
                    .setHandleCodeInApp(true)
                    .setIosBundleId("com.example.ios")
                    .setAndroidPackageName("com.example.android")
                    .build();


            // Generate the email verification link URL
            String link = FirebaseAuth.getInstance().generateEmailVerificationLink(email, actionCodeSettings);

            // Send the verification email using Firebase Auth API
            FirebaseAuth.getInstance().updateUser(new UpdateRequest(uid).setEmailVerified(true));
        } catch (FirebaseAuthException e) {
            System.err.println("Error sending verification email: " + e.getMessage());
        }
    }
}

