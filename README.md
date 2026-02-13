# ✨ Deterministic UI Generator

> An AI-powered UI generator that converts natural language descriptions into working React code using a fixed, deterministic component library.

**Built by Harsh Kumar**

---

## 🎯 Overview

This application uses a multi-agent AI pipeline to interpret user intent and generate React UIs from natural language. Unlike general-purpose code generators, this system is **deterministic** — it uses a fixed set of 8 pre-approved components with predefined styles, ensuring consistent, predictable output every time.

### Key Features

- **3-Panel Interface** — Chat (left), Code Editor (center), Live Preview (right)
- **Natural Language → UI** — Describe what you want, get working code
- **Deterministic Output** — Fixed component library, no AI-generated CSS
- **Iterative Editing** — Modify existing UIs with follow-up prompts
- **Version History** — Track all generations with one-click rollback
- **Live Preview** — See your UI rendered in real-time
- **Safety First** — Prompt sanitization, code validation, error boundaries

---

## 🏗️ Architecture

### Agent Pipeline (3-Step)

```
User Prompt
    │
    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PLANNER   │ ──▶ │  GENERATOR  │ ──▶ │  EXPLAINER  │
│             │     │             │     │             │
│ Interprets  │     │ Converts    │     │ Explains    │
│ intent,     │     │ plan to     │     │ decisions   │
│ selects     │     │ React/TSX   │     │ in plain    │
│ layout &    │     │ code        │     │ English     │
│ components  │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
      JSON               TSX               JSON

For modifications:
┌─────────────┐
│  MODIFIER   │ ──▶ Makes minimal, targeted edits
│  (replaces  │     to existing code
│   Planner + │
│   Generator)│
└─────────────┘
```

### Deterministic Component Library (8 Components)

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `Button` | Clickable button | `variant`, `size`, `disabled` |
| `Card` | Content container | `title`, `subtitle`, `footer` |
| `Input` | Text input field | `label`, `placeholder`, `type`, `error` |
| `Table` | Data table | `columns`, `data`, `striped` |
| `Modal` | Overlay dialog | `isOpen`, `onClose`, `title`, `size` |
| `Sidebar` | Side navigation | `items`, `title`, `collapsed` |
| `Navbar` | Top navigation | `brand`, `items`, `actions` |
| `Chart` | Data visualization | `type`, `data`, `title`, `height` |

### Constraints (By Design)

- ✅ Only 8 pre-approved components
- ✅ CSS Modules for all styling (no inline styles on components)
- ✅ No AI-generated CSS
- ✅ No external UI libraries
- ✅ No arbitrary Tailwind classes
- ✅ Prompt injection protection
- ✅ Code validation before rendering

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts    # POST — full generation pipeline
│   │   ├── modify/route.ts      # POST — iterative modification
│   │   ├── versions/route.ts    # GET  — version history
│   │   ├── rollback/route.ts    # POST — rollback to version
│   │   └── _store.ts            # In-memory version store
│   ├── globals.css              # Design system tokens
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main 3-panel app
├── components/
│   ├── ui/                      # 8 deterministic components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── Chart.tsx
│   │   └── index.ts             # Barrel export
│   ├── layout/
│   │   ├── ChatPanel.tsx        # AI chat interface
│   │   ├── CodePanel.tsx        # Code editor with syntax highlight
│   │   └── VersionHistory.tsx   # Version history modal
│   ├── preview/
│   │   ├── PreviewPanel.tsx     # Live preview container
│   │   └── ComponentRenderer.tsx # Dynamic component renderer
│   └── ErrorBoundary.tsx        # React error boundary
├── lib/
│   ├── agents/
│   │   ├── geminiClient.ts      # Gemini LLM client
│   │   ├── planner.ts           # Step 1: Intent → Plan
│   │   ├── generator.ts         # Step 2: Plan → Code
│   │   ├── explainer.ts         # Step 3: Code → Explanation
│   │   ├── modifier.ts          # Iterative edit agent
│   │   ├── orchestrator.ts      # Pipeline coordinator
│   │   └── index.ts             # Barrel export
│   └── validation/
│       ├── componentRegistry.ts # Component schemas & sanitizer
│       ├── codeValidator.ts     # Generated code validation
│       └── index.ts             # Barrel export
├── styles/
│   └── components/              # CSS Modules for each component
│       ├── button.module.css
│       ├── card.module.css
│       ├── input.module.css
│       ├── table.module.css
│       ├── modal.module.css
│       ├── sidebar.module.css
│       ├── navbar.module.css
│       ├── chart.module.css
│       ├── chatPanel.module.css
│       ├── codePanel.module.css
│       ├── previewPanel.module.css
│       ├── versionHistory.module.css
│       └── appLayout.module.css
└── types/
    └── index.ts                 # TypeScript type definitions
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Gemini API Key** — Get one from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/HarshKumar133/AI-UI-Generator-Assignment-HarshKumar.git
cd AI-UI-Generator-Assignment-HarshKumar

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Gemini API key
```

### Environment Variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Usage

### Generate a UI

1. Type a description in the chat panel: *"Create a dashboard with a navbar, sidebar, stats cards, and a bar chart"*
2. Wait for the 3-step pipeline (Plan → Generate → Explain)
3. View the generated code and live preview

### Modify an Existing UI

1. After generating, type a modification: *"Add a login modal with email and password inputs"*
2. The Modifier agent makes minimal, targeted changes
3. Previous structure is preserved

### Rollback

1. Click **📋 History** in the top bar
2. Click **⏪ Restore** on any previous version
3. The UI reverts to that version

---

## 🛡️ Safety & Validation

| Layer | Protection |
|-------|------------|
| **Prompt Sanitization** | Injection pattern detection, length limits |
| **Component Whitelist** | Only 8 approved components allowed |
| **Code Validation** | Prohibited pattern detection (eval, fetch, innerHTML) |
| **Error Boundary** | Catches rendering crashes gracefully |
| **No External Imports** | Generated code cannot import external packages |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework (App Router) |
| **TypeScript** | Type safety |
| **Gemini API** | LLM for AI agents |
| **CSS Modules** | Component styling |
| **react-syntax-highlighter** | Code display |

---

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/generate` | Generate new UI from prompt |
| `POST` | `/api/modify` | Modify existing UI code |
| `GET` | `/api/versions` | Get version history |
| `POST` | `/api/rollback` | Rollback to specific version |

---

## 📜 License

MIT License — see [LICENSE](LICENSE) for details.
