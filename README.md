# 🎨 DesignEase — The Ultimate Creative Workspace

> **Create stunning digital documents, manage projects securely, and collaborate with your team in real-time.**

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Editor](https://img.shields.io/badge/Editor-Canva_Style-ff69b4?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN_%2B_Socket.io-blueviolet?style=for-the-badge)
![Database](https://img.shields.io/badge/Data-MongoDB_Atlas-green?style=for-the-badge)

---

## 📖 **Overview**

**DesignEase** is a powerful, full-stack creative platform designed to replace multiple tools. It combines a **Canva-like Drag-and-Drop Editor** for creating digital documents (posters, resumes, presentations) with robust **Project Management** and **Real-Time Collaboration** tools.

All data—from user designs to team chats—is securely stored and managed in the cloud using **MongoDB Atlas**.

---

## ✨ **Key Features**

### 🖌️ **Canva-Like Creative Editor (`editor.html`)**
* **Drag-and-Drop Interface:** Easily add text, images, shapes, and icons to your canvas.
* **Customizable Templates:** Start with professional layouts for Resumes, Social Media Posts, and Presentations.
* **Rich Media Support:** Upload your own images or generate assets using AI.
* **Export Options:** Download your creations as high-quality **PDF**, **PNG**, or **JPG**.

### 🗄️ **Data Storage & Management**
* **Cloud Storage:** All projects, folders, and assets are securely stored in **MongoDB Atlas**.
* **Auto-Save:** Never lose your work; changes are synced to the database automatically.
* **Structured Data:** Users, Groups, Messages, and Design Assets are organized in scalable collections (`Users`, `Folders`, `Messages`, `Designs`).

### 🤝 **Real-Time Collaboration (`invite.html`)**
* **Live Team Chat:** Discuss ideas instantly with built-in text, image, and voice messaging.
* **Secure Sharing:** Share specific folders with team members using **One-Time Access Codes (OTP)**.
* **Role Management:** Assign roles (Editor/Viewer) and revoke access anytime.

### 📂 **Smart Dashboard (`projects.html`)**
* **File Organization:** Manage your work in a hierarchical folder structure.
* **Recent Activity:** Quick access to your most recently edited designs.

---

## 🛠️ **Tech Stack**

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript | Glassmorphism UI, Fabric.js (Canvas), DOM Manipulation. |
| **Backend** | Node.js, Express.js | API routing, Auth logic, Socket handling. |
| **Database** | **MongoDB Atlas** | Cloud NoSQL database for flexible data storage. |
| **Real-Time** | Socket.io | Instant chat and live collaboration updates. |

---

## ⚙️ **Installation & Setup Guide**

Follow these steps to get your own instance of DesignEase running with MongoDB Atlas.

### 1️⃣ **Prerequisites**
* [Node.js](https://nodejs.org/) (v14+)
* A generic text editor (VS Code recommended).

### 2️⃣ **Clone the Repository**
```bash
git clone [https://github.com/Piyush79432/DesignEase.git](https://github.com/Piyush79432/DesignEase.git)
cd DesignEase
