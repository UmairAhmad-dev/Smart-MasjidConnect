// src/App.jsx
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import IntroPage from './pages/IntroPage'
import PrayersPage from './pages/PrayersPage'
import AnnouncementsPage from './pages/AnnouncementsPage'
import DonatePage from './pages/DonatePage'
import IntezamiaPage from './pages/IntezamiaPage'

import AdminPanel from './pages/AdminPanel.jsx';

//LOCALIZATION DATA 
const localizations = {
  en: {
    projectName: "Smart MasjidConnect",
    urduMasjidName: "مدینہ مسجد ساہیوال", 
    navHome: "Home",
    navAbout: "Introduction", 
    navPrayers: "Prayers",
    navAnnouncements: "Announcements",
    navDonate: "Donate Now",
    navIntezamia: "Intezamia", 
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
    navAbout: "مسجد کا تعارف", 
    navPrayers: "نماز کے اوقات",
    navAnnouncements: "اعلانات",
    navDonate: "عطیہ کریں",
    navIntezamia: "انتظامیہ", 
    heroWelcome: "مدینہ مسجد ساہیوال میں خوش آمدید",
    hadithTitle: "روزانہ حدیث",
    hadithText: "جو اللہ اور آخرت کے دن پر ایمان رکھتا ہے، اسے چاہیے کہ اپنے مہمان کی مہمان نوازی کرے۔",
    nextPrayer: "اگلی نماز",
    saveChange: "تبدیلی محفوظ کریں"
  }
};

function App() {
  const [lang, setLang] = useState('en'); 
  const t = localizations[lang];

  return (
   
    <div className={`flex flex-col min-h-screen ${lang === 'ur' ? 'font-serif text-right' : 'font-sans text-left'}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
    
      <Navbar setLang={setLang} lang={lang} t={t} />
      
      <main className="flex-grow">
        <Routes>
         
          <Route path="/" element={<HomePage t={t} />} />
         
          <Route path="/about" element={<IntroPage t={t} />} />
          <Route path="/prayers" element={<PrayersPage t={t} />} />
          <Route path="/announcements" element={<AnnouncementsPage t={t} />} />
          <Route path="/donate" element={<DonatePage t={t} />} />
          <Route path="/intezamia" element={<IntezamiaPage t={t} />} />

        
    <Route path="/" element={<HomePage t={t} />} />
    <Route path="/announcements" element={<AnnouncementsPage t={t} />} />

    <Route path="/admin" element={<AdminPanel />} /> 


    
          <Route path="*" element={<div className="text-center p-20 text-xl">404 - Page Not Found</div>} />
        </Routes>
      </main>

      <Footer t={t} />
    </div>
  )
}

export default App