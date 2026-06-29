package org.spring.equorabackend.Model.DTO;

import java.math.BigDecimal;
import java.util.UUID;

public record UserBalance(
        UUID userId,
        String userName,
        BigDecimal netBalance
) {}