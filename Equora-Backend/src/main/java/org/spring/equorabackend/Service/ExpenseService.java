package org.spring.equorabackend.Service;

import jakarta.transaction.Transactional;
import org.spring.equorabackend.Model.*;
import org.spring.equorabackend.Model.DTO.CreateExpenseRequest;
import org.spring.equorabackend.Model.DTO.CreateNotificationRequest;
import org.spring.equorabackend.Model.DTO.ExpenseSplitRequest;
import org.spring.equorabackend.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseSplitRepository expenseSplitRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Expense createExpense(CreateExpenseRequest request) {

        Group group = groupRepository.findById(request.groupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User paidBy = userRepository.findById(request.paidByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal totalSplit = request.splits().stream()
                .map(ExpenseSplitRequest::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalSplit.compareTo(request.amount()) != 0) {
            throw new RuntimeException(
                    "Split amounts (" + totalSplit + ") do not match expense total (" + request.amount() + ")"
            );
        }

        Expense expense = new Expense();
        expense.setGroup(group);
        expense.setDescription(request.description());
        expense.setCategory(ExpenseCategory.valueOf(request.category().toUpperCase()));
        expense.setAmount(request.amount());
        expense.setCurrency(request.currency());
        expense.setPaidBy(paidBy);

        expense = expenseRepository.save(expense);

        for (ExpenseSplitRequest splitRequest : request.splits()) {

            User user = userRepository.findById(splitRequest.userId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!groupMemberRepository.existsByGroupAndUser(group, user)) {
                GroupMember member = new GroupMember();
                member.setGroup(group);
                member.setUser(user);
                groupMemberRepository.save(member);
            }

            ExpenseSplit split = new ExpenseSplit();
            split.setExpense(expense);
            split.setUser(user);
            split.setAmount(splitRequest.amount());
            expenseSplitRepository.save(split);
        }
        // Notify all participants except the payer
        for (ExpenseSplitRequest splitRequest : request.splits()) {
            if (!splitRequest.userId().equals(request.paidByUserId())) {
                notificationService.createNotification(new CreateNotificationRequest(
                        splitRequest.userId(),
                        request.paidByUserId(),
                        NotificationType.EXPENSE_ADDED,
                        "Expense Added",
                        paidBy.getName() + " added " + request.description() + " expense."
                ));
            }
        }

        return expense;
    }

    public Expense getExpenseById(UUID expenseId) {
        return expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not Found"));
    }


    public List<Expense> getExpensesForGroup(UUID groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        return expenseRepository.findByGroup(group);
    }

    @Transactional
    public String deleteExpense(UUID expenseId) {

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expenseSplitRepository.deleteByExpense(expense);

        expenseRepository.delete(expense);

        return "Deleted Successfully";
    }

    @Transactional
    public Expense updateExpense(UUID expenseId, CreateExpenseRequest request) {

        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        Group group = groupRepository.findById(request.groupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User paidBy = userRepository.findById(request.paidByUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        expense.setGroup(group);
        expense.setDescription(request.description());
        expense.setAmount(request.amount());
        expense.setCategory(ExpenseCategory.valueOf(request.category().toUpperCase()));
        expense.setCurrency(request.currency());
        expense.setPaidBy(paidBy);

        expense = expenseRepository.save(expense);

        expenseSplitRepository.deleteByExpense(expense);

        for (ExpenseSplitRequest splitRequest : request.splits()) {

            User user = userRepository.findById(splitRequest.userId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!groupMemberRepository.existsByGroupAndUser(group, user)) {
                GroupMember member = new GroupMember();
                member.setGroup(group);
                member.setUser(user);
                groupMemberRepository.save(member);
            }

            ExpenseSplit split = new ExpenseSplit();
            split.setExpense(expense);
            split.setUser(user);
            split.setAmount(splitRequest.amount());
            expenseSplitRepository.save(split);
        }

        return expense;
    }
}
