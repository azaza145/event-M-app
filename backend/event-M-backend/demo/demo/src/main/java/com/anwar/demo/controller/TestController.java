package com.anwar.demo.controller; // Make sure this package name is correct

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api") // All URLs in this class will start with /api
public class TestController {

    // This method will handle GET requests to /api/hello
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello! My Spring Boot backend is working!";
    }
}