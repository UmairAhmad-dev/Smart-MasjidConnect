// src/pages/HomePage.jsx
// We use your exact original import paths!
import HeroSection from '../components/HeroSection';
import PrayerTimesCard from '../components/PrayerTimesCard';
import HadithCard from '../components/HadithCard';
// We DO NOT import extra full-width dynamic lists or banners, as they are separate pages!
// import AnnouncementsPreview from '../components/AnnouncementsPreview';
// import DonateCTA from '../components/DonateCTA';

export default function HomePage({ t }) {
  return (
    <div className="space-y-16">
      {/* 1. Impactful, Minimalist Hero Section (integrating Mosque Image + Title) */}
      {/* Unique visualization of image_32.png adaptation quality visualized in Turnpike adaptation quality */}
      <HeroSection t={t} />

      {/* Grid Layout for PURELY essential features (Prayers, Hadith) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* 2. Prayer Times Card (2/3 width on large screens) */}
        {/* The data and layout within this component are simplified and professionalized to match the high-fidelity table in image_30.png */}
        <div className="lg:col-span-2">
          <PrayerTimesCard t={t} />
        </div>
        
        {/* 3. Daily Hadith (1/3 width, adapted to reference the stone design and high-fidelity texture and is simplified to fit the clean grid) */}
        <div>
          <HadithCard t={t} />
        </div>
      </div>
    </div>
  );
}