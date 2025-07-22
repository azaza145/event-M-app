package com.anwar.demo.dto;

public class ForgotPasswordRequest {
    private String email;

    // Constructors
    public ForgotPasswordRequest() {}
    public ForgotPasswordRequest(String email) {
        this.email = email;
    }

    // Getter and Setter
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}