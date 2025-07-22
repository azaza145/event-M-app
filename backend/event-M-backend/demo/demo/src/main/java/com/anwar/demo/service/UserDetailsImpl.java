package com.anwar.demo.service;

import com.anwar.demo.model.User;
import com.anwar.demo.model.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

/**
 * Custom UserDetails implementation that adapts our User entity for Spring Security.
 */
public class UserDetailsImpl implements UserDetails {
    @Serial
    private static final long serialVersionUID = 1L;

    private final Long id;
    private final String email;

    @JsonIgnore
    private final String password;

    private final Collection<? extends GrantedAuthority> authorities;

    // This flag determines if the account is usable.
    private final boolean isEnabled;

    public UserDetailsImpl(Long id, String email, String password, Collection<? extends GrantedAuthority> authorities, boolean isEnabled) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
        this.isEnabled = isEnabled;
    }

    /**
     * A static factory method to create a UserDetailsImpl instance from our User entity.
     * This is a common and clean pattern.
     *
     * @param user The User entity from the database.
     * @return A UserDetailsImpl object configured for Spring Security.
     */
    public static UserDetailsImpl build(User user) {
        // Spring Security expects roles to be in the format 'ROLE_ROLENAME'
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        // --- THIS IS THE CRITICAL LOGIC ---
        // The account is only considered "enabled" by Spring Security if its status is ACTIVE.
        // If the status is PENDING_APPROVAL or anything else, isEnabled will be false,
        // and Spring Security will block the login attempt.
        boolean isEnabled = user.getStatus() == UserStatus.ACTIVE;

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                isEnabled
        );
    }

    // --- UserDetails Interface Methods ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // We use email as the username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // We don't have logic for account expiration
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // We don't have logic for account locking
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // We don't have logic for password expiration
    }

    @Override
    public boolean isEnabled() {
        return this.isEnabled; // Returns true only if user.status == ACTIVE
    }

    // --- Standard Object Methods ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}