🏨 Hotel Booking Platform – Backend API (MERN + MongoDB)

A backend API for a Hotel Booking Platform, built using the MERN technology stack (Node.js, Express, MongoDB, Mongoose).
This project is designed as a mini-project that demonstrates backend engineering skills such as:

REST API development

User authentication using JWT

Role-based access (hotel owners / normal users)

CRUD operations for Hotels & Rooms

Search & filtering functionality

Date-based availability checking

Room booking system with overlap protection

Input validation & proper error handling

MVC architecture with clean modular code

This backend is suitable for learning, portfolio projects, or as a starting point for a full MERN application with a React frontend.

⭐ Key Features
🔐 User Authentication

User registration & login with hashed passwords (bcrypt)

JWT-based authentication

Protected routes for authenticated users

Role support: user, admin, and hotel owner

🏨 Hotel Management

Owners can create, update, and delete their hotels

Only the logged-in owner can modify their own hotel data

Public endpoint to list all hotels

🚪 Room Management

Create rooms under a specific hotel

Add pricing, capacity, amenities, and description

Update or delete rooms (owner-restricted)

Search rooms by:

City

Price range

Capacity

Amenities

Date availability

📅 Room Availability Search

Users can search for rooms that are not booked in a given date range

Prevents overlapping bookings using MongoDB queries

Ensures accurate real-world booking behavior

🧾 Booking System

Users can book available rooms

Booking stores:

User ID

Room ID

Start date

End date

Total price

Status (confirmed / cancelled)

Users can cancel their own bookings

Owners/admin cannot book their own rooms (optional extension)

🛠 Tech Stack

Node.js + Express → REST backend

MongoDB + Mongoose → Database & ORM

JWT → Authentication

express-validator → Validation

bcryptjs → Password hashing

MVC architecture

📁 Project Structure
src/
 ├─ config/         # Database connection
 ├─ controllers/    # Core business logic
 ├─ middleware/     # Auth & error handlers
 ├─ models/         # Mongoose models
 ├─ routes/         # API route definitions
 ├─ validators/     # Input validation
 └─ server.js       # App entry point

🚀 How It Works (High-Level Flow)
1️⃣ User registers → receives JWT
2️⃣ User logs in → uses JWT for protected endpoints
3️⃣ Hotel owner creates a hotel → receives hotel ID
4️⃣ Owner creates rooms → linked to hotel
5️⃣ Users search rooms → filters + date availability
6️⃣ User books a room → system checks no date overlap
7️⃣ Booking stored and returned with total price
