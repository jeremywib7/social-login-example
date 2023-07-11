package com.thefuture.security.repositories;

import com.thefuture.security.model.EndpointRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EndpointRoleRepository extends JpaRepository<EndpointRole, Long> {
}
