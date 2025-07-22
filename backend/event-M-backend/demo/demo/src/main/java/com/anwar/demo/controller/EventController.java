package com.anwar.demo.controller;

import com.anwar.demo.dto.AddParticipantRequest;
import com.anwar.demo.exception.ResourceNotFoundException;
import com.anwar.demo.model.Event;
import com.anwar.demo.model.User;
import com.anwar.demo.repository.EventRepository;
import com.anwar.demo.repository.UserRepository;
import com.anwar.demo.service.EmailService;
import com.anwar.demo.service.EventService;
import com.anwar.demo.service.NotificationService;
import com.anwar.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventService eventService;
    private final EmailService emailService;
    private final NotificationService notificationService;
    private final UserService userService; // This was the missing dependency

    /**
     * THIS IS THE FIX
     * By adding UserService to the constructor, we ensure that Spring correctly
     * injects an instance of it when creating the EventController. This prevents
     * the NullPointerException when calling getMyOrganizedEvents.
     */
    @Autowired
    public EventController(
            EventRepository eventRepository,
            UserRepository userRepository,
            EventService eventService,
            EmailService emailService,
            NotificationService notificationService,
            UserService userService) { // <-- Added here
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.eventService = eventService;
        this.emailService = emailService;
        this.notificationService = notificationService;
        this.userService = userService; // <-- And initialized here
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Event> getAllEvents(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String status) {
        if (searchTerm != null || status != null) {
            return eventRepository.searchAndFilterEvents(searchTerm, status, LocalDate.now());
        }
        return eventRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return ResponseEntity.ok(event);
    }

    @GetMapping("/my-events")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    public List<Event> getMyOrganizedEvents() {
        // This line will no longer crash because userService is properly injected.
        User currentUser = userService.getCurrentAuthenticatedUser();
        return eventRepository.findByOrganizerId(currentUser.getId());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event eventDetails) {
        Event updatedEvent = eventService.updateEvent(id, eventDetails);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().body("Event with ID " + id + " deleted successfully.");
    }

    @PostMapping("/{eventId}/participants")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Event> addParticipantToEvent(@PathVariable Long eventId, @RequestBody AddParticipantRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        User userToAdd = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (event.getParticipants().contains(userToAdd)) {
            return ResponseEntity.badRequest().build();
        }

        event.getParticipants().add(userToAdd);
        Event updatedEvent = eventRepository.save(event);

        String message = "Votre inscription à l'événement \"" + updatedEvent.getTitle() + "\" est confirmée.";
        notificationService.createNotification(userToAdd, message, "/events/" + updatedEvent.getId());
        emailService.sendRegistrationConfirmation(userToAdd, updatedEvent);

        return ResponseEntity.ok(updatedEvent);
    }
}