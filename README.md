# AI Generalist Assignment: Sales Assistant and Multi-Agent Operations Coordinator

This repository contains production-ready implementations for the Mudita AI Generalist technical evaluation, built using **Python (FastAPI)**, **Google Gemini (`gemini-3.5-flash-lite`)**, and **Next.js (TypeScript & Tailwind CSS)**.

---

## 📂 Repository Structure
* **`assignment2_agents/`**: Operations Coordinator Multi-Agent Pipeline (Intake, Planning, and Review agents with iterative correction loops).
  * `backend/`: FastAPI server, Pydantic schemas, Gemini SDK integration, and orchestrator.
  * `my-app/`: Next.js enterprise dark-mode dashboard UI.

---

## 🚀 Quick Start: Assignment 02 (Operations Coordinator)

### 1. Run the Backend
```bash
cd assignment2_agents/backend
pip install -r requirements.txt
# Create a .env file containing: GEMINI_API_KEY=your_api_key
uvicorn main:app --reload
Backend runs on http://127.0.0.1:8000

 2. Run the Frontend Dashboard
cd assignment2_agents/my-app
npm install
npm run dev
Frontend runs on http://localhost:3000

 3. Push the Changes to GitHub
Open your terminal in the root folder and run these commands to update your repository:

```powershell
git add .
git commit -m "Organize folder structure and add professional README"
git push origin main