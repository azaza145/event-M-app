✨ Event Management Platform ✨

Welcome to the Event Management Platform, a full-stack web application designed to provide a seamless experience for creating, managing, and participating in events. This project features a secure backend API built with Spring Boot and a dynamic, responsive frontend built with Angular.
🖼️ Application Screenshots

Home Page
Login Page
Register page

Admin Dashboard
User Approvals
User Management 
Event Management
Question Answer
		
Organizer Page
User Dashboard
  
🚀 Key Features
👑 Admin Panel

    Comprehensive Dashboard (Vue d'ensemble): At-a-glance view of pending user approvals, active users, and total events.

    User Approval System: Securely approve or deny new user registrations.

    Full User Management: View, edit roles, and manage all active users on the platform.

    Complete Event Control: Full CRUD (Create, Read, Update, Delete) capabilities for all events.

    Q&A Moderation: View and respond to questions submitted by users.

👤 User & Organizer Panel

    Secure Authentication: Robust user registration and login system with JWT-based security.

    Interactive Event Dashboard: Browse all available events, search by keyword, and register with one click.

    My Events Page: A dedicated space for organizers to manage the events they have created.

    Real-time Notifications: Get instant updates on registration confirmations and other important actions.

    FAQ and Support: Ask questions directly to admins and view a public FAQ.

🛠️ Technology Stack
Area	Technology
🖥️ Frontend	Angular, TypeScript, HTML/CSS (SCSS)
⚙️ Backend	Java, Spring Boot, Spring Security (JWT), Spring Data JPA
🗄️ Database	PostgreSQL
📦 Build Tools	Maven (Backend), Angular CLI (Frontend)
🏛️ System Architecture

The application follows a classic client-server architecture. The Angular frontend acts as the client, making HTTP requests to the Spring Boot backend, which serves as a RESTful API. The backend then communicates with the PostgreSQL database to persist and retrieve data.
Generated code

      
+--------------------------+           +--------------------------+           +----------------------+
|   Browser                |           |   Web Server             |           |   Database Server    |
|   (Angular Frontend)     |  <------> |   (Spring Boot API)      |  <------> |   (PostgreSQL)       |
+--------------------------+           +--------------------------+           +----------------------+
       (Runs on localhost:4200)             (Runs on localhost:8080)             (Runs on localhost:5433)

    

IGNORE_WHEN_COPYING_START
Use code with caution.
IGNORE_WHEN_COPYING_END
🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.
Prerequisites

You will need the following software installed on your computer:

    Java (JDK) 17 or higher

    Apache Maven

    Node.js and npm (Node Package Manager)

    Angular CLI: npm install -g @angular/cli

    PostgreSQL Server

Installation Guide

1. Clone the Repository

First, clone the project from GitHub to your local machine.
Generated bash

      
git clone https://github.com/azaza145/event-M-app.git
cd event-M-app

    

IGNORE_WHEN_COPYING_START
Use code with caution. Bash
IGNORE_WHEN_COPYING_END

2. Backend Setup (Spring Boot)

The backend server must be running before you can use the frontend.
Generated bash

      
# Navigate into the backend directory
cd backend

# Create your local configuration file
# IMPORTANT: This file contains secrets and should NOT be committed to Git.
# Make sure your .gitignore file lists 'application.properties'.
cp src/main/resources/application-example.properties src/main/resources/application.properties

# Now, open src/main/resources/application.properties and fill in your
# actual database password, email app password, and a unique JWT secret.

# Build the project and run the server using Maven
mvn spring-boot:run

    

IGNORE_WHEN_COPYING_START
Use code with caution. Bash
IGNORE_WHEN_COPYING_END

The backend API will now be running on http://localhost:8080.

3. Frontend Setup (Angular)

Open a new terminal window and navigate to the project's root folder again.
Generated bash

      
# Navigate into the frontend directory from the root project folder
cd frontend

# Install all the required dependencies
npm install

# Start the Angular development server
ng serve

The frontend application will now be running. Open your web browser and go to http://localhost:4200.

