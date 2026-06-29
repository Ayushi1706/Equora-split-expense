package org.spring.equorabackend.Model.DTO;

import org.spring.equorabackend.Model.NotificationType;

import java.time.Instant;
import java.util.UUID;

public record NotificationDto(
        UUID id,
        NotificationType type,
        String title,
        String description,
        Instant timestamp,
        boolean read,
        UserDto actor
) {
}