# JSONata Playground (Multi-Version) 🚀

A professional, production-ready JSONata evaluation suite that supports multiple JavaScript versions and the official Java implementation (**JSONata4Java**). Built for developers who need to test JSONata expressions against different engine behaviors in a single, unified interface.

![JSONata Logo](./public/favicon.png)

## ✨ Features

- **Multi-Engine Support**: Toggle between 11 versions of JSONata (Latest v2.1.0 down to v1.8.6).
- **Official Java Integration**: Real-time evaluation using `com.ibm.jsonata4java` (v2.6.x) via a dedicated Spring Boot backend.
- **Smart Context-Aware Autocomplete**: 
  - Dynamically extracts keys from your Input JSON.
  - Understands tree structure (e.g., typing `Account.` only shows fields inside the Account object).
  - Handles array mapping (e.g., `Order[0].` or mapping over `Product.`).
  - Automatically wraps keys with spaces in double quotes (e.g., `"Account Name"`).
- **Perpetual Evaluation**: Immediate feedback with debounced auto-run on every keystroke.
- **Developer Tools**:
  - **One-click Format**: Dedicated formatting buttons for both Input JSON and JSONata Expressions.
  - **Copy to Clipboard**: Quickly grab your evaluation results.
  - **State Persistence**: Your work is automatically saved in `localStorage`.
- **Modern UI/UX**: Premium dark-themed aesthetic using Tailwind CSS and Monaco Editor (the heart of VS Code).

---

## 🏗️ Architecture

The project is structured as a monorepo-ready repository:

- **Frontend**: React 18 + TypeScript + Vite. Uses a custom `EngineAdapter` to manage versioned JS modules and remote API calls.
- **Backend** (`/backend`): Spring Boot 3 + Maven. Implements a REST API to expose the Java-based JSONata engine.

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
This project is for demonstration and development purposes. JSONata engines are subject to their respective licenses.
