// src/components/HeroSection.jsx
import masjidHeroImage from '../assets/hero-mosque.jpg'; // Import your image asset

export default function HeroSection({ t }) {
  return (
    // Unique high-fidelity hero section adapting image_0.png
    <section className="relative w-full aspect-[21/10] rounded-3xl overflow-hidden shadow-2xl bg-masjid-dark">
      {/* 1. Integrated Background Image (manually added to src/assets/) */}
      <img 
        src={masjidHeroImage} 
        alt="Main Masjid View" 
        className="absolute inset-0 w-full h-full object-cover object-center scale-105" // slight scale for movement
      />
      
      {/* 2. Styling Overlay (to make text pop) */}
      <div className="absolute inset-0 bg-gradient-to-t from-masjid-dark via-masjid-dark/70 to-masjid-dark/40 opacity-90"></div>
      
      {/* 3. Unique Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 space-y-4">
        {/* Large inspiring typography */}
        <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
          {t.heroWelcome}
        </h1>
        {/* Localization subtitle, always shown for uniqueness */}
        <p className="text-xl md:text-2xl text-masjid-accent/90 max-w-2xl font-serif mt-2" dir="rtl">
          {t.heroTitle} {/* Reuse 'heroTitle' if present in App.jsx */}
        </p>
        
        {/* Unique decorative element (referencing image_3.png texture quality) */}
        <div className="h-0.5 w-1/3 bg-masjid-gold/60 mt-4 rounded-full"></div>
      </div>
    </section>
  );
}