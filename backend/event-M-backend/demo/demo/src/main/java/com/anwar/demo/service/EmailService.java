package com.anwar.demo.service;

import com.anwar.demo.model.Event;
import com.anwar.demo.model.User;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    // --- (existing methods like sendPasswordResetEmail, sendRegistrationConfirmation, etc.) ---

    /**
     * Sends a formatted email containing a user's question to a support address.
     * @param user The user asking the question.
     * @param question The question text.
     */
    public void sendUserQuestion(User user, String question) {
        // IMPORTANT: Change this to your actual support email address.
        String toAddress = "support.events@bkam.ma";
        String subject = "Nouvelle Question d'un Utilisateur : " + user.getFirstName() + " " + user.getLastName();

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toAddress);
            helper.setSubject(subject);
            // This allows you to directly "Reply" to the user from your inbox.
            helper.setReplyTo(user.getEmail());

            String emailContent = String.format("""
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>Nouvelle Question Soumise</h2>
                    <p>Un utilisateur a posé une question via le tableau de bord de la plateforme.</p>
                    <hr>
                    <p><strong>Utilisateur :</strong> %s %s</p>
                    <p><strong>Email :</strong> %s</p>
                    <p><strong>Département :</strong> %s</p>
                    <hr>
                    <h3>Question :</h3>
                    <p style="background-color: #f8f9fa; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
                        %s
                    </p>
                    <hr>
                    <p><small>Pour répondre, utilisez la fonction "Répondre" de votre client de messagerie.</small></p>
                </div>
            """, user.getFirstName(), user.getLastName(), user.getEmail(), user.getDepartment(), question);

            helper.setText(emailContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send user question email: " + e.getMessage());
        }
    }

    public void sendBulkEmail(List<String> recipientEmails, String subject, String body) {
    }

    public void sendRegistrationConfirmation(User userToAdd, Event updatedEvent) {
    }

    public void sendPasswordResetEmail(String email, String resetUrl) {
    }
}