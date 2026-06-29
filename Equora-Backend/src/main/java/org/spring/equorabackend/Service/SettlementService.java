package org.spring.equorabackend.Service;

import org.spring.equorabackend.Model.*;
import org.spring.equorabackend.Model.DTO.CreateNotificationRequest;
import org.spring.equorabackend.Model.DTO.CreateSettlementRequest;
import org.spring.equorabackend.Repository.GroupRepository;
import org.spring.equorabackend.Repository.SettlementRepository;
import org.spring.equorabackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class SettlementService {

    @Autowired
    private SettlementRepository settlementRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public Settlement createSettlement(CreateSettlementRequest request) {
        Group group = groupRepository.findById(request.groupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User fromUser = userRepository.findById(request.fromUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        User toUser = userRepository.findById(request.toUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        BigDecimal amount = request.amount();
        String currency = request.currency();
        SettlementMethod method = request.method();

        if (fromUser.getId().equals(toUser.getId())) {
            throw new RuntimeException("Sender and receiver cannot be the same.");
        }

        if (request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be greater than zero.");
        }

        Settlement settlement = new Settlement();
        settlement.setGroup(group);
        settlement.setFromUser(fromUser);
        settlement.setToUser(toUser);
        settlement.setAmount(amount);
        settlement.setCurrency(currency);
        settlement.setMethod(method);
        settlement.setStatus(SettlementStatus.PENDING);
        // Notify receiver that a payment is incoming
        notificationService.createNotification(new CreateNotificationRequest(
                toUser.getId(),
                fromUser.getId(),
                NotificationType.SETTLEMENT_REQUEST,
                "Payment Incoming",
                fromUser.getName() + " sent you a payment of " + amount + " " + currency + "."
        ));

        return settlementRepository.save(settlement);
    }


    public Settlement getSettlementById(UUID settlementId) {
        return settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement Not Found"));
    }

    public List<Settlement> getSettlementsForGroup(UUID groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        return settlementRepository.findByGroup(group);
    }

    public Settlement confirmSettlement(UUID settlementId) {

        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        if (settlement.getStatus() == SettlementStatus.COMPLETED) {
            throw new RuntimeException("Settlement is already confirmed.");
        }

        settlement.setStatus(SettlementStatus.COMPLETED);
        settlement.setSettledAt(Instant.now());
        // Notify sender that payment was confirmed
        notificationService.createNotification(new CreateNotificationRequest(
                settlement.getFromUser().getId(),
                settlement.getToUser().getId(),
                NotificationType.SETTLEMENT_RECEIVED,
                "Payment Confirmed",
                settlement.getToUser().getName() + " confirmed your payment of " + settlement.getAmount() + "."
        ));

        return settlementRepository.save(settlement);
    }

    public String deleteSettlement(UUID settlementId) {

        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        settlementRepository.delete(settlement);

        return "Settlement deleted successfully.";
    }
}
