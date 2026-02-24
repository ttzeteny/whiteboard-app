# 🎨 BOARD IT - Real-Time Collaborative Whiteboard

**BOARD IT** is a full-stack, real-time collaborative whiteboard and chat application. It allows users to create their own rooms after registration, join others, and draw simultaneously while communicating via a built-in chat.

## ✨ Features
- **User Management (Auth):** Secure registration and login (JWT and bcrypt password hashing).
- **Room Management:** Create new rooms or join existing ones.
- **Real-Time Drawing:** Shared whiteboard usage (pencil, eraser, color picker, line width) with instant WebSocket (Socket.io) synchronization.
- **Real-Time Chat:** In-room chat functionality for participants.
- **Persistence:** Rooms, users, and board states are saved to a PostgreSQL database (using Prisma ORM).

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- React Router DOM
- Socket.io-client
- HTML5 Canvas API

**Backend:**
- Node.js & Express.js
- Socket.io (Real-time communication)
- Prisma ORM
- PostgreSQL (Database)
- JWT (JSON Web Token) & bcryptjs