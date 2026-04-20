# 🏺 OdusIA Travel Suite: The Luxury Management Ecosystem

![OdusIA Banner](travel-manager/assets/logo_full.png)

Welcome to the **OdusIA Travel Suite**, a professional, AI-driven ecosystem designed for high-end travel consulting and booking management. This repository integrates advanced agentic AI with a premium user interface to orchestrate immersive wellness and luxury experiences.

## 🌌 Ecosystem Overview

The suite is divided into two primary architectural pillars:

1.  **Atlas Chatbot (UI/UX)**: A sophisticated web-based interface powered by **Gemini 3 Flash**, designed to provide real-time consulting, curated report generation, and interactive booking management.
2.  **Luxury Travel Curator (The Intelligence)**: The core engine containing the system instructions, prompt engineering, and Python-based research scripts that power the AI's complex reasoning.

---

## 🏗️ Architecture

### 🛡️ Travel Manager (`/travel-manager`)
A hardened Node.js application serving as the primary frontend and secure API Gateway.
-   **Static Service**: Renders the premium dashboard with glassmorphism aesthetics.
-   **API Gateway**: Proxies requests to Google Gemini API, injecting mandatory brand instructions and enforcing security protocols.
-   **Persistence**: Implements IndexedDB for local file storage and LocalStorage for session history.

### 🧠 Luxury Curator (`/luxury-travel-curator`)
The "Brain" of the ecosystem.
-   **System Instructions (v. 4.0)**: Rigid protocols for luxury evaluation, focus-matching, and synergy analysis.
-   **Python Core**: Scripts for autonomous hotel research and data cleaning (supports `python-dotenv`, `google-generativeai`).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)
- A valid **Google Gemini API Key**.

### 2. Secret Configuration
OdusIA requires an API key in the `luxury-travel-curator` directory.
1. Navigate to `luxury-travel-curator/`.
2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and paste your key:
   ```text
   GOOGLE_API_KEY=your_actual_key_here
   ```

### 3. Launching the Suite
Navigate to the `travel-manager` directory and start the gateway:
```bash
cd travel-manager
npm install
npm start
```
Access the dashboard at: **http://localhost:8765**

---

## 🛡️ Security & Privacy
- **Local First**: All user data (attachments, bookings) is stored in your browser's IndexedDB.
- **Git Protect**: The `.gitignore` file is pre-configured to block sensitive tokens and temporary research files.
- **Internal Only**: The API endpoints are strictly bound to `localhost` to prevent external exposure.

---

## 💎 Design Philosophy
OdusIA follows a **Modern Luxury** aesthetic:
- **Dark Mode**: Midnight Teal and Deep Gold palette.
- **Glassmorphism**: High-blur surfaces for a premium depth effect.
- **Dynamic Feedback**: Interactive animations (e.g., the Alchemical Dragon) to visualize AI thought processes.

---

## 👨‍💻 Development & Contribution
This project is managed using the **Senior Travel-Tech Agent Protocol**. All tasks are tracked via Jira (Project Key: `ODUS`) and synchronized with Git for version control.

---
*Created with excellence by the OdusIA Engineering Team.*
