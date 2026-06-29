package org.spring.equorabackend.Model.DTO;

import org.spring.equorabackend.Model.SettlementMethod;
import org.spring.equorabackend.Model.SettlementStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record SettlementDto(
        UUID id,
        UserDto from,
        UserDto to,
        BigDecimal amount,
        String currency,
        SettlementStatus status,
        String groupName,
        Instant date,
        SettlementMethod method
) {
}