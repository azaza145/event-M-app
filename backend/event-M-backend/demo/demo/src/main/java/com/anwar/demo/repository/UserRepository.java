package com.anwar.demo.repository;

import com.anwar.demo.model.User;
import com.anwar.demo.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set; // Import Set

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPasswordResetToken(String token);

    List<User> findByStatus(UserStatus status);

    // --- ADD THIS NEW METHOD ---
    @Query("SELECT e.id FROM User u JOIN u.events e WHERE u.id = :userId")
    Set<Long> findRegisteredEventIdsByUserId(@Param("userId") Long userId);
}