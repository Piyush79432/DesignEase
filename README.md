# 🎨 DesignEase — Collaborative Design & Chat Platform

> **An End-to-End Workspace for Teams to Design, Organize, and Collaborate in Real-Time.**

![Project Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-Free_to_Use-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN_%2B_Socket.io-blueviolet?style=for-the-badge)

---

## 📖 **Overview**

**DesignEase** is a full-stack web application designed to streamline team collaboration. It combines powerful **Project Management** (folders, access control) with a robust **Real-Time Communication System** (chat, voice notes, image sharing).

Built with a focus on **Security** and **User Experience**, DesignEase allows teams to create secure workspaces in MongoDB Atlas, generate one-time access codes, and collaborate seamlessly without friction.

---

## ✨ **Key Features**

### 🔐 **Secure Workspace Management**
* **Create Folders:** Instantly generate project folders stored in **MongoDB Atlas**.
* **One-Time Passwords (OTP):** Generate unique, single-use 6-digit codes to grant folder access.
* **Role-Based Access:** Owners can View, Share, and **Revoke** access instantly.

### 💬 **Real-Time Collaboration**
* **Live Chat:** Instant messaging powered by **Socket.io**.
* **Rich Media Support:** Share **Images** and **Voice Recordings** directly in the chat.
* **Persistent History:** All chats and media are saved to the database, so you never lose context.

### 🎨 **Captivating UI/UX**
* **Glassmorphism Design:** Modern, translucent UI elements.
* **Responsive Sidebar:** A professional navigation bar that adapts to your workflow.
* **Interactive Modals:** Beautiful popups for creating groups and managing teams.

---

## 🛠️ **Tech Stack**

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript | Modern, vanilla JS with custom glassmorphism CSS. |
| **Backend** | Node.js, Express.js | Robust REST API handling routing and logic. |
| **Database** | MongoDB Atlas | Cloud-native database for Users, Groups, and Chats. |
| **Real-Time** | Socket.io | Bi-directional event-based communication. |

---

## 🚀 **Getting Started**

Follow these steps to get a local copy up and running in minutes.

### **Prerequisites**
* **Node.js** (v14 or higher) installed.
* A **MongoDB Atlas** account (free tier is fine).

### **Installation**

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/designease.git](https://github.com/your-username/designease.git)
    cd designease
    ```

2.  **Install Backend Dependencies**
    ```bash
    npm install
    ```
    *This installs `express`, `mongoose`, `cors`, `body-parser`, and `socket.io`.*

3.  **Configure Database**
    * Open `server.js`.
    * Locate the `MONGO_URI` variable.
    * Replace it with your **MongoDB Atlas Connection String**:
        ```javascript
        const MONGO_URI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/designease?retryWrites=true&w=majority";
        ```

4.  **Run the Server**
    Start the backend server:
    ```bash
    node server.js
    ```
    *You should see: `🚀 Server running on http://localhost:5000`*

5.  **Launch the App**
    * Open `invite.html` (or `projects.html`) in your browser.
    * **Pro Tip:** Use VS Code's "Live Server" extension for the best experience.

---

## 📂 **Project Structure**

```plaintext
DesignEase/
├── public/                 # Static assets (images, icons)
├── server.js               # Main Backend Entry Point (API + Socket.io)
├── invite.html             # Main Chat & Invite Interface
├── projects.html           # Folder Management Interface
├── index.html              # Landing Page
├── package.json            # Dependencies list
└── README.md               # This file
