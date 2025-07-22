✨ Event Management Platform - Backend Documentation

Welcome to the backend of the Event Management Platform! This project is a robust API server built with Java and Spring Boot. It provides all the necessary functionality for user authentication, event management, administration, and notifications for our Angular frontend.
🏛️ Core Architecture: The Journey of a Request

This project follows a standard, clean architecture. When the frontend sends a request (like "Create a new event"), it travels through these layers in a specific order:

    ➡️ 📁 controller (The Receptionist)

        Receives the HTTP request.

        Validates the basic input.

        Calls the appropriate service to do the real work.

    🧠 📁 service (The Brains / Manager)

        Contains all the business logic.

        Coordinates actions, like saving to the database and sending emails.

        This is where the main "thinking" happens.

    🗄️ 📁 repository (The Librarian)

        Talks directly to the database.

        Its only job is to fetch, save, update, and delete data. It doesn't know any business rules.

    📝 📁 model (The Blueprint)

        Defines the structure of our data. A User model class maps directly to the users table in the database.

    💌 📁 dto (The Envelope)

        Simple objects used to safely send data to and from the frontend, ensuring we don't expose sensitive information (like user passwords).

📄 File-by-File Breakdown

Here is a description of the key files found in your project.
📄 application.properties

This is the main configuration file for the entire application.

    Database Section: Connects the application to your local PostgreSQL database (my_db_anwar).

    JPA/Hibernate Section: Tells Spring Boot to automatically create or update database tables based on your model classes (spring.jpa.hibernate.ddl-auto=update).

    Email Section: Configures the connection to Gmail's SMTP server to send emails for notifications and password resets.

    Security Section: Contains the secret key (app.jwt.secret) for creating and validating JSON Web Tokens (JWTs) and sets the token expiration time.

🚨 IMPORTANT SECURITY NOTE 🚨: This file contains sensitive passwords and secrets. In a real-world project, these values should never be committed to GitHub. They should be stored securely as environment variables.
📁 config - Application Configuration

Classes that set up the core behavior of the application.

    SecurityConfig.java: The most important security file. It defines which API endpoints are public (e.g., /api/auth/signin) and which are protected. It also configures CORS to allow your Angular frontend (http://localhost:4200) to communicate with the backend.

    WebConfig.java: An additional class to help configure CORS rules.

    CacheControlFilter.java: A filter that tells browsers not to cache API responses, ensuring the frontend always gets the freshest data.

📁 controller - The API Endpoints

These classes define all the URLs of your API.

    AuthController.java: Handles public authentication endpoints like user registration (/signup) and login (/signin).

    AdminController.java: Contains all endpoints for administrators, such as approving users, deleting users, and answering questions. All endpoints here require an ADMIN role.

    EventController.java: Manages event-related actions for regular users, like fetching all events, viewing a single event, and registering for an event.

    EventManagementController.java: Handles event actions for ORGANIZER or ADMIN roles, like adding/removing participants from an event.

    UserController.java: Provides utility endpoints for fetching user data, like getting a list of users to invite to an event.

    PasswordController.java: Manages all logic for "forgot password" and "reset password" flows.

    NotificationController.java: Allows users to fetch their personal notifications.

    QuestionController.java: Allows users to submit questions and view the public FAQ.

    OrganizerController.java: Provides specific endpoints for event organizers, like emailing all participants of an event.

📁 dto - Data Transfer Objects

These are the "envelopes" for carrying data between the frontend and backend.

    LoginRequest.java: Carries the user's email and password from the frontend during login.

    JwtResponse.java: Carries the JWT token and user details back to the frontend after a successful login.

    CreateEventDto.java & EventDto.java: Used to create events and send event data without exposing complex internal structures.

    ResetPasswordRequest.java: Carries the password reset token and the new password.

📁 model - The Database Blueprints (JPA Entities)

These classes map directly to your database tables.

    User.java: Defines the users table, including fields like name, email, password, role, and status. It also defines relationships to events.

    Event.java: Defines the events table, including title, date, location, and its relationship with the user who organized it and the users who are participating.

    Role.java: An Enum that defines the possible user roles (USER, ORGANIZER, ADMIN).

    UserStatus.java: An Enum defining a user's account status (PENDING_APPROVAL, ACTIVE).

    Notification.java & Question.java: Entities for storing notification and Q&A data.

📁 repository - The Data Access Layer

These interfaces are responsible for all database operations.

    UserRepository.java: Provides methods to find, save, and delete users (e.g., findByEmail(...)).

    EventRepository.java: Provides methods to find, save, and delete events. It includes a custom query to search and filter events.

    NotificationRepository.java, QuestionRepository.java: Repositories for their respective models.

📁 security - Authentication & Authorization

Classes dedicated to securing the application.

    JwtUtils.java: A utility class for generating a new JWT after login and validating a token from an incoming request.

    AuthTokenFilter.java: A filter that runs on every protected request. It checks for a JWT in the Authorization header, validates it, and sets the user's authentication context.

    AuthEntryPointJwt.java: The entry point for handling authentication errors. If a user tries to access a protected resource without being logged in, this class returns a clear 401 Unauthorized error.

📁 service - The Business Logic

This is where the core application logic resides.

    UserDetailsServiceImpl.java: A critical Spring Security class that loads a user's details (by email) from the database during the login process.

    UserService.java: Contains logic for user-related operations, like getting the currently authenticated user and managing password reset tokens.

    EventService.java: Handles the logic for creating and updating events, including associating the correct organizer.

    EmailService.java: Contains methods to construct and send different types of emails using the configured Gmail account.

    NotificationService.java: A simple service to create and save new notifications in the database.
