// src/components/HadithCard.jsx
import { useState, useEffect } from 'react'; // 1. Import necessary hooks

export default function HadithCard({ t }) {
  // 2. State for data, loading, and error
  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Fetch logic inside useEffect
  useEffect(() => {
    const fetchDailyHadith = async () => {
      try {
        // Call the 'GET today' endpoint we created
        const response = await fetch('http://localhost:5000/api/hadith/today');

        if (!response.ok) {
          // If the database is empty, the backend returns 404.
          if (response.status === 404) {
             setHadith(null); 
             return;
          }
          throw new Error('Failed to fetch Hadith of the Day');
        }

        const result = await response.json();

        if (result.success && result.data) {
          setHadith(result.data);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyHadith();
  }, []); // Run once on component load

  // 4. Handle Loading/Error/Empty states in UI (stylized to match container)
  if (loading) {
    return (
        <div className="bg-slate-100 p-8 rounded-2xl shadow-inner border border-slate-200 flex items-center justify-center h-48">
            <div className="text-xl font-semibold text-slate-500 animate-pulse">Loading Hadith...</div>
        </div>
    );
  }

  // We only show the section if a Hadith was found.
  if (!hadith && !error) {
    return (
        <div className="bg-slate-100 p-8 rounded-2xl shadow-inner border border-slate-200 text-center text-slate-500">
            {t.noHadithAvailable || "Hadith of the Day will appear here once added to the database."}
        </div>
    );
  }

  // 5. Render the data
  return (
    // Stylized background resembling image_3.png texture quality (from original code)
    <div className="bg-slate-100 p-8 rounded-2xl shadow-inner border border-slate-200 space-y-5">
      <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-masjid-accent flex items-center justify-center font-bold text-white text-xl">📜</div>
          {/* We keep the localized TITLE (e.g., "Hadith of the Day") */}
          <h3 className="text-2xl font-bold text-masjid-dark">{t.hadithTitle}</h3>
      </div>

      {/* Dynamic Arabic Text (Optional, from Database) */}
      {hadith.arabicText && (
          <p className="text-right text-2xl font-serif text-slate-800 leading-loose bg-white p-5 rounded-xl border border-slate-100" dir="rtl">
              {hadith.arabicText}
          </p>
      )}

      {/* Dynamic Translation (from Database) */}
      <blockquote className="text-lg text-slate-700 italic border-l-4 border-masjid-gold pl-6 py-1 leading-relaxed">
        “{hadith.text}”
      </blockquote>

      {/* Dynamic Source and Reference (from Database) */}
      <p className="text-right text-sm font-semibold text-slate-500 mt-6 pt-3 border-t border-slate-200">
          - {hadith.source} {hadith.reference && `(${hadith.reference})`}
      </p>
    </div>
  );
}