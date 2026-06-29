package org.spring.equorabackend.Controller;

import org.spring.equorabackend.Model.DTO.UserDto;
import org.spring.equorabackend.Model.User;
import org.spring.equorabackend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("user/{userId}")
    public User getUser(@PathVariable UUID userId){
       return userService.getUser(userId);
    }

    @GetMapping("user")
    public List<User> getAllUsers(){
        return userService.getAllUser();
    }

    @PostMapping("create")
    public User createUser(@RequestBody User user){
        return userService.saveUser(user);
    }

    @PutMapping("user/{userId}")
    public UserDto updateUser(
            @PathVariable UUID userId,
            @RequestBody UserDto request) {

        return userService.updateUser(userId, request);
    }

    @DeleteMapping("user/{userId}")
    public void deleteUser(@PathVariable UUID userId) {
        userService.deleteUser(userId);
    }
}
