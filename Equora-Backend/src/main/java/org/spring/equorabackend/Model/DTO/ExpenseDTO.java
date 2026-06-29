package org.spring.equorabackend.Model.DTO;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ExpenseDTO(
        UUID id,
        UUID groupId,
        String groupName,
        String description,
        String category,
        BigDecimal amount,
        String currency,
        UserDto paidBy,
        Instant date,
        List<ExpenseSplitDto> splits,
        BigDecimal yourShare
) {
}