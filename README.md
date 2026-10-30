# 🤖 Mudita AI — Applied AI Engineering Assignments

## 🚀 Live Submission Links
* **Assignment 1 (AI Sales Assistant):**
  * Frontend: [View Live App](https://mudita-ai-assignment.vercel.app/)
  * Backend: [View API Docs](https://mudita-ai-assignment.onrender.com/docs)

* **Assignment 2 (AI Operations Coordinator):**
  * Frontend: [View Live App](https://mudita-ai-assignment-k3wg.vercel.app/)
  * Backend: [View API Docs](https://mudita-ai-assignment-1.onrender.com/docs)

### AI Sales Assistant · AI Operations Coordinator

Two full-stack, production-grade AI applications combining Google Gemini LLMs, structured Pydantic workflows, robust API routing, multi-channel inquiry ingestion, and human-centred safeguards.

## 🚀 Live Applications & Architecture Overview

* **Assignment 01 — AI Sales Assistant (`assignment1_sales/`)**
  * **Tech Stack:** FastAPI (Python) + Next.js (TypeScript, Tailwind CSS, App Router) + Google Gemini (`gemini-3.5-flash-lite`).
  * **Capabilities:** Multi-channel inquiry ingestion simulation (WhatsApp, Instagram, Gmail), automated lead qualification, business-policy compliant representative routing (Sarah Jenkins & David Chen), and conflict-checked calendar slot booking.

* **Assignment 02 — AI Operations Coordinator (`assignment2_agents/`)**
  * **Tech Stack:** FastAPI + Next.js + Gemini LLM.
  * **Capabilities:** Multi-agent operational workflow coordinating an **Intake Agent**, **Planning Agent**, and **Review Agent** to turn transcripts and business rules into reviewed, traceable action plans with cyclic error correction.

## ✨ What Makes This Project Stand Out?

1. **Strict LLM & Business-Logic Separation:** Gemini handles natural language understanding, intent extraction, and conversational drafting, while explicit Python functions and Pydantic schemas enforce business rules, routing policies, and validation.
2. **Structured AI Validation:** All model outputs are parsed into strict Pydantic models, preventing hallucinated company services, unauthorized staff assignments, or invalid booking states.
3. **Multi-Channel Webhook Framework:** Implements standard payload structures for WhatsApp, Instagram, and Gmail inquiries inside a unified dashboard interface.
4. **Confirmation-Gated Calendar Scheduling:** Prevents double-booking by rechecking live calendar availability and handling slot conflict exceptions before creating meeting events.
5. **Robust Security & Secret Management:** Environment variables (`.env`) are strictly isolated server-side and excluded via `.gitignore` to prevent live API exposure.

## 📂 Repository Structure

```text
mudita-assignment/
├── assignment1_sales/
│   ├── backend/
│   │   ├── main.py               # FastAPI server & multi-channel endpoints
│   │   ├── agents.py             # Gemini lead qualification & routing logic
│   │   ├── calendar_service.py   # Slot availability & conflict check engine
│   │   ├── models.py             # Pydantic data schemas
│   │   └── requirements.txt      # Python dependencies
│   └── frontend/                 # Next.js sales assistant UI dashboard
└── assignment2_agents/           # Operations Coordinator backend & UI
```

## 🛠️ Local Setup & Installation Instructions

### Prerequisites
* Python 3.10 or higher
* Node.js & npm installed
* A valid Google Gemini API Key

### Step 1: Open Your Repository Folder
Navigate into your local project root folder where you downloaded or initialized your repository:
```bash
cd path/to/mudita-assignment
```

### Step 2: Set Up Assignment 01 (Sales Assistant)

**1. Backend Setup:**
```bash
cd assignment1_sales/backend
python -m venv venv

# Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate
# On macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

**2. Configure Environment Variables:**
Create a `.env` file inside `assignment1_sales/backend/`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**3. Run the FastAPI Backend:**
```bash
uvicorn main:app --reload
```
*(Backend runs locally on `http://127.0.0.1:8000`)*

**4. Frontend Setup:**
Open a second terminal window, move to the frontend folder, and launch Next.js:
```bash
cd assignment1_sales/frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to test WhatsApp, Instagram, and Gmail lead qualification live!

## 💰 Approximate Model Cost per Run

Estimates assume standard paid rates of US$0.75 per 1M input tokens and US$3.75 per 1M output tokens using `gemini-3.5-flash-lite`:
* **Assignment 01 (Sales Assistant Call):** ~1,000 input + 300 output tokens ≈ **$0.0019 per request**.
* **Assignment 02 (Three-Agent Workflow):** ~6,000 input + 2,000 output tokens across all agent handoffs ≈ **$0.012 per workflow run**.

## 🔒 Integration Scope & Known Limitations
* **External APIs:** Live Meta webhook production approval (for WhatsApp/Instagram) and live Google OAuth scopes require business verification. Per assignment guidelines, this repository implements robust FastAPI simulation endpoints and mock state stores to demonstrate complete end-to-end functionality instantly without requiring complex external developer console provisioning.
* **Model Hallucination Safeguards:** Pydantic validation checks structural integrity, but mission-critical production deployments should retain human review checkpoints before finalizing customer-facing actions.

## 🛡️ Security Checklist
* `.env` files and API keys are excluded via `.gitignore`.
* Used dedicated synthetic test data for all workflow demonstrations.
* Server-side execution keeps sensitive API keys hidden from client browsers.

**Author:** Ansh Rana 
*Applied AI Engineering · Generative AI · Python · LLM Applications*
