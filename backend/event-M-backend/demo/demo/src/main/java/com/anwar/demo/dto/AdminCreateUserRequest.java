package com.anwar.demo.dto;

import com.anwar.demo.model.Role;
import lombok.Data;

// The @Data annotation from Lombok will automatically create
// the constructor, getters, setters, toString(), etc. for you.
@Data
public class AdminCreateUserRequest {

    private String firstName;
    private String lastName;
    private String department;
    private String email;
    private String password;
    private Role role; // The admin specifies the role for the new user

}