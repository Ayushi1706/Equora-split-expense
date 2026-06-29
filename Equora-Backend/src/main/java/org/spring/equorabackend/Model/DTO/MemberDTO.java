package org.spring.equorabackend.Model.DTO;
import java.util.UUID;

public record MemberDTO(UUID userId, String name, String email) {}

