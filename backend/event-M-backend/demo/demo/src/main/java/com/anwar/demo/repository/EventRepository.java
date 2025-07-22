package com.anwar.demo.repository;

import com.anwar.demo.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganizerId(Long organizerId);
    // --- ADD THIS NEW METHOD ---
    @Query("SELECT e FROM Event e WHERE " +
            "(:searchTerm IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND (:statusFilter IS NULL " +
            "OR (:statusFilter = 'upcoming' AND e.date >= :currentDate) " +
            "OR (:statusFilter = 'past' AND e.date < :currentDate))")
    List<Event> searchAndFilterEvents(
            @Param("searchTerm") String searchTerm,
            @Param("statusFilter") String statusFilter,
            @Param("currentDate") LocalDate currentDate
    );
}