package org.spring.equorabackend.Model.DTO;

import java.math.BigDecimal;
import java.util.UUID;

public record ExpenseSplitRequest(
        UUID userId,
        BigDecimal amount
) {
}