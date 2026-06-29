package org.spring.equorabackend.Controller;

import org.spring.equorabackend.Model.DTO.MemberDTO;
import org.spring.equorabackend.Model.Group;
import org.spring.equorabackend.Model.GroupMember;
import org.spring.equorabackend.Service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class GroupController {
    @Autowired
    private GroupService groupService;

    @PostMapping("/group")
    public Group createGroup(
            @RequestBody Group group,
            Authentication authentication) {

        UUID creatorId = (UUID) authentication.getPrincipal();

        return groupService.createGroup(group, creatorId);
    }

    @GetMapping("/group/{groupId}")
    public Group getGroupById(@PathVariable UUID groupId){
        return groupService.getGroupById(groupId);
    }

    @GetMapping("/group/user/{userId}")
    public List<Group> getGroupsForUser(@PathVariable UUID userId){
        return groupService.getGroupsForUser(userId);
    }

    @PostMapping("/group/{groupId}/members")
    public String addMember(@PathVariable UUID groupId,
                            @RequestParam UUID userId){
        return groupService.addMember(groupId,userId);
    }

    @DeleteMapping("/group/{groupId}/members/{userId}")
    public GroupMember removeMember(@PathVariable UUID groupId,
                                    @PathVariable UUID userId){
        return groupService.removeMember(groupId,userId);
    }

    @DeleteMapping("/group/{groupId}")
    public Group removeGroup(@PathVariable UUID groupId){
        return groupService.removeGroup(groupId);
    }

    @PutMapping("/group/{groupId}")
    public Group updateGroup(@PathVariable UUID groupId,
                             @RequestBody Group group) {
        return groupService.updateGroup(groupId, group);
    }

    @GetMapping("/group/{groupId}/members/count")
    public Long getMemberCount(@PathVariable UUID groupId) {
        return groupService.getMemberCount(groupId);
    }

    @GetMapping("/group/search")
    public List<Group> searchGroups(@RequestParam String name) {
        return groupService.searchGroups(name);
    }

    @GetMapping("/group/{groupId}/members")
    public List<MemberDTO> getGroupMembers(@PathVariable UUID groupId) {
        return groupService.getGroupMembers(groupId);
    }
    @PostMapping("/group/{groupId}/members/email")
    public String addMemberByEmail(@PathVariable UUID groupId,
                                   @RequestParam String email) {
        return groupService.addMemberByEmail(groupId, email);
    }
}
