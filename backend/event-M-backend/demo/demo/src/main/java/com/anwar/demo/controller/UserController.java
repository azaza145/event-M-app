package com.anwar.demo.controller;

import com.anwar.demo.exception.ResourceNotFoundException;
import com.anwar.demo.model.Role;
import com.anwar.demo.model.User;
import com.anwar.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    /**
     * THIS IS THE FIX.
     * This is now the ONLY method that responds to GET /api/users.
     * It is accessible to any authenticated user and correctly filters out admins,
     * making it safe for Organizers to call.
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<User> getAllUsersForInvitation() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != Role.ADMIN)
                .collect(Collectors.toList());
    }

    /**
     * Gets the specific event IDs a user is registered for.
     */
    @GetMapping("/{userId}/registrations/ids")
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<Set<Long>> getRegisteredEventIds(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        Set<Long> eventIds = userRepository.findRegisteredEventIdsByUserId(userId);
        return ResponseEntity.ok(eventIds);
    }

    /**
     * Gets the count of a user's event registrations for dashboard stats.
     */
    @GetMapping("/{userId}/registrations/count")
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<Long> getRegistrationCount(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return ResponseEntity.ok((long) user.getEvents().size());
    }
}