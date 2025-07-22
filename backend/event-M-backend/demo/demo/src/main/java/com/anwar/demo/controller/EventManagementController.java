package com.anwar.demo.controller;

import com.anwar.demo.exception.ResourceNotFoundException;
import com.anwar.demo.model.Event;
import com.anwar.demo.model.User;
import com.anwar.demo.repository.EventRepository;
import com.anwar.demo.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/manage/events") // URL dédiée à l'administration
@PreAuthorize("hasRole('ADMIN') or hasRole('ORGANIZER')") // Sécurise tout le contrôleur
public class EventManagementController {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository eventRepository;

    /**
     * Inscrit un utilisateur spécifique à un événement.
     * Seul un Admin ou un Organizer peut le faire.
     * @param eventId L'ID de l'événement.
     * @param userId L'ID de l'utilisateur à inscrire.
     */
    @PostMapping("/{eventId}/participants/{userId}")
    public ResponseEntity<?> addParticipantToEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        eventService.registerUserToEvent(eventId, userId);
        return ResponseEntity.ok("User " + userId + " successfully added to event " + eventId);
    }

    /**
     * Retire un participant d'un événement.
     * Seul un Admin ou un Organizer peut le faire.
     * @param eventId L'ID de l'événement.
     * @param userId L'ID de l'utilisateur à retirer.
     */
    @DeleteMapping("/{eventId}/participants/{userId}")
    public ResponseEntity<?> removeParticipantFromEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        eventService.unregisterUserFromEvent(eventId, userId);
        return ResponseEntity.ok("User " + userId + " successfully removed from event " + eventId);
    }

    /**
     * Récupère la liste des participants pour un événement donné.
     * @param eventId L'ID de l'événement.
     * @return La liste des utilisateurs participants.
     */
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<Set<User>> getEventParticipants(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));
        return ResponseEntity.ok(event.getParticipants());
    }
}