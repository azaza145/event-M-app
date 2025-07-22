package com.anwar.demo.controller;

import com.anwar.demo.dto.AdminCreateUserRequest;
import com.anwar.demo.dto.UpdateDetailsRequest;
import com.anwar.demo.exception.ResourceNotFoundException;
import com.anwar.demo.model.Event;
import com.anwar.demo.model.Question;
import com.anwar.demo.model.Role;
import com.anwar.demo.model.User;
import com.anwar.demo.model.UserStatus;
import com.anwar.demo.repository.QuestionRepository;
import com.anwar.demo.repository.UserRepository;
import com.anwar.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Controller for all administrative actions. Access is restricted to users with the 'ADMIN' role.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final QuestionRepository questionRepository;

    /**
     * Using constructor-based dependency injection for all required services.
     * This is the recommended, most reliable approach in Spring.
     */
    @Autowired
    public AdminController(
            UserRepository userRepository,
            UserService userService,
            PasswordEncoder passwordEncoder,
            QuestionRepository questionRepository) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.questionRepository = questionRepository;
    }

    // --- User Management Endpoints ---

    @GetMapping("/users")
    public List<User> getActiveUsers() {
        return userRepository.findByStatus(UserStatus.ACTIVE);
    }

    @GetMapping("/users/pending")
    public List<User> getPendingUsers() {
        return userRepository.findByStatus(UserStatus.PENDING_APPROVAL);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUserByAdmin(@RequestBody AdminCreateUserRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setDepartment(request.getDepartment());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);
        user.setStatus(UserStatus.ACTIVE);
        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/users/{userId}/approve")
    public ResponseEntity<?> approveUserRegistration(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        return ResponseEntity.ok().body("User " + user.getEmail() + " has been approved.");
    }

    @PostMapping("/users/{userId}/deny")
    @Transactional
    public ResponseEntity<?> denyUserRegistration(@PathVariable Long userId) {
        userRepository.findById(userId).ifPresent(userRepository::delete);
        return ResponseEntity.ok().body("User registration has been denied and removed.");
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<User> updateUserDetailsByAdmin(@PathVariable Long userId, @RequestBody UpdateDetailsRequest request) {
        User updatedUser = userService.updateUserById(userId, request);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> setUserRole(@PathVariable Long userId, @RequestBody Map<String, String> roleRequest) {
        try {
            Role newRole = Role.valueOf(roleRequest.get("role").toUpperCase());
            userService.updateUserRole(userId, newRole);
            return ResponseEntity.ok("User role updated successfully to " + newRole);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role specified.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @DeleteMapping("/users/{userId}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        User adminUser = userService.getCurrentAuthenticatedUser();
        if (adminUser.getId().equals(userId)) {
            return ResponseEntity.badRequest().body("Error: Administrators cannot delete their own account.");
        }

        User userToDelete = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Manually remove the user from all events they are participating in to avoid constraint violations.
        for (Event event : userToDelete.getEvents()) {
            event.getParticipants().remove(userToDelete);
        }

        userRepository.delete(userToDelete);
        return ResponseEntity.ok().body("User with ID " + userId + " was deleted successfully.");
    }

    // --- Q&A Management Endpoints ---

    @GetMapping("/questions/unanswered")
    public List<Question> getUnansweredQuestions() {
        return questionRepository.findByIsAnsweredFalseOrderByCreatedAtAsc();
    }

    @PostMapping("/questions/{id}/answer")
    @Transactional
    public ResponseEntity<Question> answerQuestion(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + id));

        question.setAnswerText(payload.get("answerText"));
        question.setAnswered(true);
        question.setAnsweredAt(LocalDateTime.now());

        Question updatedQuestion = questionRepository.save(question);
        return ResponseEntity.ok(updatedQuestion);
    }
}