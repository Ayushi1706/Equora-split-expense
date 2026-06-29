package org.spring.equorabackend.Service;

import org.spring.equorabackend.Model.*;
import org.spring.equorabackend.Model.DTO.UserBalance;
import org.spring.equorabackend.Model.DTO.UserGroupBalance;
import org.spring.equorabackend.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Service
public class BalanceCalculationService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private ExpenseSplitRepository expenseSplitRepository;

    @Autowired
    private SettlementRepository settlementRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private UserRepository userRepository;

    public List<UserBalance> getGroupBalances(UUID groupId) {

        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<GroupMember> members = groupMemberRepository.findByGroup(group);

        List<UserBalance> balances = new ArrayList<>();

        for (GroupMember member : members) {
            User user = member.getUser();
            BigDecimal netBalance = calculateNetBalance(user, group);

            balances.add(new UserBalance(
                    user.getId(),
                    user.getName(),
                    netBalance
            ));
        }

        return balances;
    }

    public List<UserGroupBalance> getUserBalanceSummary(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<GroupMember> memberships = groupMemberRepository.findByUser(user);

        List<UserGroupBalance> summary = new ArrayList<>();

        for (GroupMember membership : memberships) {
            Group group = membership.getGroup();
            BigDecimal netBalance = calculateNetBalance(user, group);

            summary.add(new UserGroupBalance(
                    group.getId(),
                    group.getName(),
                    netBalance
            ));
        }

        return summary;
    }

    private BigDecimal calculateNetBalance(User user, Group group) {

        BigDecimal totalPaid = BigDecimal.ZERO;
        BigDecimal totalOwed = BigDecimal.ZERO;
        BigDecimal settledOut = BigDecimal.ZERO;
        BigDecimal settledIn = BigDecimal.ZERO;

        List<Expense> paidExpenses = expenseRepository.findByGroupAndPaidBy(group, user);
        for (Expense expense : paidExpenses) {
            totalPaid = totalPaid.add(expense.getAmount());
        }

        List<ExpenseSplit> splits = expenseSplitRepository.findByUserAndExpense_Group(user, group);
        for (ExpenseSplit split : splits) {
            totalOwed = totalOwed.add(split.getAmount());
        }

        List<Settlement> outgoing = settlementRepository.findByFromUserIdAndGroupIdAndStatus(
                user.getId(), group.getId(), SettlementStatus.COMPLETED);
        for (Settlement settlement : outgoing) {
            settledOut = settledOut.add(settlement.getAmount());
        }

        List<Settlement> incoming = settlementRepository.findByToUserIdAndGroupIdAndStatus(
                user.getId(), group.getId(), SettlementStatus.COMPLETED);
        for (Settlement settlement : incoming) {
            settledIn = settledIn.add(settlement.getAmount());
        }

        return totalPaid
                .subtract(totalOwed)
                .add(settledOut)
                .subtract(settledIn);
    }
}