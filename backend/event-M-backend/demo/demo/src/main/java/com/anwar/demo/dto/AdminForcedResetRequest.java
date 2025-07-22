package com.anwar.demo.dto;

import lombok.Data;

@Data
public class AdminForcedResetRequest {
    private String email;
    private String newPassword;
}