// src/pages/AnnouncementsPage.jsx
import { useState, useEffect } from 'react'; // 1. Import necessary hooks

// Helper function to format MongoDB date (e.g., 2026-04-17T...) into "17 Apr 2026"
const formatFullDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  // Requires standard JavaScript Date object.
  // Assumes backend sends valid date string (like Mongoose 'createdAt' field)
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export default function AnnouncementsPage({ t }) {
  // 2. State for data, loading, and error
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Fetch logic inside useEffect
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // Adjust URL if your backend port is different
        const response = await fetch('http://localhost:5000/api/announcements');

        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }

        const result = await response.json();

        // Assuming backend response format is { success: true, data: [...] }
        if (result.success && Array.isArray(result.data)) {
          // Sort announcements: Newest first (based on createdAt)
          const sorted = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAnnouncements(sorted);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading regardless of success/failure
      }
    };

    fetchAnnouncements();
  }, []); // Empty dependency array means this runs once on component load

  // 4. Handle Loading/Error/Empty states in UI
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center h-96">
        <div className="text-xl font-semibold text-slate-500 animate-pulse">Loading All Announcements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-12 flex items-center justify-center h-96">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  // 5. Update the mapping in JSX
  // We map over 'announcements' (state) instead of 'mockAnnouncementsList' (hardcoded)
  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      {/* Replicating design board text quality */}
      <h1 className="text-4xl font-extrabold text-masjid-dark mb-10">{t.navAnnouncements}</h1>
      
      {announcements.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-lg border-2 border-dashed border-slate-200 rounded-2xl">
              No announcements available at this time.
          </div>
      ) : (
          <div className="space-y-8">
            {announcements.map(announcement => {
              // Assume Mongoose uses 'priority' field. We'll treat 'high' as urgent.
              const isUrgent = announcement.priority === 'high';

              return (
                <div key={announcement._id} className={`bg-white p-8 rounded-2xl shadow border ${isUrgent ? 'border-masjid-gold/40' : 'border-slate-100'} transition-transform hover:scale-[1.01] hover:shadow-lg`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-4">
                          {/* Placeholder icon adapted from design cards */}
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-white text-2xl ${isUrgent ? 'bg-masjid-gold' : 'bg-slate-100 text-masjid-gold'}`}>📢</div>
                          <h2 className="text-2xl font-bold text-masjid-dark leading-tight">{announcement.title}</h2>
                      </div>
                    {/* 6. Use the formatFullDate helper and the real database field (createdAt) */}
                    <span className="shrink-0 text-sm font-mono text-masjid-dark bg-slate-100 px-3 py-1.5 rounded-full">
                      {formatFullDate(announcement.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-slate-700 text-lg leading-relaxed max-w-4xl">{announcement.content}</p>
                  
                  {/* Midterm advanced feature placeholder for Urgent logic */}
                  {isUrgent && (
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-masjid-gold bg-amber-50 px-4 py-2 rounded-md">
                          <span className="h-2 w-2 rounded-full bg-masjid-gold animate-pulse"></span>
                          Urgent Announcement
                      </div>
                  )}
                </div>
              );
            })}
          </div>
      )}
    </div>
  );
}