package org.spring.equorabackend.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    private String description;

    @Enumerated(EnumType.STRING)
    private ExpenseCategory category;

    private BigDecimal amount;

    private String currency;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User paidBy;

    private Instant expenseDate;

    @PrePersist
    protected void onCreate() {
        if (expenseDate == null) {
            expenseDate = Instant.now();
        }
    }

}