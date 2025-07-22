package com.anwar.demo.service;

import com.anwar.demo.model.Notification;
import com.anwar.demo.model.User;
import com.anwar.demo.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service // This annotation is crucial
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(User user, String message, String link) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setLink(link);
        notificationRepository.save(notification);
    }
}