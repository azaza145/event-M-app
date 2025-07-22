package com.anwar.demo.controller;

import com.anwar.demo.dto.AdminForcedResetRequest;
import com.anwar.demo.dto.ForgotPasswordRequest;
import com.anwar.demo.dto.ResetPasswordRequest;
import com.anwar.demo.service.EmailService;
import com.anwar.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    private final UserService userService;
    private final EmailService emailService;

    public PasswordController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = userService.createPasswordResetTokenForUser(user);
            String resetUrl = "http://localhost:4200/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);
        });
        // We always return a generic message to prevent email enumeration attacks.
        return ResponseEntity.ok("If an account with that email address exists, a password reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        String validationResult = userService.validatePasswordResetToken(request.getToken());
        if (validationResult != null) {
            return ResponseEntity.badRequest().body(validationResult);
        }
        userService.changeUserPasswordByToken(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Your password has been reset successfully.");
    }

    @PostMapping("/force-reset")
    public ResponseEntity<?> forceResetPassword(@RequestBody AdminForcedResetRequest request) {
        userService.changeUserPasswordByEmail(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok("Password has been reset successfully. The user can now log in.");
    }
}