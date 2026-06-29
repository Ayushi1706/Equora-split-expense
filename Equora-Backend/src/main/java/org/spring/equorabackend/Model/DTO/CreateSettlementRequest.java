package org.spring.equorabackend.Model.DTO;

import org.spring.equorabackend.Model.SettlementMethod;

import java.math.BigDecimal;
import java.util.UUID;

public record CreateSettlementRequest(
        UUID groupId,
        UUID fromUserId,
        UUID toUserId,
        BigDecimal amount,
        String currency,
        SettlementMethod method
) {
}