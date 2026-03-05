# OFFHOOK — The World's Smartest Excuse Engine

<p align="center">
  <strong>⚡ AI-Powered Excuse Generation • Context-Aware • Never Repeat</strong>
</p>

## Overview

OFFHOOK is a full AI-powered excuse management system that uses your real-world context — location, weather, time, cultural identity, and contact history — to generate hyper-realistic, locally believable, never-repeated excuses.

## Features (Phase 1 MVP)

- **🎯 Smart Excuse Generator** — Category, tone, urgency, and situation-aware
- **🧠 AI-Powered** — Claude API integration (mock AI included for development)
- **🌍 Context-Aware** — Real weather, location, and time data
- **🔄 Anti-Repetition Engine** — Never uses the same excuse twice per contact
- **📊 Risk Meter** — Animated gauge scoring excuse believability (1-100)
- **🎭 Delivery Coach** — Tips on HOW to say it, WHEN to send it
- **👥 Contact Manager** — Per-contact excuse history and cooldowns
- **💎 Premium Tier** — Unlimited excuses, proof generator, alibi builder

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State**: Zustand
- **Animations**: Reanimated 3
- **Design**: Glassmorphism + Deep Space UI
- **AI**: Anthropic Claude API (scaffolded)
- **Storage**: AsyncStorage + MMKV

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on web (preview)
npx expo start --web

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

## Project Structure

```
offhook/
├── src/
│   ├── core/
│   │   ├── ai/          # AI engine, prompt builder, mock AI, risk scorer
│   │   └── theme/       # Colors, typography, spacing, animations
│   ├── features/
│   │   ├── excuse_generator/  # Home, Generator, Result screens
│   │   ├── contact_manager/   # Contact management
│   │   ├── onboarding/        # 5-slide onboarding
│   │   ├── auth/              # Login/signup
│   │   ├── settings/          # User preferences
│   │   └── monetization/      # Premium paywall
│   ├── shared/
│   │   ├── components/   # GlassPanel, Button, Card, RiskGauge, etc.
│   │   └── constants/    # Categories, tones, relationships
│   └── stores/           # Zustand stores
├── App.tsx               # Main entry + navigation
└── app.json              # Expo configuration
```

## License

Proprietary — All rights reserved.
