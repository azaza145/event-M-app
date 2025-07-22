package com.anwar.demo.dto;

import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String role;
    // Add these fields to send back user info
    private String firstName;
    private String lastName;
    private String department;

    public JwtResponse(String accessToken, Long id, String email, String role, String firstName, String lastName, String department) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
    }
}