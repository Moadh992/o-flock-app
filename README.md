# O'Flock App 🚀

O’Flock is an AI-powered business ideation and execution planning platform. It helps ambitious builders turn raw ideas into comprehensive execution blueprints, covering marketing, action plans, and business strategy.

## 🌟 Features

- **AI-Driven Blueprints**: Generate full execution plans from a basic business concept using Google's Gemini AI.
- **Mission Management**: Save, organize, and track your business missions.
- **Production-Ready Backend**: Powered by Supabase for secure authentication, real-time database, and RLS policies.
- **Subscription System**: Integrated with Polar.sh for freemium limits and payments.
- **Modern UI/UX**: Built with React 19, Tailwind CSS, and Framer Motion for a premium experience.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Backend**: Supabase (Auth, DB, RLS)
- **Payments**: Polar.sh SDK
- **AI Integration**: Google Gemini (@google/generative-ai)
- **Styling & Animation**: Tailwind CSS, Framer Motion, Lucide React (Icons)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Supabase Account
- Google Gemini API Key

### Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Moadh992/o-flock-app.git
   cd o-flock-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the dev server**:
   ```bash
   npm run dev
   ```

---

Built with ❤️ by Ado (@Moadh992)
