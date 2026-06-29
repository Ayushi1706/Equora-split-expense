package org.spring.equorabackend.Service;

import org.spring.equorabackend.Model.DTO.DashboardResponse;
import org.spring.equorabackend.Model.DTO.UserGroupBalance;
import org.spring.equorabackend.Model.Group;
import org.spring.equorabackend.Model.Notification;
import org.spring.equorabackend.Model.User;
import org.spring.equorabackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {
    @Autowired
    private GroupService groupService;

    @Autowired
    private BalanceCalculationService balanceCalculationService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public DashboardResponse getUserDashboard(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Group> groups = groupService.getGroupsForUser(userId);
        List<UserGroupBalance> balances = balanceCalculationService.getUserBalanceSummary(userId);
        List<Notification> notifications = notificationService.getNotificationsForUser(user.getId())
                .stream()
                .limit(5)
                .toList();
        long unreadCount = notifications.stream()
                .filter(notification -> !notification.isRead())
                .count();
        return new DashboardResponse(
                groups,
                balances,
                notifications,
                unreadCount
        );
    }
}
