# 🛰️ ISS Command Center — Real-Time Dashboard

A comprehensive real-time ISS (International Space Station) tracking dashboard featuring live position tracking, speed calculation using the Haversine formula, news feed with intelligent caching, and an AI-powered chatbot.

![ISS Dashboard](https://img.shields.io/badge/ISS-Command%20Center-6366f1?style=for-the-badge&logo=satellite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)

---

## ✨ Features

### 🗺️ Real-Time ISS Tracking
- Live position tracking on an interactive Leaflet map with dark/light tile layers
- Custom satellite marker with trajectory polyline (last 15 positions)
- Position updates every **15 seconds**
- Auto-centering map with smooth fly-to animations

### 📐 Speed Calculation (Haversine Formula)
The speed of the ISS is calculated in real-time using the **Haversine formula**:

$$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos\phi_1\cos\phi_2\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$

- Distance between consecutive coordinates divided by the 15-second interval
- Speed displayed in km/h (~27,500 km/h average)
- Historical speed chart showing last 30 readings

### 👨‍🚀 Astronaut Crew
- Live crew list fetched from Open Notify API
- Grouped by spacecraft (ISS, Tiangong, etc.)
- Crew count badge

### 📰 News Dashboard
- Fetches space news from NewsAPI
- **Search bar** and **category filters** (7 categories)
- **localStorage caching** with 15-minute TTL
- Cache status indicator showing time until next refresh
- **Refresh button** to bypass cache
- Article cards with image, title, source, and "Read More" link

### 🤖 AI Chatbot (Restricted)
- Powered by **Mistral-7B-Instruct-v0.2** via Hugging Face Inference API
- **RAG-lite architecture**: AI only answers from live dashboard data
- System prompt restricts responses to current ISS coordinates, speed, and news
- Typing indicator animation
- Chat history persisted in localStorage (last 30 messages)
- Floating chat button with expandable window

### 🎨 UI/UX
- **Dark/Light mode** with localStorage persistence
- **Glassmorphism** card design with backdrop blur
- **Collapsible sidebar** navigation
- **Framer Motion** animations throughout
- Responsive CSS Grid layout
- Custom scrollbar styling

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite 5 | Frontend framework & build tool |
| Tailwind CSS 3.4 | Utility-first styling |
| Leaflet + React-Leaflet | Interactive map |
| Chart.js + React-Chartjs-2 | Speed line chart & pie chart |
| Framer Motion | Animations |
| Lucide React | Icon library |
| Axios | HTTP client |
| Hugging Face API | AI chatbot (Mistral-7B) |

---

## 📡 APIs Used

| API | Endpoint | Polling |
|---|---|---|
| ISS Position | `http://api.open-notify.org/iss-now.json` | Every 15s |
| Astronauts | `http://api.open-notify.org/astros.json` | On mount |
| News | `https://newsapi.org/v2/everything` | 15-min cache |
| AI Chat | `https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2` | On demand |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/iss-dashboard.git
cd iss-dashboard
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_NEWS_API_KEY=your_newsapi_key_here
VITE_AI_TOKEN=your_huggingface_token_here
```

- Get a News API key from [newsapi.org](https://newsapi.org)
- Get a Hugging Face token from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📦 Deployment (Vercel)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel Dashboard → Project Settings → Environment Variables:
   - `VITE_NEWS_API_KEY`
   - `VITE_AI_TOKEN`
4. Deploy!

---

## 🤖 LLM Model Choice

**Q: Which LLM model did you use in this application, and why?**

I used **Mistral-7B-Instruct-v0.2** via the Hugging Face API. I chose this model because:

1. **Instruction-following**: Excellent at adhering to system prompts, crucial for restricting responses to dashboard data only
2. **RAG-lite capability**: Strong ability to ground responses in provided context without hallucinating outside information
3. **Performance**: Fast inference times while maintaining high-quality responses
4. **Efficiency**: Smaller than GPT-4 or Llama-70B but more capable than smaller models for our use case

---

## 📁 Project Structure

```
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .env
├── public/
│   └── vite.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── hooks/
    │   ├── useISSData.js      # ISS position, Haversine speed, astronauts
    │   ├── useNews.js         # News with 15-min localStorage cache
    │   ├── useDarkMode.js     # Theme toggle persistence
    │   └── useChatbot.js      # Mistral-7B AI integration
    └── components/
        ├── Sidebar.jsx
        ├── Header.jsx
        ├── ISSMap.jsx
        ├── ISSStats.jsx
        ├── AstronautList.jsx
        ├── SpeedChart.jsx
        ├── NewsFeed.jsx
        ├── CategoryPieChart.jsx
        └── Chatbot.jsx
```

---

## 📄 License

MIT License
