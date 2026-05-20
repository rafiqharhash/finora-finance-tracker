# Finora Finance Tracker

Finora is a modern, full-stack personal finance tracking application designed for students, freelancers, and young professionals. It features a premium, responsive UI with glassmorphism effects, smooth animations, and actionable AI-driven financial insights.

![Finora Dashboard](https://via.placeholder.com/800x450.png?text=Finora+Dashboard)

## Features

- **Dashboard Overview**: Get a bird's-eye view of your finances with total balance, monthly income, expenses, and savings rate.
- **Transaction Management**: Add, edit, and delete income and expenses with categorical tagging.
- **Smart Budgets**: Set category-specific monthly spending limits and receive visual alerts when you exceed your thresholds.
- **Savings Goals**: Track your progress towards financial goals with visual progress bars.
- **Interactive Charts**: Visualize your spending habits with Recharts (Expense Breakdowns, Income vs. Expense comparisons, Monthly Trends).
- **AI Insights Engine**: Deterministic rules that analyze your recent transactions and notify you about overspending, top categories, and savings rate milestones.
- **Data Export**: Export your transactions to a CSV file for backup or use in Excel.
- **Demo Mode**: Test drive the fully-featured frontend locally without spinning up the backend or creating an account!

## Tech Stack

### Frontend (Client)
- **React 18** + **Vite**
- **Tailwind CSS** (for styling and glassmorphism UI)
- **Zustand** (for global state management + localStorage persistence)
- **Framer Motion** (for page transitions and micro-animations)
- **Recharts** (for data visualization)
- **React Router v6** (for routing)
- **React Hook Form** + **React Hot Toast** (for forms and notifications)

### Backend (Server)
- **Node.js** + **Express**
- **MongoDB** + **Mongoose** (Database)
- **JWT** (Authentication)
- **Bcryptjs** (Password hashing)
- **Winston / Morgan** (Logging)
- **Helmet / Express Rate Limit** (Security)

## Project Structure

This is a monorepo containing both the frontend client and the backend server.

```
finora-finance-tracker/
├── client/          # Vite + React application
├── server/          # Node.js + Express REST API
├── .gitignore
└── README.md
```

## Getting Started

### Running the Frontend (Local Demo Mode)

You can run the entire frontend completely independently using the built-in "Demo Mode".

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.
5. Click **"Try Demo Mode First"** to jump right into the dashboard populated with seeded demo data.

### Running the Backend

If you wish to attach the backend database to save real user data:

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Rename `.env.example` to `.env` and update your MongoDB URI:
   ```bash
   cp .env.example .env
   ```
4. Start the Express server:
   ```bash
   npm run dev
   ```
*(The backend runs on `http://localhost:5000` by default. The Vite frontend is configured to proxy API requests automatically to this port).*

## UI Design Principles

Finora relies on a custom design system defined in `client/src/index.css` and `tailwind.config.js`:
- **8px grid system** for consistent spacing.
- **Glassmorphism cards** (`.glass-card`) for a premium layout.
- **Custom animations** (Slide Up, Fade In, Scale In) for a dynamic feel.
- **Semantic Color Palette** (Primary Violet, Success Emerald, Danger Rose, Warning Amber).

## License

This project is licensed under the MIT License.
