☕ Café Scout

A modern café discovery web app that helps users find nearby cafés, explore them on an interactive map, and get smart recommendations based on ratings, distance, and availability.

✨ Features: 
📍 Live location-based café search
🗺️ Interactive Google Maps integration
☕ Nearby café listing with ranking system
⭐ Rating-based sorting & filtering
🟢 Open / Closed status detection
🔍 Smart filters (radius, rating, availability)
🧭 Click-to-sync map and list selection
💬 AI Chat assistant (Gemini integration)
🎨 Cozy, aesthetic UI design

🧠 Tech Stack: 
⚛️ React (Vite)
🎨 CSS / Inline styling (custom cozy theme)
🗺️ Google Maps JavaScript API
📍 Google Places API
🤖 Gemini API (AI assistant)
⚡ JavaScript (ES6+)

📁 Project Structure:
cafe-scout/
├── public/
├── src/
│   ├── components/
│   │   ├── CafeCard.jsx
│   │   ├── CafeList.jsx
│   │   ├── MapView.jsx
│   │   ├── FilterBar.jsx
│   │   ├── ChatPanel.jsx
│   │   └── BeanCharacter.jsx
│   ├── hooks/
│   │   ├── useCafes.js
│   │   └── useLocation.js
│   ├── services/
│   │   ├── placesApi.js
│   │   ├── geminiApi.js
│   │   └── prompts/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
└── tailwind.config.js

🚀 Getting Started
1. Clone the repository
git clone https://github.com/your-username/cafe-scout.git
cd cafe-scout
2. Install dependencies
npm install
3. Add environment variables

Create a .env file:

VITE_GOOGLE_MAPS_KEY=your_google_maps_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
4. Run the app
npm run dev

🧭 How it works
The app gets your current location
It fetches nearby cafés using Google Places API
Cafés are:
ranked by rating
filtered by user preferences
Data is displayed in:
📋 List view (CafeList)
🗺️ Map view (MapView)
Clicking a café syncs:
map marker
info window
list selection

🎨 UI Concept

This project follows a warm, cozy café aesthetic:

Soft beige & coffee tones
Minimalist typography
Smooth hover animations
Card-based layout
Focus on comfort and readability

🔥 Key Highlights
Fully synced Map ↔ List interaction system
Clean café ranking logic
Smart handling of missing API data (open/closed status)
Optimized Google Maps marker rendering
Modular React component architecture

🧪 Future Improvements
 Café clustering for large datasets
 Real-time popularity scoring
 User reviews integration
 Favorites / saved cafés
 Dark mode UI
 Mobile-first redesign

👨‍💻 Developer

Built by a student developer passionate about:

full-stack web development
UI/UX design
location-based applications
AI-assisted interfaces

 📌 License

This project is for educational and portfolio purposes.

