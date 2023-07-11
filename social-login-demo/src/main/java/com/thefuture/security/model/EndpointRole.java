package com.thefuture.security.model;

import com.thefuture.security.dto.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "endpoint_roles")
@Getter
@Setter
@RequiredArgsConstructor
public class EndpointRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "endpoint")
    private String endpoint;

    @Column(name = "role")
    private Role role;
}

