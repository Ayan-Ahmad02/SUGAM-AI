# SUGAM-AI: BIS Compliance & Indian Standards Intelligence Assistant

SUGAM-AI is a comprehensive, production-grade web application designed to empower Indian manufacturers, MSMEs, compliance teams, testing laboratories, consultants, and consumers with authoritative Bureau of Indian Standards (BIS) intelligence and certification management.

---

## 🏛️ Key Highlights & Visual Reference Match

SUGAM-AI accurately reproduces the visual identity, navigation hierarchy, information density, and interactive states demonstrated in the official reference prototypes:
- **Heritage & Patriotic Visual Identity**: Reusable SVG vector artwork representing Indian national architecture (Rashtrapati Bhavan / Parliament dome silhouette), official Bureau of Indian Standards emblem, and the Indian tricolor flowing ribbon.
- **Persistent Dark Navy Sidebar**: Navigation matching desktop SaaS standards with active blue pills and compliance quick links.
- **3-Panel Conversational Workspace**:
  - **Left**: Multi-session conversation history with search, rename, and delete actions.
  - **Center**: Grounded AI dialogue with source-backed evidence cards, confidence scores, suggested follow-ups, voice speech recognition, and document attachments.
  - **Right**: Real-time Workspace Context displaying live product attributes, applicable IS codes, clauses, mandatory tests, and statutory dossiers.
- **Smart Clarification Loop**: If a user's product query is ambiguous (e.g., "I make electrical appliances"), the assistant prompts structured clarification questions before standard matching.
- **Multilingual UI Support (12+ Languages)**: Native translation engine supporting English, Hindi (हिन्दी), Bengali (বাংলা), Telugu (తెలుగు), Marathi (मराठी), Tamil (தமிழ்), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ), Odia (ଓଡ଼ିଆ), and Assamese (অসমীয়া).
- **Responsive Mobile Layout**: Fully tailored mobile drawer, sticky bottom navigation dock (Home, Standards, Assistant, Saved, More), and touch-friendly controls.

---

## ⚡ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Bundler**: Vite & Rolldown
- **Styling**: Tailwind CSS v4 with custom SUGAM-AI navy and compliance palette
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Computer Vision & Scanning**:
  - `tesseract.js` for client-side Optical Character Recognition (OCR)
  - `jsQR` for camera/image QR matrix decoding
  - Web Speech API for voice dictation

### Backend
- **Runtime**: Node.js v20+ with TypeScript (`tsx`)
- **Server**: Express.js REST API
- **Database**: SQLite 3 using `better-sqlite3` with WAL mode and foreign key integrity
- **File Handling**: Multer multipart upload with mime-type validation
- **AI Integration**: Dual-engine architecture (Gemini / OpenAI API compatible with local structured BIS RAG fallback)

---

## 📁 Project Structure

