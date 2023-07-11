package com.thefuture.security.repositories;

import java.util.Optional;

import com.thefuture.security.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

  Optional<User> findByEmail(String email);

  Optional<User> findByEmailVerificationToken(String emailVerificationToken);

  boolean existsByEmail(String email);

}
