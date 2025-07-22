package com.anwar.demo.controller;

import com.anwar.demo.model.Notification;
import com.anwar.demo.model.User;
import com.anwar.demo.repository.NotificationRepository;
import com.anwar.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // Make sure this is imported
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired private NotificationRepository notificationRepository;
    @Autowired private UserService userService;

    // --- THIS IS THE FIX ---
    // Add the @PreAuthorize annotation to ensure that only logged-in users
    // can access their own notifications.
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public List<Notification> getMyNotifications() {
        User currentUser = userService.getCurrentAuthenticatedUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    @PostMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        Notification notification = notificationRepository.findById(id).orElse(null);

        // Security check: ensure user can only mark their own notifications as read
        if (notification != null && notification.getUser().getId().equals(currentUser.getId())) {
            notification.setRead(true);
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        }

        // Return a forbidden status if they try to access someone else's notification
        return ResponseEntity.status(403).build();
    }
}