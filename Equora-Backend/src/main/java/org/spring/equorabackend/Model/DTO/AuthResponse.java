package org.spring.equorabackend.Model.DTO;

import java.util.UUID;

public record AuthResponse(String token, UUID userId, String name, String email) {}