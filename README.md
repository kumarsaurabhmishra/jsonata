# JSON Transformer Playground (JSONata & Jolt) 🚀

A professional, production-ready JSON evaluation and transformation suite that supports **JSONata** (JavaScript & Java) and **Jolt** (Java). Built for developers who need to test complex JSON transformations against different engines in a single, unified interface.

![JSON Transformer Logo](./public/favicon.png)

## ✨ Features

- **Multi-Engine Support**: 
  - **JSONata**: Toggle between 11 versions of JSONata (Latest v2.1.0 down to v1.8.6).
  - **Jolt**: Full support for Jolt transformations (Chainr, Shift, Defaultr, etc.).
- **Official Java Integration**: 
  - Real-time **JSONata** evaluation using `com.ibm.jsonata4java` (v2.6.x).
  - Real-time **Jolt** evaluation using `com.bazaarvoice.jolt:jolt-core` (v0.1.8).
- **Smart Context-Aware Autocomplete (JSONata)**: 
  - Dynamically extracts keys from your Input JSON.
  - Understands tree structure (e.g., typing `Account.` only shows fields inside the Account object).
  - Automatically wraps keys with spaces in double quotes.
- **Perpetual Evaluation**: Immediate feedback with debounced auto-run on every keystroke.
- **Developer Tools**:
  - **One-click Format**: Dedicated formatting buttons for Input JSON, JSONata Expressions, and Jolt Specs.
  - **Copy to Clipboard**: Quickly grab your evaluation results.
  - **State Persistence**: Your work and active mode (JSONata/Jolt) are automatically saved in `localStorage`.
- **Modern UI/UX**: Premium dark-themed aesthetic using Tailwind CSS and Monaco Editor.

---

## 🏗️ Architecture

The project is structured as a Spring Boot + React monorepo:

- **Frontend**: React 18 + TypeScript + Vite. Uses a custom `EngineAdapter` to manage local JS engines and remote API calls.
- **Backend** (`/backend`): Spring Boot 3 + Maven. Implements a REST API to expose the Java-based JSONata and Jolt engines.

---

## 🛠️ Local Development

### 1. Frontend
```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

### 2. Backend
Ensure you have **JDK 17** and **Maven** installed.
```bash
cd backend
mvn spring-boot:run
```

---

## 🤝 Created By
Created with ❤️ by **[Saurabh](https://github.com/kumarsaurabhmishra)**.🎓

---

## 📄 License
This project is for demonstration and development purposes. JSONata and Jolt engines are subject to their respective licenses.