```
SUGAM_AI/
├── backend/
│   ├── data/
│   │   └── sugam.db                # SQLite database file
│   ├── src/
│   │   ├── db/
│   │   │   ├── index.ts            # SQLite schema initialization
│   │   │   └── seed.ts             # Realistic demonstration seed data
│   │   ├── services/
│   │   │   ├── aiEngine.ts         # RAG pipeline & grounded response generator
│   │   │   ├── intentService.ts    # User intent classification
│   │   │   ├── productExtractionService.ts # Product attribute extraction
│   │   │   ├── clarificationEngine.ts # Ambiguity & clarification detector
│   │   │   ├── knowledgeSearchService.ts # Standards & clauses search engine
│   │   │   ├── verificationService.ts # BIS / ISI mark verification engine
│   │   │   ├── claimCheckerService.ts # E-commerce claim auditor
│   │   │   └── ocrService.ts       # Text and field parser
│   │   ├── routes/                 # Express REST route handlers
│   │   └── server.ts               # Express server entry point
│   └── test/
│       └── api.test.ts             # Automated test suite (15 assertions)
├── src/
│   ├── components/
│   │   └── common/                 # Reusable UI & architectural vectors
│   ├── context/
│   │   ├── AuthContext.tsx         # User session & role switcher
│   │   └── LanguageContext.tsx     # 12+ Indian languages localization
│   ├── layouts/
│   │   └── AppLayout.tsx           # Persistent sidebar, header & mobile dock
│   ├── pages/                      # All working feature screens
│   ├── services/
│   │   └── api.ts                  # REST API client
│   ├── App.tsx                     # React Router configurations
│   ├── index.css                   # Global styles & scrollbars
│   └── main.tsx                    # React client entry point
├── public/
│   └── logo.svg                    # Brand favicon
├── .env.example                    # Environment variable template
├── package.json                    # Dependency and script orchestration
├── tailwind.config.js              # Theme definitions
└── vite.config.ts                  # Vite config with backend proxy
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18+ (tested on Node.js v24)
- npm v9+

### 2. Installation
```bash
git clone <repository-url>
cd SUGAM_AI
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment variables:
```env
PORT=5001
VITE_API_BASE_URL=http://localhost:5001
JWT_SECRET=sugam_ai_super_secret_jwt_key_2026_bis_compliance_platform

# Optional: Real AI API (Gemini or OpenAI compatible)
# When omitted, the local BIS knowledge engine handles all queries seamlessly
GEMINI_API_KEY=
OPENAI_API_KEY=
```

### 4. Running the Application
To start both backend server and frontend client concurrently:
```bash
npm run dev
```

The application will be accessible at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001/api`
- API Health Check: `http://localhost:5001/api/health`

### 5. Running Automated Tests
```bash
npm test
```

---

## 🔑 Demo Login Accounts

SUGAM-AI includes instant demo accounts for testing without external identity providers:

| Role | Email | Password | Preloaded Workspace |
| :--- | :--- | :--- | :--- |
| **Manufacturer** | `demo@sugam.ai` | `password123` | Afnan Ahmad (Active Plan for SS Water Bottles) |
| **Directorate Admin** | `admin@sugam.ai` | `admin123` | Dr. R. K. Sharma (Full Knowledge Base CRUD & Audit) |

> **Tip**: You can switch roles on the fly using the profile dropdown in the top header or from the Profile page.

---

## 📡 Core REST API Endpoints

- `GET /api/health` — System status, active mode, and uptime
- `POST /api/auth/signin` — Authenticates user and issues session token
- `GET /api/dashboard` — Aggregated metrics, active plan, recommended standard, and updates
- `POST /api/chat` — Contextual AI engine with intent detection, clarification, and RAG
- `GET /api/standards` — Search and filter standards by category, mandatory status, and keywords
- `POST /api/standards/compare` — Side-by-side comparison of 2–3 Indian Standards
- `POST /api/products/match` — Algorithmic standard matching with confidence score
- `GET /api/compliance` — 10-step certification roadmap and step checklist
- `POST /api/documents/upload` — Multipart file upload and automated scrutiny
- `POST /api/verification/mark` — Licence and mark verification with risk rating
- `POST /api/verification/qr` — QR matrix payload decoder and registry check
- `POST /api/claims/check` — E-commerce listing audit and deceptive claim detector
- `GET /api/labs` — BIS recognized laboratories directory and shortlisting
- `GET /api/offices` — Regional and branch offices directory with interactive map frame
- `GET /api/alerts` — Gazette notifications, QCO updates, and amendments
- `GET /api/saved` — User vault for saved standards, products, and plans
- `POST /api/complaints` — Consumer grievance registration and FAQ repository
- `GET /api/admin/summary` — Admin metrics, system health, and microservices status

---

## ⚠️ Demonstration Data Disclaimer

> **Notice**: All records, licence numbers, testing durations, and fee estimates provided within SUGAM-AI are for prototype evaluation and technical demonstration. Before making statutory, legal, or commercial decisions, always cross-reference current official gazette notifications and the official Bureau of Indian Standards portal at [https://www.services.bis.gov.in](https://www.services.bis.gov.in).
