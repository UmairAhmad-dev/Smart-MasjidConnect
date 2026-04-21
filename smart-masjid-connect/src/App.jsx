// src/App.jsx
import { useState } from 'react'
// 1. Import Routes and Route from react-router-dom
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// Import all our new and updated Pages (see below to create them)
import HomePage from './pages/HomePage'
import IntroPage from './pages/IntroPage'
import PrayersPage from './pages/PrayersPage'
import AnnouncementsPage from './pages/AnnouncementsPage'
import DonatePage from './pages/DonatePage'
import IntezamiaPage from './pages/IntezamiaPage'
// src/App.jsx (Add this near the other imports)
import AdminPanel from './pages/AdminPanel.jsx';

// === LOCALIZATION DATA (Updated for new pages) ===
const localizations = {
  en: {
    projectName: "Smart MasjidConnect",
    urduMasjidName: "مدینہ مسجد ساہیوال", 
    navHome: "Home",
    navAbout: "Introduction", // New link
    navPrayers: "Prayers",
    navAnnouncements: "Announcements",
    navDonate: "Donate Now",
    navIntezamia: "Intezamia", // New link
    heroWelcome: "Welcome To Madina Masjid Sahiwal",
    hadithTitle: "Daily Hadith",
    hadithText: "He who believes in Allah and the Last Day, let him show hospitality to his guest.",
    nextPrayer: "Next Prayer",
    saveChange: "Save Changes"
  },
  ur: {
    projectName: "اسمارٹ مسجد کنیکٹ",
    urduMasjidName: "مدینہ مسجد ساہیوال", 
    navHome: "ہوم",
    navAbout: "مسجد کا تعارف", // New translation
    navPrayers: "نماز کے اوقات",
    navAnnouncements: "اعلانات",
    navDonate: "عطیہ کریں",
    navIntezamia: "انتظامیہ", // New translation
    heroWelcome: "مدینہ مسجد ساہیوال میں خوش آمدید",
    hadithTitle: "روزانہ حدیث",
    hadithText: "جو اللہ اور آخرت کے دن پر ایمان رکھتا ہے، اسے چاہیے کہ اپنے مہمان کی مہمان نوازی کرے۔",
    nextPrayer: "اگلی نماز",
    saveChange: "تبدیلی محفوظ کریں"
  }
};

function App() {
  const [lang, setLang] = useState('en'); // 'en' or 'ur'
  const t = localizations[lang];

  return (
    // Handle RTL/LTR based on language
    <div className={`flex flex-col min-h-screen ${lang === 'ur' ? 'font-serif text-right' : 'font-sans text-left'}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      {/* Header and language toggle pass localization */}
      <Navbar setLang={setLang} lang={lang} t={t} />
      
      {/* === MAIN ROUTING AREA === */}
      {/* Instead of rendering a single page component, we use Routes to swap content */}
      <main className="flex-grow">
        <Routes>
          {/* Default Route (the Home Page) */}
          <Route path="/" element={<HomePage t={t} />} />
          
          {/* New Separate Pages Routes */}
          <Route path="/about" element={<IntroPage t={t} />} />
          <Route path="/prayers" element={<PrayersPage t={t} />} />
          <Route path="/announcements" element={<AnnouncementsPage t={t} />} />
          <Route path="/donate" element={<DonatePage t={t} />} />
          <Route path="/intezamia" element={<IntezamiaPage t={t} />} />

        
    <Route path="/" element={<HomePage t={t} />} />
    <Route path="/announcements" element={<AnnouncementsPage t={t} />} />

    {/* NEW ADMIN ROUTE (Add this line) */}
    <Route path="/admin" element={<AdminPanel />} /> 


          
          {/* Fallback (optional: a basic 404 handler) */}
          <Route path="*" element={<div className="text-center p-20 text-xl">404 - Page Not Found</div>} />
        </Routes>
      </main>

      <Footer t={t} />
    </div>
  )
}

export default App