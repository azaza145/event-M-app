package com.anwar.demo.repository;

import com.anwar.demo.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    // For the public FAQ page on the user dashboard
    List<Question> findByIsAnsweredTrueOrderByAnsweredAtDesc();

    // For the admin management page
    List<Question> findByIsAnsweredFalseOrderByCreatedAtAsc();
}