# 🎨 AI UI Generator

A powerful Next.js application that generates beautiful, production-ready UI components using AI (Google Gemini). Built with TypeScript, React, and a deterministic multi-agent architecture.

![AI UI Generator](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

- **🤖 AI-Powered Generation**: Uses Google Gemini with a multi-agent architecture (Planner → Generator → Explainer)
- **🎯 Deterministic Output**: Predictable, high-quality UI components every time
- **🔄 Iterative Modifications**: Chat-based interface to refine your designs
- **📦 8 Premium Components**: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
- **🎨 Glassmorphism Design**: Modern dark theme with gradients, glows, and animations
- **📊 Rich Layouts**: Dashboard, sidebar, two-column, and more
- **⚡ Live Preview**: See your UI in real-time with version history
- **💾 Version Control**: Rollback to any previous version
- **📝 Code Export**: Copy generated React/TypeScript code

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd AI-UI-Generator-Assignment-HarshKumar
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (generate, modify, etc.)
│   ├── page.tsx           # Main UI
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # 8 core UI components
│   └── preview/           # Preview renderer
├── lib/
│   ├── agents/            # AI agent system
│   │   ├── planner.ts     # Component planning
│   │   ├── generator.ts   # Code generation
│   │   ├── modifier.ts    # Iterative edits
│   │   └── explainer.ts   # Code explanations
│   └── validation/        # Schema & validation
└── styles/
    └── components/        # Component CSS modules
```

## 🎯 How It Works

### Multi-Agent Architecture

1. **Planner Agent**: Analyzes user intent → Creates structured component plan
2. **Generator Agent**: Converts plan → React/TypeScript code
3. **Explainer Agent**: Generates clear documentation
4. **Modifier Agent**: Handles iterative refinements

### Example Flow

```
User: "Build a sales analytics dashboard"
  ↓
Planner: Creates JSON plan with Sidebar, Navbar, Charts, Tables
  ↓
Generator: Converts to React code with realistic data
  ↓
Explainer: Documents the UI structure
  ↓
Preview: Renders live preview
```

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add your `GEMINI_API_KEY` as an environment variable when asked.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add environment variable:
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key
6. Click "Deploy"

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>&env=GEMINI_API_KEY&envDescription=Get%20your%20Gemini%20API%20key%20from%20Google%20AI%20Studio&envLink=https://aistudio.google.com/apikey)

## 🎨 Available Components

| Component | Description | Props |
|-----------|-------------|-------|
| **Button** | Interactive buttons with 5 variants | `variant`, `size`, `disabled` |
| **Card** | Content containers with headers/footers | `title`, `subtitle`, `footer` |
| **Input** | Form inputs with labels & validation | `label`, `placeholder`, `type`, `error` |
| **Table** | Data tables with sorting & striping | `columns`, `data`, `striped` |
| **Chart** | Bar, line, and pie charts | `type`, `data`, `title`, `height` |
| **Sidebar** | Navigation sidebars with groups | `groups`, `title`, `collapsed` |
| **Navbar** | Top navigation bars | `brand`, `items`, `actions` |
| **Modal** | Overlay dialogs | `isOpen`, `title`, `size`, `onClose` |

## 🔧 Configuration

### Customize the AI Behavior

Edit `src/lib/agents/planner.ts` to change:
- Layout preferences
- Component selection logic
- Data generation rules

### Extend with New Components

1. Create component in `src/components/ui/YourComponent.tsx`
2. Add CSS module in `src/styles/components/yourComponent.module.css`
3. Register in `src/lib/validation/componentRegistry.ts`
4. Export from `src/components/ui/index.ts`

## 📊 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: CSS Modules (Glassmorphism design)
- **AI**: Google Gemini 1.5 Flash
- **State**: React useState (local-first)
- **Icons**: Emoji-based (no dependencies)

## 🎯 Example Prompts

Try these prompts to see the power:

- "Build a sales analytics dashboard for my SaaS company"
- "Create an e-commerce admin panel with order tracking"
- "Design a restaurant management system with menu analytics"
- "Make a fitness app dashboard with workout stats"
- "Build a CRM interface with customer data tables"

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### API Key Issues

Make sure your `.env.local` has the correct key:
```env
GEMINI_API_KEY=AIzaSy...
```

### Preview Not Updating

Click "Regenerate" or clear the chat and start fresh.

## 📝 License

MIT License - feel free to use this for personal or commercial projects!

## 🙏 Credits

Built by [Harsh Kumar](https://github.com/HarshKumar133)

Powered by:
- Google Gemini AI
- Next.js
- Vercel

---

**⭐ Star this repo if you found it helpful!**
