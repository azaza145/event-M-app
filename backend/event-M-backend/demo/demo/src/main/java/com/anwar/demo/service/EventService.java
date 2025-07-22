package com.anwar.demo.service;

import com.anwar.demo.exception.ResourceNotFoundException;
import com.anwar.demo.model.Event;
import com.anwar.demo.model.User;
import com.anwar.demo.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // <-- ADD THIS IMPORT

@Service // <--- THIS ANNOTATION IS THE FIX
public class EventService {

    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private UserService userService;

    public Event createEvent(Event event) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        event.setOrganizer(currentUser);
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setDate(eventDetails.getDate());
        event.setLocation(eventDetails.getLocation());
        event.setStatus(eventDetails.getStatus());

        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    public void registerUserToEvent(Long eventId, Long userId) {
    }

    public void unregisterUserFromEvent(Long eventId, Long userId) {
    }
}