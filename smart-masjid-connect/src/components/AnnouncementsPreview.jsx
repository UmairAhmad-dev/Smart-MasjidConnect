// src/components/AnnouncementsPreview.jsx
import { useState, useEffect } from 'react'; // 1. Import necessary hooks

// Helper function to format MongoDB date (e.g., 2026-04-17T...) into "17 Apr"
const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'short' };
  // Requires standard JavaScript Date object.
  // Assumes backend sends valid date string (like Mongoose 'createdAt' field)
  return new Date(dateString).toLocaleDateString('en-GB', options); 
};

export default function AnnouncementsPreview({ t }) {
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
          // Sort announcements: Newest first (optional but recommended)
          const sorted = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setAnnouncements(sorted.slice(0, 3)); // Limit to first 3 for the preview
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
      <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex items-center justify-center h-48">
        <div className="text-xl font-semibold text-slate-500 animate-pulse">Loading Announcements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow border border-red-200 flex items-center justify-center h-48">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  // 5. Update the mapping in JSX
  // We map over 'announcements' (state) instead of 'mockAnnouncements' (hardcoded)
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-bold text-masjid-dark">{t.navAnnouncements}</h3>
        <button className="text-masjid-gold font-semibold hover:underline">View All</button>
      </div>
      
      {announcements.length === 0 ? (
          <div className="text-center py-10 text-slate-500">No announcements available at this time.</div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {announcements.map(announcement => (
              <div key={announcement._id} className="bg-white p-6 rounded-xl shadow border border-slate-100 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-xl font-bold text-masjid-dark leading-tight">{announcement.title}</h4>
                  {/* 6. Use the formatDate helper and the real database field (createdAt) */}
                  <span className="shrink-0 text-sm font-mono text-masjid-gold bg-amber-50 px-2.5 py-1 rounded-md">
                    {formatDate(announcement.createdAt)}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{announcement.content}</p>
                <button className="text-masjid-accent text-sm font-medium mt-2 self-start hover:underline">Read More</button>
              </div>
            ))}
          </div>
      )}
    </section>
  );
}