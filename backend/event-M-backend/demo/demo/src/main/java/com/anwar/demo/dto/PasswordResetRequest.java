package com.anwar.demo.dto;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String email;
    private String securityAnswer;
}