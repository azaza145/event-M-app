package com.anwar.demo.controller;

import com.anwar.demo.model.Question;
import com.anwar.demo.model.User;
import com.anwar.demo.repository.QuestionRepository;
import com.anwar.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired private QuestionRepository questionRepository;
    @Autowired private UserService userService;

    // Endpoint for users to see the public FAQ
    @GetMapping("/answered")
    @PreAuthorize("isAuthenticated()")
    public List<Question> getAnsweredQuestions() {
        return questionRepository.findByIsAnsweredTrueOrderByAnsweredAtDesc();
    }

    // Endpoint for users to submit a new question
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public Question submitQuestion(@RequestBody Map<String, String> payload) {
        User currentUser = userService.getCurrentAuthenticatedUser();
        Question question = new Question();
        question.setUser(currentUser);
        question.setQuestionText(payload.get("questionText"));
        return questionRepository.save(question);
    }
}