# PARALLAX CV Lab

> Advanced Spatial Computing, Computer Vision Simulation, and Next-Gen Interface Architecture.

---

## 🌟 Overview

**PARALLAX** is an interactive computer vision research and spatial computing laboratory environment. It integrates high-fidelity visual simulations, real-time prediction benchmarks, smart operational workflows, and intelligent local assistant support.

---

## 📂 Project Architecture

```plaintext
├── apps/
│   ├── lab-web/         # React + Vite frontend application & interactive lab
│   └── lab-server/      # Local AI assistant service (Ollama integration)
├── design/              # UI/UX design tokens, Figma specifications & system reviews
├── prototype/           # Preserved core prototype engine & validation suites
├── research/            # Computer vision research, synthesis, and experiment records
├── spatial/             # 3D coordinate engines, space analysis & Three.js visualizers
└── submission/          # Reports, presentation decks, documentation & evidence index
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **npm**: v9+
- *(Optional)* **Ollama** with `llama3.2:3b` for local AI assistant features

### 1. Installation

Install root dependencies and client application packages:

```bash
npm install
npm --prefix apps/lab-web install
```

### 2. Running the Applications

- **Frontend Lab Web App (Vite)**:
  ```bash
  npm run lab:dev
  ```

- **Local Assistant Server**:
  ```bash
  npm run assistant:start
  ```

- **Run Preserved Prototype / Review Server**:
  ```bash
  npm start
  ```

### 3. Verification & Testing

Run comprehensive validation checks and test suites across all modules:

```bash
# Run unit & component tests
npm run lab:test
npm run assistant:test

# Run full project validation
npm run check
```

---

## 🔬 Core Features & Capabilities

- **Real-Time Prediction & Benchmarks**: 3 Hz fixed-reference comparison against high-rate sampling models.
- **Dynamic Spatial 3D Engine**: Spatial lighting simulation, bounding geometry, and environment analysis.
- **Fault-Tolerant Operations**: Multi-stage simulation covering restriction, interruption, refusal, and verified recovery.
- **Local AI Assistant**: Privacy-first, local LLM guidance with grounded documentation citations.

---

## 📜 License

Private & Academic Research Project. All rights reserved.
