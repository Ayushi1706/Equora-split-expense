package org.spring.equorabackend.Repository;

import jakarta.transaction.Transactional;
import org.spring.equorabackend.Model.Group;
import org.spring.equorabackend.Model.GroupMember;
import org.spring.equorabackend.Model.GroupMemberId;
import org.spring.equorabackend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, GroupMemberId> {
    List<GroupMember> findByUser_Id(UUID userId);

    Long countByGroup_Id(UUID groupId);
    @Modifying
    @Transactional
    void deleteByGroup_Id(UUID groupId);
    boolean existsByGroupAndUser(Group group, User user);

    List<GroupMember> findByGroup(Group group);

    List<GroupMember> findByUser(User user);
}
