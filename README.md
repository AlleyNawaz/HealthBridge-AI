# HealthBridge AI 🩺
### *Multilingual AI Health Triage Assistant Powered by Gemma 4*

Built specifically for the **Build with Gemma 4** Hackathon.

---

## 🌟 Project Architecture

**HealthBridge AI** is an enterprise-grade clinical health triage application powered by **local Gemma 4 AI reasoning**. It allows users to speak or type symptoms in their native language (English, Hindi, Urdu, Bengali, Tamil, Punjabi, Spanish, French, etc.) and receive immediate evidence-based medical triage, emergency classification, WHO/CDC RAG guidance, function calling, geolocation hospital maps, and downloadable reports.

> **CRITICAL MEDICAL DISCLAIMER**: HealthBridge AI is strictly a medical triage and safety guidance assistant. It **DOES NOT diagnose diseases** or prescribe medications. It prioritizes user safety, detects red-flag emergency symptoms, and recommends professional care whenever appropriate.

---

## 🚀 Architectural Highlights

* **🧠 Uncompromising Gemma 4 Intelligence**: Gemma 4 (`gemma4:latest`) handles language auto-detection, symptom extraction, urgency scoring, confidence calculations, safety checks, and structured JSON output.
* **📚 Real RAG Pipeline (`lib/vector-store.ts`)**: Reads clinical document chunks from `/docs` (WHO, CDC, NHS, Mayo Clinic guidelines), computes TF-IDF / term overlap vector similarity scores, and injects the top 5 retrieved clinical guidance chunks directly into Gemma 4's prompt.
* **⚡ Real Gemma 4 Tool / Function Calling (`lib/tools.ts`)**: Gemma 4 autonomously triggers native functions:
  * `findNearbyHospitals()`: Locates emergency room facilities, phone numbers, and wait times.
  * `lookupEmergencyContacts()`: Retrieves emergency dispatch hotlines (911, 112, 108, 999).
  * `lookupFirstAid()`: Retrieves step-by-step first-aid protocols.
  * `lookupMedicineInformation()`: Provides OTC medication safety guidelines.
  * `saveConversation()`: Saves session history to database.
* **🚨 Red-Flag Emergency Alert System**: Triggers a fullscreen high-priority red alert overlay when Gemma 4 classifies a condition as a critical emergency.
* **🗺️ Geolocation & Google Maps**: Uses browser GPS coordinates (`navigator.geolocation`) and Google Maps directions to locate nearest trauma ER centers.
* **💾 Persistent Session Database (`lib/db.ts`)**: Stores triage sessions in persistent JSON database, allowing users to re-open and review past triage sessions.
* **📄 Downloadable Triage Reports (`app/api/report/route.ts`)**: Generates printable medical triage summary documents.
* **🎙️ Voice Speech-to-Text & Text-to-Speech**: Integrated browser MediaRecorder & Web Speech API for voice dictation and audio read-aloud playback.

---

## 📁 Repository Structure

```text
healthbridge-ai/
├── docs/
│   ├── who_guidelines.md         # WHO respiratory & pediatric guidelines
│   ├── cdc_emergency_triage.md   # CDC acute cardiac & stroke protocols
│   ├── nhs_first_aid.md          # NHS traumatic wound & CPR protocols
│   └── mayo_clinic_medicines.md  # OTC medication guidance
├── lib/
│   ├── vector-store.ts           # RAG TF-IDF & cosine vector search engine
│   ├── ollama.ts                 # Strict REST API client for Ollama (gemma4:latest)
│   ├── prompt.ts                 # Gemma 4 system prompt builder & strict Zod JSON schema
│   ├── parser.ts                 # Zod schema validation & dirty JSON parser
│   ├── tools.ts                  # Execution handlers for Gemma tools
│   ├── db.ts                     # Database store for session history
│   └── triage.ts                 # Core triage orchestrator
├── app/
│   ├── api/
│   │   ├── triage/route.ts       # POST /api/triage handler
│   │   ├── history/route.ts      # GET & DELETE history session handler
│   │   ├── hospitals/route.ts    # Geolocation hospital locator
│   │   └── report/route.ts       # PDF / summary report generation
│   ├── globals.css               # Clinical dark/light theme CSS
│   ├── layout.tsx                # Next.js 15 root layout
│   └── page.tsx                  # Single-screen clinical workspace
├── components/
│   ├── Header.tsx                # Clinical navbar with Ollama status
│   ├── SymptomForm.tsx           # Voice input & multilingual symptom form
│   ├── ResultCard.tsx            # 7-Card grid layout for triage results
│   ├── EmergencyOverlay.tsx      # Fullscreen emergency alert overlay
│   ├── HospitalMap.tsx           # Geolocation & Google Maps finder
│   ├── HistorySidebar.tsx        # Persistent session history drawer
│   ├── VoiceController.tsx       # Speech-to-Text & Text-to-Speech audio
│   └── Disclaimer.tsx            # Mandatory medical safety disclaimer
└── README.md                     # Technical submission document
```

---

## 💻 Local Setup & Running Instructions

### 1. Start Ollama with Gemma 4

Ensure Ollama is running locally on `http://localhost:11434`:

```bash
ollama run gemma4
```

### 2. Launch Development Server

```bash
cd c:/Users/alley/Developer/healthbridge-ai
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 API Specification

### `POST /api/triage`

**Request Body:**
```json
{
  "message": "I have severe cough and fever for three days."
}
```

**Response Payload (Generated Live by Gemma 4):**
```json
{
  "language": "English",
  "symptoms": ["severe cough", "fever"],
  "duration": "3 days",
  "severity": "Moderate",
  "urgency": "Moderate",
  "possible_causes": [
    "Acute viral upper respiratory infection",
    "Influenza (Flu)"
  ],
  "next_steps": [
    "Ensure adequate rest and stay hydrated.",
    "Use over-the-counter fever reducers as directed."
  ],
  "warning_signs": [
    "Difficulty breathing or shortness of breath (dyspnea)",
    "Chest pain"
  ],
  "emergency": false,
  "confidence": 0.94,
  "disclaimer": "HealthBridge AI provides health triage guidance only and is not a substitute for professional medical advice.",
  "model_used": "gemma4:latest",
  "timestamp": "2026-07-29T18:52:31.167Z"
}
```

---

## 📄 License

Distributed under the MIT License. Built for the **Build with Gemma 4** Hackathon.
