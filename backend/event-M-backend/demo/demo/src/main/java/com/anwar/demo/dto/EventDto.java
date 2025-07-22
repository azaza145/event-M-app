package com.anwar.demo.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EventDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate date;
    private String location;
    private String status;
    private int participantCount; // We send the count, not the full list
}