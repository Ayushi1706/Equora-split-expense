package org.spring.equorabackend.Model.DTO;

import java.math.BigDecimal;
import java.util.UUID;

public record UserGroupBalance(
        UUID groupId,
        String groupName,
        BigDecimal netBalance
) {}