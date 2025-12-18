# 🎨 DesignEase — The Ultimate Creative Workspace

> **Create stunning digital documents, manage secure projects, and control team access with ease.**

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Editor](https://img.shields.io/badge/Editor-Drag_&_Drop-ff69b4?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN_(No_Socket)-blueviolet?style=for-the-badge)
![Database](https://img.shields.io/badge/Data-MongoDB_Atlas-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-orange?style=for-the-badge)

---

## 📖 **Overview**

**DesignEase** is a full-stack creative platform designed to streamline digital asset creation and organization. It features a robust **Drag-and-Drop Editor** for creating posters and resumes, paired with a secure **Project Management System** backed by MongoDB Atlas.

Unlike typical tools, DesignEase focuses on **Granular Access Control**, allowing owners to invite members to specific workspaces via secure **One-Time Access Codes**.

---

## 🏗️ **System Architecture**

High-level data flow of the application:

```mermaid
graph LR
    Client[User / Client Browser] 
    Server[Node.js + Express API]
    DB[(MongoDB Atlas Cloud)]
    
    subgraph Frontend
    Client -- "Fetch API (JSON)" --> Server
    end
    
    subgraph Backend
    Server -- "Mongoose Schemas" --> DB
    Server -- "Auth & Validation" --> Server
    end
    
    subgraph Database
    DB -- "Persistent Data" --> Server
    end
