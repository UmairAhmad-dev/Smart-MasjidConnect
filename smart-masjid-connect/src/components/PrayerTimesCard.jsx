// src/components/PrayerTimesCard.jsx
import { useState, useEffect, useCallback } from 'react'; // 1. Added 'useCallback'
import ClockIcon from './ui/ClockIcon';

// NEW: Import the finalized robust utility functions
import { calculateTimeRemaining, getNextPrayer } from '../utils/prayerTimerUtils';

export default function PrayerTimesCard({ t }) {
  // === STATE VARIABLES ===
  const [prayersData, setPrayersData] = useState(null); 
  const [loading, setLoading] = useState(true);        
  const [error, setError] = useState(null);            
  
  // New: States to hold the calculated dynamic data
  const [nextPrayerInfo, setNextPrayerInfo] = useState(null); // Now holds { prayer, isTomorrow }
  const [countdown, setCountdown] = useState("");      
  const [currentDate, setCurrentDate] = useState("");

  // === 2. (NEW) Helper function to get localized date automatically ===
  // This uses the computer's clock and the t.lang setting.
  const getAutoLocalDate = useCallback((dateObj) => {
    // Assuming t.lang is provided by your localization system (e.g., 'en' or 'ur')
    const locale = t.lang === 'ur' ? 'ur-PK' : 'en-GB';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString(locale, options);
  }, [t.lang]);

  // === FETCH DATA FROM API ON MOUNT ===
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/prayertimes/current');
        if (!response.ok) throw new Error('Could not fetch prayer times.');
        const result = await response.json();
        if (result.success && result.data) {
          setPrayersData(result.data); 
        } else {
          throw new Error('Invalid data structure.');
        }
        setLoading(false); 
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message); 
        setLoading(false); 
      }
    };
    fetchPrayerTimes();
  }, []); 

  // === DYNAMIC COUNTDOWN LOGIC (RUNS EVERY SECOND) ===
  useEffect(() => {
    // Only run if we have successfully fetched the data array
    if (!prayersData || !prayersData.times) return;

    // 1. Initial Calculation immediately on data load
    const now = new Date();
    const initialNext = getNextPrayer(now, prayersData.times);
    setNextPrayerInfo(initialNext);
    setCountdown(calculateTimeRemaining(initialNext?.time));
    
    // (UPDATED): Using helper function for localized auto-date
    setCurrentDate(getAutoLocalDate(now));

    // 2. Set up the interval timer
    const intervalId = setInterval(() => {
      const currentTime = new Date();
      // Calculate the next prayer and countdown dynamically every second
      const dynamicNext = getNextPrayer(currentTime, prayersData.times);
      
      setNextPrayerInfo(dynamicNext);
      setCountdown(calculateTimeRemaining(dynamicNext?.time));

      // (UPDATED): Using helper function for localized auto-date
      setCurrentDate(getAutoLocalDate(currentTime));

    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [prayersData, getAutoLocalDate]); // (UPDATED): Added getAutoLocalDate to dependencies

  // === CONDITIONAL RENDERING (LOADING/ERROR/NO DATA) ===
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center h-64">
        <div className="text-xl font-semibold text-slate-500 animate-pulse">Loading prayer times...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-200 flex items-center justify-center h-64">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!prayersData) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-200 flex items-center justify-center h-64">
        <div className="text-xl font-semibold text-amber-700">No prayer times found. Please add data via Postman.</div>
      </div>
    );
  }

  // === MAIN RENDER ===
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] rounded-2xl"></div>

      {/* Header section with Clock Icon, Title, Date, and Next Prayer */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-200 z-10 relative">
        <div className="flex items-center gap-4">
          <ClockIcon className="w-14 h-14" />
          <div>
            <h3 className="text-3xl font-extrabold text-masjid-dark tracking-tight">{t.navPrayers}</h3>
            {/* Real Date from Local Machine (Now supports localization) */}
            <p className="text-lg text-slate-600 font-medium">{currentDate}</p>
          </div>
        </div>
        
        {/* Next Prayer Visualization (Now Dynamic!) */}
        <div className="text-right">
          <span className="text-sm font-semibold text-slate-500">
            {/* 3. Visually indicate if it's tomorrow's prayer */}
            {t.nextPrayer} {nextPrayerInfo?.isTomorrow ? `(${t.tomorrow || 'Tomorrow'})` : ''}
          </span>
          {/* Real Next Prayer Time from DB */}
          <p className="text-3xl font-black text-masjid-gold font-mono tracking-tighter">
            {nextPrayerInfo?.time || '--:-- --'}
          </p>
          {/* 4. The dynamic ticking H : M : S */}
          <p className="text-lg font-bold text-masjid-gold/90 font-mono tracking-tight mt-1">
            {countdown}
          </p>
        </div>
      </div>

      {/* Grid Layout visualizing the 'times' array from the DB */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 z-10 relative">
        {prayersData.times.map(prayer => (
          <div key={prayer.name} className={`flex items-center justify-between p-6 rounded-xl border-2 transition-transform hover:scale-105 ${prayer.name === "Jumah" ? 'bg-masjid-accent border-masjid-accent/50' : 'bg-slate-50 border-slate-100'}`}>
            
            {/* Prayer Names (Bilingual) */}
            <div>
              <p className={`text-2xl font-extrabold leading-tight tracking-tight ${prayer.name === "Jumah" ? 'text-white' : 'text-masjid-dark'}`}>{prayer.name}</p>
              <p className={`text-sm font-serif mt-0.5 ${prayer.name === "Jumah" ? 'text-amber-50' : 'text-masjid-gold'}`} dir="rtl">{prayer.urName}</p>
            </div>
            
            {/* Prayer Time from DB */}
            <p className={`text-2xl font-bold font-mono tracking-tight ${prayer.name === "Jumah" ? 'text-white' : 'text-masjid-dark'}`}>{prayer.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}