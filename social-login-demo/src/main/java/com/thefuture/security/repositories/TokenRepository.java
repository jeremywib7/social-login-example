package com.thefuture.security.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.thefuture.security.dto.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TokenRepository extends JpaRepository<Token, Integer> {

  @Query(value = """
      select t from Token t inner join User u\s
      on t.user.id = u.id\s
      where u.id = :id and (t.expired = false or t.revoked = false)\s
      """)
  List<Token> findAllValidTokenByUser(String id);

  Optional<Token> findByToken(String token);
}