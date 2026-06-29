package org.spring.equorabackend.Model.DTO;

import java.util.UUID;

public record UserDto(
        UUID id,
        String name,
        String email,
        String avatarColor,
        String initials
) {
}