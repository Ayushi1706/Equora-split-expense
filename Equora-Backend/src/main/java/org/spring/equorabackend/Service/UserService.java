package org.spring.equorabackend.Service;

import org.spring.equorabackend.Model.DTO.UserDto;
import org.spring.equorabackend.Model.User;
import org.spring.equorabackend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public User getUser(UUID userId) {
        return userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found"));
    }

    public List<User> getAllUser() {
        return  userRepository.findAll();
    }

    public User saveUser(User user) {
          return userRepository.save(user);
    }

    public UserDto updateUser(UUID userId, UserDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(request.name());
        user.setEmail(request.email());
        user.setAvatarColor(request.avatarColor());
        user = userRepository.save(user);
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAvatarColor(),
                request.initials()
        );
    }

    public void deleteUser(UUID userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found"));
            userRepository.delete(user);
    }
}
