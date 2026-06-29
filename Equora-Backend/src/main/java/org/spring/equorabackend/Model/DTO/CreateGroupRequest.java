package org.spring.equorabackend.Model.DTO;

import java.util.List;
import java.util.UUID;

public record CreateGroupRequest(
        String name,
        String emoji,
        String category,
        String currency,
        List<UUID> memberIds
) {
}