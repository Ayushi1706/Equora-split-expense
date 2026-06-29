package org.spring.equorabackend.Model.DTO;

import org.spring.equorabackend.Model.NotificationType;

import java.util.UUID;

public record CreateNotificationRequest(
        UUID userId,
        UUID actorId,
        NotificationType type,
        String title,
        String description
) {}