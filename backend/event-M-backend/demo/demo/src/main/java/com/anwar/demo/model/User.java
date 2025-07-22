package com.anwar.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ... (firstName, lastName, department, email, password, role, status fields) ...
    private String firstName;
    private String lastName;
    private String department;
    @Column(unique = true, nullable = false)
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.PENDING_APPROVAL;

    // ... (password reset token fields) ...
    private String passwordResetToken;
    private LocalDateTime passwordResetTokenExpiry;


    /**
     * The set of events this user is registered for as a participant.
     */
    @ManyToMany(mappedBy = "participants")
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Event> events = new HashSet<>();

    /**
     * === THIS IS THE FIX ===
     * The set of events this user has created (as an organizer).
     * 'mappedBy = "organizer"' links this to the 'organizer' field in the Event class.
     */
    @OneToMany(mappedBy = "organizer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Event> organizedEvents = new HashSet<>();

    public User() {}
}