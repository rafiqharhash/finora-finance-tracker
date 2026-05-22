# Finora Mobile — React Native (Expo)

A premium Android finance tracker app built with **Expo + React Native**, sharing the same backend as the Finora web application.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- For physical device: **Expo Go** app ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- For Android emulator: Android Studio with AVD configured

### Installation

```bash
cd mobile
npm install
```

### Run on Android

```bash
# Expo Go (fastest — scan QR code)
npm start

# Android emulator
npm run android
```

---

## 📱 Features

| Screen | Features |
|--------|---------|
| **Landing** | App intro, demo mode, login/register |
| **Dashboard** | Balance card, income/expense stats, AI insights, recent transactions |
| **Transactions** | FlatList with search & filter, add/edit/delete modal, category picker |
| **Budgets** | Progress bars, overspend alerts, summary totals |
| **Reports** | Bar chart, monthly breakdown table, category breakdown |
| **Settings** | Dark/light toggle, currency picker, profile, logout |

---

## 🔌 Backend API

The app connects to the existing Finora Node.js/Express backend:

| Environment | URL |
|-------------|-----|
| **Android Emulator (local)** | `http://10.0.2.2:5000/api/v1` |
| **Physical Device (local)** | `http://<your-local-ip>:5000/api/v1` |
| **Production** | Update `BASE_URL` in `src/api/axiosClient.ts` |

> **Note**: On a physical device, replace `10.0.2.2` with your computer's local IP address (e.g. `192.168.1.x`).

---

## 🎮 Demo Mode

The app includes a fully offline demo mode with seeded realistic data:
- No login required
- Persists across restarts via AsyncStorage
- Full access to all screens and features

Tap **"Try Demo Mode"** on the landing screen.

---

## 🏗️ Architecture

```
mobile/
├── app/                      # Expo Router file-based routes
│   ├── _layout.tsx           # Root layout (QueryClient, GestureHandler)
│   ├── index.tsx             # Splash / auth router
│   ├── (auth)/               # Auth screens (unauthenticated)
│   │   ├── landing.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── onboarding.tsx
│   └── (app)/                # Protected app screens
│       ├── _layout.tsx       # Bottom tab navigator
│       ├── dashboard.tsx
│       ├── transactions.tsx
│       ├── budgets.tsx
│       ├── reports.tsx
│       └── settings.tsx
└── src/
    ├── api/                  # Axios API layer
    │   ├── axiosClient.ts    # Axios instance + interceptors
    │   ├── auth.ts
    │   ├── transactions.ts
    │   └── budgets.ts        # budgets + reports
    ├── components/
    │   ├── layout/
    │   │   └── Screen.tsx    # SafeArea + scroll wrapper
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── Input.tsx
    │       └── TransactionItem.tsx
    ├── data/
    │   └── demoData.ts       # Offline demo seed data
    ├── store/
    │   ├── useAuthStore.ts   # JWT + demo mode (SecureStore)
    │   └── useUIStore.ts     # Theme + currency (AsyncStorage)
    └── theme/
        ├── tokens.ts         # Colors, spacing, typography
        └── useTheme.ts       # Theme hook
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#7C3AED` (violet) |
| Success | `#10B981` (emerald) |
| Danger | `#F43F5E` (rose) |
| Warning | `#F59E0B` (amber) |
| Dark BG | `#0F172A` (slate-900) |

---

## 📦 Production Build (EAS)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build preview APK
eas build --platform android --profile preview

# Build production AAB
eas build --platform android --profile production
```

---

## 🔐 Auth & Security

- JWT tokens stored in **expo-secure-store** (device Keystore)
- Auto-login on app open if valid token exists
- Auto-logout on 401 API response
- Demo mode persisted in AsyncStorage

---

## ⚙️ Configuration

### Minimum Requirements
- Android 8.0 (API 26)
- Expo SDK 56
- React Native 0.85

### Changing the API URL
Edit `src/api/axiosClient.ts`:
```ts
const BASE_URL = __DEV__
  ? 'http://10.0.2.2:5000/api/v1'   // emulator
  : 'https://your-api.com/api/v1';   // production
```
