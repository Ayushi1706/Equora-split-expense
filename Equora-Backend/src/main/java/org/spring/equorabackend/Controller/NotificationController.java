package org.spring.equorabackend.Controller;

import org.spring.equorabackend.Model.DTO.CreateNotificationRequest;
import org.spring.equorabackend.Model.Notification;
import org.spring.equorabackend.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notification")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public Notification createNotification(
            @RequestBody CreateNotificationRequest request) {
        return notificationService.createNotification(request);
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getNotificationsForUser(
            @PathVariable UUID userId) {
        return notificationService.getNotificationsForUser(userId);
    }

    @PatchMapping("/{notificationId}/read")
    public Notification markAsRead(
            @PathVariable UUID notificationId) {
        return notificationService.markAsRead(notificationId);
    }

    @DeleteMapping("/{notificationId}")
    public String deleteNotification(
            @PathVariable UUID notificationId) {
        return notificationService.deleteNotification(notificationId);
    }
}