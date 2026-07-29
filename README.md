# HealthBridge AI

HealthBridge AI is a venture-scale, multilingual clinical health triage platform powered by Gemma 4. Designed as an AI healthcare operating system, it aims to reduce unnecessary suffering by helping people receive safe, evidence-informed health triage in their native language. It bridges the gap between patients, emergency care, and clinical resources, always prioritizing user safety, trust, and transparency.

**Disclaimer:** This system is not a replacement for licensed medical professionals. It provides triage and guidance, not medical diagnoses.

---

## Core Mission and Philosophy

The primary mission is to improve healthcare accessibility globally. Every feature is designed to solve real human problems, focusing on:
* **Safety:** Pre-screening for mental health crises and critical emergencies before any AI inference.
* **Accessibility:** Multilingual support (English, Hindi, Urdu, Bengali, Tamil, Spanish), voice input, high contrast mode, and keyboard navigability.
* **Trust & Transparency:** Explainable AI with confidence scores, reasoning explanations, and expandable clinical evidence sources.
* **Reliability:** Built on robust, offline-capable open-source AI (Gemma 4 via Ollama) and grounded by Retrieval-Augmented Generation (RAG) using official WHO and CDC guidelines.

---

## System Architecture

HealthBridge AI utilizes a complex, multi-layered architecture to ensure clinical safety and response accuracy.

### 1. The Safety Layer
Before the language model processes a query, a deterministic pre-screening layer intercepts the input. Using multi-language pattern matching, it detects high-risk intents (e.g., suicidal ideation, self-harm). If triggered, the system immediately surfaces a Crisis Alert providing confidential, regional crisis hotlines, and forces the language model into a strict de-escalation protocol.

### 2. Retrieval-Augmented Generation (RAG)
To prevent hallucinations, the system does not rely solely on the model's parametric memory. It performs vector searches across a curated dataset of medical guidelines (WHO, CDC). The retrieved text chunks are injected directly into the Gemma 4 system prompt, grounding the AI's clinical recommendations in verified science. Users can view the exact source text referenced by the model.

### 3. Gemma 4 Orchestration
Gemma 4 acts as the central intelligence engine, responsible for:
* Multilingual symptom extraction
* Urgency and severity assessment
* Contextual conversation memory across multi-turn interactions
* Determining confidence levels and providing reasoning
* Function and tool calling (e.g., triggering the nearby hospital locator during emergencies)

### 4. Interactive Frontend
Built with Next.js 15 and Framer Motion, the user interface is designed to be calming, professional, and highly responsive. It features a conversational thread interface, interactive hospital maps, and dynamic, progressive timeline generation.

---

## Features

### Context-Aware Conversational Triage
The system maintains a stateful conversation thread. Users can provide symptoms iteratively (e.g., mentioning a fever, then following up with a description of a rash), and the model will synthesize the complete history to generate an updated, holistic assessment.

### Step-by-Step Emergency Protocol
If Gemma flags a query as a critical emergency, the UI bypasses standard triage and immediately presents a guided emergency protocol. This includes a prominent one-tap action to call emergency services and lists the top immediate first-aid steps to perform while waiting for medical professionals.

### Explainable AI and Transparency
The platform demystifies AI decision-making. Every triage result includes:
* **Confidence Score:** A calculated percentage of the model's certainty.
* **Reasoning:** A plain-text explanation of exactly why the model arrived at its conclusion.
* **Evidence Sources:** Expandable accordion components detailing the exact clinical documents referenced during the RAG process.

### Accessibility Enhancements
The application is designed to be usable by everyone.
* Comprehensive ARIA labels, roles, and focus management for screen readers.
* Integrated voice input for users with limited mobility or low literacy.
* System-aware High Contrast Mode support (`prefers-contrast: more`), which optimizes the interface for visually impaired users by removing soft shadows and deepening text colors.

---

## Technical Stack

* **Frontend:** Next.js 15, React 19, TypeScript, Vanilla CSS, Framer Motion
* **Backend:** Next.js App Router (API Routes)
* **AI & Inference:** Ollama (Local Gemma 4 model)
* **Validation:** Zod for strict JSON schema enforcement
* **Mapping:** Leaflet and React-Leaflet
* **Styling:** Custom 8-point grid design system using Inter Variable fonts

---

## Getting Started

### Prerequisites

1. **Node.js**: Ensure Node.js is installed.
2. **Ollama**: You must have Ollama installed and running locally.
3. **Gemma 4**: Pull the Gemma 4 model via Ollama.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AlleyNawaz/HealthBridge-AI.git
   cd HealthBridge-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Ollama service and load the model (in a separate terminal):
   ```bash
   ollama run gemma4
   ```

4. Run the development server:
   ```bash
   npm run dev
   # Or use the provided dev.bat script on Windows
   ```

5. Open `http://localhost:3000` with your browser to see the application.

---

## Project Structure

* `/app`: Next.js 15 App Router structure, containing the main layout, page, and API routes.
* `/components`: Reusable React components (e.g., `ConversationThread`, `TriageTimeline`, `CrisisAlert`, `HospitalMap`).
* `/lib`: Core backend logic, including the `triage` orchestrator, `safety` layer, `prompt` builder, and `vector-store` mock.
* `/types`: TypeScript interface definitions for strict type-checking across the application.
* `/docs`: Curated clinical guidelines used by the RAG system.

---

## Design Philosophy

The interface is engineered to reduce user anxiety. It avoids clinical coldness and overwhelming diagnostic panels in favor of a calm, elegant, and reassuring aesthetic. Every component decision, from the restrained color palette to the smooth Framer Motion transitions, is intentional and designed to build user trust.

---

## License

This project is proprietary and built for the Build with Gemma 4 initiative.
