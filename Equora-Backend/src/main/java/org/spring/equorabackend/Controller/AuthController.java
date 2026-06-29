package org.spring.equorabackend.Controller;

import org.spring.equorabackend.Model.DTO.AuthResponse;
import org.spring.equorabackend.Model.DTO.LoginRequest;
import org.spring.equorabackend.Model.DTO.RegisterRequest;
import org.spring.equorabackend.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        System.out.println("Register endpoint reached");
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}