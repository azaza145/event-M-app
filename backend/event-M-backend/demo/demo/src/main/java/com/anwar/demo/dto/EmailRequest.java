package com.anwar.demo.dto;

import lombok.Data;

@Data
public class EmailRequest {
    private String subject;
    private String body;
}