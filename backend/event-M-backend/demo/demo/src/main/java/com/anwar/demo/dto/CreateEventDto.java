package com.anwar.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateEventDto {
    private String title;
    private String description;
    private LocalDate date;
    private String location;
    private String status;
}