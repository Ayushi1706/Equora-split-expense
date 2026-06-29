package org.spring.equorabackend.Model.DTO;

import org.spring.equorabackend.Model.Group;
import org.spring.equorabackend.Model.Notification;

import java.util.List;

public record DashboardResponse(

        List<Group> groups,

        List<UserGroupBalance> balances,

        List<Notification> recentNotifications,

        long unreadNotificationCount

) {
}