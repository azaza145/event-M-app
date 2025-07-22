package com.anwar.demo.controller;

import com.anwar.demo.dto.EmailRequest;
import com.anwar.demo.exception.ResourceNotFoundException;
import com.anwar.demo.model.Event;
import com.anwar.demo.model.User;
import com.anwar.demo.repository.EventRepository;
import com.anwar.demo.repository.UserRepository;
import com.anwar.demo.service.EmailService;
import com.anwar.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organizer/events")
@PreAuthorize("hasRole('ORGANIZER') or hasRole('ADMIN')")
public class OrganizerController {

    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private UserService userService;
    @Autowired private EmailService emailService;

    /**
     * Verifies that the current user is the organizer of the specified event, or is an admin.
     * @param event The event to check ownership for.
     * @throws AccessDeniedException if the user is not the owner/admin.
     */
    private void verifyOwnership(Event event) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        if (event.getOrganizer() == null || !event.getOrganizer().getId().equals(currentUser.getId()) && !currentUser.getRole().name().equals("ADMIN")) {
            throw new AccessDeniedException("You do not have permission to manage this event.");
        }
    }

    @DeleteMapping("/{eventId}/participants/{userId}")
    public ResponseEntity<Event> removeParticipant(@PathVariable Long eventId, @PathVariable Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        verifyOwnership(event);

        User userToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        event.getParticipants().remove(userToRemove);
        Event updatedEvent = eventRepository.save(event);
        return ResponseEntity.ok(updatedEvent);
    }

    @PostMapping("/{eventId}/email")
    public ResponseEntity<?> emailParticipants(@PathVariable Long eventId, @RequestBody EmailRequest emailRequest) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        verifyOwnership(event);

        List<String> recipientEmails = event.getParticipants().stream()
                .map(User::getEmail)
                .collect(Collectors.toList());

        if (recipientEmails.isEmpty()) {
            return ResponseEntity.badRequest().body("There are no participants to email.");
        }

        emailService.sendBulkEmail(recipientEmails, emailRequest.getSubject(), emailRequest.getBody());
        return ResponseEntity.ok("Email sent to " + recipientEmails.size() + " participant(s).");
    }
}