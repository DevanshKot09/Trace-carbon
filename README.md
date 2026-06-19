# 🌱 CarbonWise

An interactive, beautiful carbon footprint tracking application designed to monitor, analyze, and reduce carbon emissions with gamification, calculator tools, and analytics dashboards.

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Private-red.svg)
![React](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.15.0-FFCA28?logo=firebase)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Firebase Integration](#firebase-integration)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## 🌍 Overview

**CarbonWise** is a comprehensive carbon footprint tracking platform that empowers users to understand, monitor, and reduce their environmental impact. The application combines modern web technologies with AI-powered insights to provide personalized recommendations for sustainable living.

### Key Highlights

- **Real-time Carbon Tracking**: Monitor your daily carbon emissions across various activities
- **AI-Powered Insights**: Get personalized recommendations using Google's Gemini AI
- **Gamification**: Earn achievements and compete on leaderboards to stay motivated
- **Interactive Dashboards**: Visualize your carbon footprint with beautiful charts and analytics
- **Goal Setting**: Set and track carbon reduction goals with progress monitoring
- **Carbon Calculator**: Calculate emissions for transportation, energy, food, and more
- **Detailed Reports**: Generate comprehensive reports on your environmental impact

## ✨ Features

### 🎯 Core Features

- **Activity Tracking**: Log daily activities and automatically calculate carbon emissions
- **Dashboard Analytics**: View comprehensive statistics and trends of your carbon footprint
- **Carbon Calculator**: Calculate emissions for various activities:
  - Transportation (car, bus, train, flight)
  - Energy consumption (electricity, heating)
  - Food choices (diet types, meal planning)
  - Shopping and lifestyle
- **Goal Management**: Set personalized carbon reduction goals and track progress
- **AI Chatbot**: Interactive AI assistant powered by Gemini for eco-friendly advice
- **Recommendations Engine**: Get personalized suggestions to reduce your carbon footprint
- **Reports & Analytics**: Generate detailed reports with visualizations
- **Gamification System**: 
  - Achievement badges
  - Leaderboards
  - Progress tracking
  - Rewards system

### 🔐 User Features

- **Authentication**: Secure user authentication via Firebase
- **Onboarding**: Guided setup process for new users
- **Settings Management**: Customize your experience and preferences
- **Progressive Web App (PWA)**: Install and use offline with service worker support

## 🛠️ Tech Stack

### Frontend

- **React 19.0.1**: Modern UI library with latest features
- **TypeScript 5.8.2**: Type-safe development
- **Vite 6.2.3**: Lightning-fast build tool and dev server
- **React Router DOM 7.18.0**: Client-side routing
- **Tailwind CSS 4.1.14**: Utility-first CSS framework
- **Motion 12.23.24**: Smooth animations and transitions
- **Lucide React 0.546.0**: Beautiful icon library
- **Recharts 3.8.1**: Composable charting library

### Backend

- **Express 4.21.2**: Node.js web application framework
- **TypeScript**: Type-safe server-side code
- **Firebase 12.15.0**: Backend-as-a-Service platform
  - Authentication
  - Firestore Database
  - Cloud Storage
  - Hosting

### AI & APIs

- **Google Gemini AI (@google/genai 2.4.0)**: AI-powered recommendations and chatbot
- **Gemini API**: Natural language processing and insights

### Development Tools

- **ESBuild 0.25.0**: Fast JavaScript bundler
- **Vitest 4.1.9**: Unit testing framework
- **TSX 4.21.0**: TypeScript execution for development
- **Autoprefixer 10.4.21**: PostCSS plugin for vendor prefixes

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.x or higher (recommended: 18.x or 20.x)
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: For version control
- **Firebase Account**: For backend services
- **Google AI Studio Account**: For Gemini API access

### Verify Installation

```bash
node --version  # Should output v16.x.x or higher
npm --version   # Should output 8.x.x or higher
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CarbonWise
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in [`package.json`](package.json:14-27).

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env.local` file in the root directory by copying the example file:

```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` and add your API keys:

```env
# GEMINI_API_KEY: Required for Gemini AI API calls
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY="your_gemini_api_key_here"

# APP_URL: The URL where this applet is hosted
# For local development, use: http://localhost:5173
# For production, use your deployed URL
APP_URL="http://localhost:5173"
```

### 3. Firebase Configuration

The Firebase configuration is already set up in [`firebase-applet-config.json`](firebase-applet-config.json:1-10). This file contains:

- **Project ID**: Firebase project identifier
- **App ID**: Firebase app identifier
- **API Key**: Firebase API key
- **Auth Domain**: Authentication domain
- **Firestore Database ID**: Database identifier
- **Storage Bucket**: Cloud storage bucket
- **Messaging Sender ID**: Cloud messaging identifier

**Note**: For production, you should replace these values with your own Firebase project credentials.

### 4. Firestore Security Rules

The database security rules are defined in [`firestore.rules`](firestore.rules). Make sure to deploy these rules to your Firebase project:

```bash
firebase deploy --only firestore:rules
```

## 🏃 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

This command:
- Starts the Express server using [`tsx`](package.json:7)
- Runs the Vite dev server
- Enables hot module replacement (HMR)
- Opens the application at `http://localhost:5173`

The server file [`server.ts`](server.ts) handles:
- API routes for Gemini AI integration
- Static file serving
- Environment variable management
- Express middleware configuration

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🏗️ Building for Production

### 1. Build the Application

```bash
npm run build
```

This command:
- Builds the React frontend using Vite (outputs to `dist/`)
- Bundles the Express server using ESBuild (outputs to `dist/server.cjs`)
- Optimizes assets for production
- Generates source maps for debugging

### 2. Start Production Server

```bash
npm start
```

This runs the bundled server from `dist/server.cjs`.

### 3. Clean Build Artifacts

```bash
npm run clean
```

Removes the `dist/` directory and `server.js` file.

## 📁 Project Structure

```
CarbonWise/
├── src/                          # Source code directory
│   ├── components/               # React components
│   │   ├── ActivityFormModal.tsx # Activity logging modal
│   │   ├── AiChatBot.tsx        # AI chatbot component
│   │   ├── GoalFormModal.tsx    # Goal creation modal
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── Sidebar.tsx          # Sidebar navigation
│   │   └── Skeletons.tsx        # Loading skeletons
│   ├── pages/                    # Page components
│   │   ├── ActivityPage.tsx     # Activity tracking page
│   │   ├── CalculatorPage.tsx   # Carbon calculator
│   │   ├── DashboardPage.tsx    # Main dashboard
│   │   ├── ErrorPage.tsx        # Error handling page
│   │   ├── GamificationPage.tsx # Achievements & leaderboards
│   │   ├── GoalsPage.tsx        # Goal management
│   │   ├── LandingPage.tsx      # Landing page
│   │   ├── LoginPage.tsx        # Authentication page
│   │   ├── OnboardingPage.tsx   # User onboarding
│   │   ├── RecommendationsPage.tsx # AI recommendations
│   │   ├── ReportsPage.tsx      # Analytics reports
│   │   └── SettingsPage.tsx     # User settings
│   ├── context/                  # React context providers
│   │   └── AppContext.tsx       # Global app state
│   ├── services/                 # Service layer
│   │   ├── api.ts               # API client
│   │   └── firebase.ts          # Firebase configuration
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts             # Shared types
│   ├── utils/                    # Utility functions
│   │   ├── carbon.ts            # Carbon calculation logic
│   │   ├── carbon.test.ts       # Carbon utils tests
│   │   ├── validation.ts        # Input validation
│   │   └── validation.test.ts   # Validation tests
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── assets/                       # Asset files
│   └── .aistudio/               # AI Studio assets
├── server.ts                     # Express server
├── index.html                    # HTML template
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── firebase-applet-config.json  # Firebase config
├── firebase-blueprint.json      # Firebase blueprint
├── firestore.rules              # Firestore security rules
├── metadata.json                # App metadata
├── package.json                 # Dependencies & scripts
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 📜 Available Scripts

All scripts are defined in [`package.json`](package.json:6-12):

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server with HMR |
| `build` | `npm run build` | Build for production |
| `start` | `npm start` | Run production server |
| `clean` | `npm run clean` | Remove build artifacts |
| `lint` | `npm run lint` | Type-check TypeScript files |
| `test` | `npm run test` | Run unit tests with Vitest |

## 🧪 Testing

The project uses Vitest for unit testing.

### Run Tests

```bash
npm test
```

### Test Files

- [`src/utils/carbon.test.ts`](src/utils/carbon.test.ts): Tests for carbon calculation utilities
- [`src/utils/validation.test.ts`](src/utils/validation.test.ts): Tests for validation functions

### Writing Tests

Tests are co-located with their source files using the `.test.ts` extension. Example:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint } from './carbon';

describe('calculateCarbonFootprint', () => {
  it('should calculate emissions correctly', () => {
    const result = calculateCarbonFootprint({ /* ... */ });
    expect(result).toBe(expectedValue);
  });
});
```

## 🔥 Firebase Integration

### Services Used

1. **Authentication**: User sign-up, login, and session management
2. **Firestore Database**: Store user data, activities, goals, and achievements
3. **Cloud Storage**: Store user profile images and documents
4. **Hosting**: Deploy the application (optional)

### Firebase Configuration

The Firebase SDK is initialized in [`src/services/firebase.ts`](src/services/firebase.ts) using the configuration from [`firebase-applet-config.json`](firebase-applet-config.json:1-10).

### Security Rules

Firestore security rules are defined in [`firestore.rules`](firestore.rules) to protect user data and ensure proper access control.

## 🤖 API Integration

### Gemini AI Integration

The application uses Google's Gemini AI for:

- **AI Chatbot**: Conversational interface for eco-friendly advice
- **Recommendations**: Personalized suggestions based on user data
- **Insights**: Analysis of carbon footprint patterns

### API Client

The API client is implemented in [`src/services/api.ts`](src/services/api.ts) and handles:

- Gemini API requests
- Error handling
- Response parsing
- Rate limiting

### Server-Side API

The Express server in [`server.ts`](server.ts) provides:

- Proxy endpoints for Gemini API calls
- API key management
- Request validation
- Response caching

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Write unit tests for new features
- Run `npm run lint` before committing
- Ensure all tests pass with `npm test`

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- **Google Gemini AI**: For powering the AI features
- **Firebase**: For backend infrastructure
- **React Team**: For the amazing framework
- **Vite Team**: For the blazing-fast build tool
- **Open Source Community**: For the incredible tools and libraries

## 📞 Support

For questions, issues, or feature requests, please open an issue on the repository.

---

**Built with ❤️ for a sustainable future 🌍**
