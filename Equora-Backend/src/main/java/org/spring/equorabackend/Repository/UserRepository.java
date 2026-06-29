package org.spring.equorabackend.Repository;

import org.spring.equorabackend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    User getUsersByIdIs(UUID id);

    Optional<User> findByEmail(String email);
}