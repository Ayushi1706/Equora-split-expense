package org.spring.equorabackend.Service;

import jakarta.transaction.Transactional;
import org.spring.equorabackend.Model.DTO.MemberDTO;
import org.spring.equorabackend.Model.Group;
import org.spring.equorabackend.Model.GroupMember;
import org.spring.equorabackend.Model.GroupMemberId;
import org.spring.equorabackend.Model.User;
import org.spring.equorabackend.Repository.GroupMemberRepository;
import org.spring.equorabackend.Repository.GroupRepository;
import org.spring.equorabackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepo;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private UserRepository userRepository;
@Transactional
    public Group createGroup(Group group, UUID creatorId) {
        Group savedGroup = groupRepo.save(group);

        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new RuntimeException("Creator user not found"));

        GroupMemberId id = new GroupMemberId(savedGroup.getId(), creator.getId());

        GroupMember creatorMembership = new GroupMember();
        creatorMembership.setId(id);
        creatorMembership.setGroup(savedGroup);
        creatorMembership.setUser(creator);

        groupMemberRepository.save(creatorMembership);

        return savedGroup;
    }

    public Group getGroupById(UUID groupId) {
        return groupRepo.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    public List<Group> getGroupsForUser(UUID userId) {
        List<GroupMember> memberships = groupMemberRepository.findByUser_Id(userId);

        return memberships.stream()
                .map(GroupMember::getGroup)
                .toList();
    }

    public String addMember(UUID groupId, UUID userId) {

        GroupMemberId id = new GroupMemberId(groupId, userId);

        if (groupMemberRepository.existsById(id)) {
            throw new RuntimeException("User is already a member of this group");
        }

        Group group = getGroupById(groupId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        GroupMember member = new GroupMember();
        member.setId(id);
        member.setGroup(group);
        member.setUser(user);

        groupMemberRepository.save(member);

        return "Member added successfully";
    }

    public GroupMember removeMember(UUID groupId, UUID userId) {

        GroupMemberId id = new GroupMemberId(groupId, userId);

        GroupMember member = groupMemberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member Not Found"));

        groupMemberRepository.delete(member);
        return member;

    }
    @Transactional
    public Group removeGroup(UUID groupId) {

        Group group = getGroupById(groupId);

        groupMemberRepository.deleteByGroup_Id(groupId);

        groupRepo.delete(group);

        return group;
    }

    public Group updateGroup(UUID groupId, Group newGroup) {
        Group group = getGroupById(groupId);
        group.setName(newGroup.getName());
        group.setEmoji(newGroup.getEmoji());
        group.setCategory(newGroup.getCategory());
        group.setCurrency(newGroup.getCurrency());

        return groupRepo.save(group);
    }

    public Long getMemberCount(UUID groupId) {
        getGroupById(groupId);

        return groupMemberRepository.countByGroup_Id(groupId);
    }

    public List<Group> searchGroups(String name) {
        return groupRepo.searchByName(name);
    }

    public List<MemberDTO> getGroupMembers(UUID groupId) {
        Group group = groupRepo.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        return groupMemberRepository.findByGroup(group)
                .stream()
                .map(m -> new MemberDTO(
                        m.getUser().getId(),
                        m.getUser().getName(),
                        m.getUser().getEmail()
                ))
                .toList();
    }

    public String addMemberByEmail(UUID groupId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No user found with that email"));

        GroupMemberId id = new GroupMemberId(groupId, user.getId());

        if (groupMemberRepository.existsById(id)) {
            throw new RuntimeException("User is already a member of this group");
        }

        Group group = getGroupById(groupId);

        GroupMember member = new GroupMember();
        member.setId(id);
        member.setGroup(group);
        member.setUser(user);

        groupMemberRepository.save(member);

        return "Member added successfully";
    }
}
