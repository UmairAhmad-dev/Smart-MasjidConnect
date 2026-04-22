// src/pages/HomePage.jsx
import HeroSection from '../components/HeroSection';
import PrayerTimesCard from '../components/PrayerTimesCard';
import HadithCard from '../components/HadithCard';


export default function HomePage({ t }) {
  return (
    <div className="space-y-16">

      <HeroSection t={t} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

        <div className="lg:col-span-2">
          <PrayerTimesCard t={t} />
        </div>
        
       <div>
          <HadithCard t={t} />
        </div>
      </div>
    </div>
  );
}