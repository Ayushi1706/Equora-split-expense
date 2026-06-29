package org.spring.equorabackend.Repository;

import org.spring.equorabackend.Model.Group;
import org.spring.equorabackend.Model.Settlement;
import org.spring.equorabackend.Model.SettlementStatus;
import org.spring.equorabackend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, UUID> {

    List<Settlement> findByGroup(Group group);

    @Query("SELECT s FROM Settlement s WHERE s.fromUser.id = :userId AND s.group.id = :groupId AND s.status = :status")
    List<Settlement> findByFromUserIdAndGroupIdAndStatus(
            @Param("userId") UUID userId,
            @Param("groupId") UUID groupId,
            @Param("status") SettlementStatus status
    );

    @Query("SELECT s FROM Settlement s WHERE s.toUser.id = :userId AND s.group.id = :groupId AND s.status = :status")
    List<Settlement> findByToUserIdAndGroupIdAndStatus(
            @Param("userId") UUID userId,
            @Param("groupId") UUID groupId,
            @Param("status") SettlementStatus status
    );
}