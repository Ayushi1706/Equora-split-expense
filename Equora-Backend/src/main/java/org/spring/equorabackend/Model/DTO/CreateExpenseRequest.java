package org.spring.equorabackend.Model.DTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CreateExpenseRequest(
        UUID groupId,
        String description,
        String category,
        BigDecimal amount,
        String currency,
        UUID paidByUserId,
        List<ExpenseSplitRequest> splits
) {
}