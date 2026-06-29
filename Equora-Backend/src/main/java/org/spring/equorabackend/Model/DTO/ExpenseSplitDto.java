package org.spring.equorabackend.Model.DTO;

import java.math.BigDecimal;
import java.util.UUID;

public record ExpenseSplitDto(
        UUID userId,
        String userName,
        BigDecimal amount
) {
}