package org.spring.equorabackend.Model.DTO;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record GroupDto(
        UUID id,
        String name,
        String emoji,
        String category,
        String currency,
        List<UserDto> members,
        BigDecimal totalExpenses,
        BigDecimal yourBalance,
        Instant lastActivityAt
) {
}