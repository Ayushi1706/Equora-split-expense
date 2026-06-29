package org.spring.equorabackend.Service;

import org.spring.equorabackend.Model.DTO.CreateNotificationRequest;
import org.spring.equorabackend.Model.Notification;
import org.spring.equorabackend.Model.NotificationType;
import org.spring.equorabackend.Model.User;
import org.spring.equorabackend.Repository.NotificationRepository;
import org.spring.equorabackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;
    public Notification createNotification(CreateNotificationRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not Found"));

        User actor = null;

        if (request.actorId() != null) {
            actor = userRepository.findById(request.actorId())
                    .orElseThrow(() -> new RuntimeException("Actor not found"));
        }

        NotificationType type = request.type();

        String title = request.title();

        String description = request.description();



        Notification notification = new Notification();

        notification.setUser(user);
        notification.setActor(actor);
        notification.setType(type);
        notification.setTitle(title);
        notification.setDescription(description);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not Found"));

        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Notification markAsRead(UUID notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.isRead()) {
            notification.setRead(true);
            notification = notificationRepository.save(notification);
        }

        return notification;
    }

    public String deleteNotification(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not Found"));

        notificationRepository.delete(notification);

        return "Notification deleted Successfully";
    }
}
