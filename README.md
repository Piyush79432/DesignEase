# 🎨 DesignEase — The Ultimate Creative Workspace

> **Create stunning digital documents, manage projects securely, and collaborate with your team in real-time.**

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN_%2B_Socket.io-blueviolet?style=for-the-badge)
![Database](https://img.shields.io/badge/Data-MongoDB_Atlas-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

---

## 📖 **Overview**

**DesignEase** is a full-stack creative platform designed to replace multiple tools. It combines a powerful **Drag-and-Drop Editor** for creating digital documents (posters, resumes) with robust **Project Management** and **Real-Time Collaboration** tools.

All data—from user designs to team chats—is securely stored and managed in the cloud using **MongoDB Atlas**.

---

## 🏗️ **System Architecture**

Below is the high-level flow of how DesignEase connects the User, Server, and Database.

```mermaid
graph TD
    Client[User / Client Browser] 
    Server[Node.js + Express Server]
    DB[(MongoDB Atlas Cloud)]
    
    subgraph Frontend
    Client -- "HTTP Requests (Fetch API)" --> Server
    Client -- "Real-Time Events (Socket.io)" --> Server
    end
    
    subgraph Backend
    Server -- "Mongoose Schemas" --> DB
    Server -- "Auth & Validation" --> Server
    end
    
    subgraph Database
    DB -- "JSON Data (Users, Chats, Folders)" --> Server
    end
