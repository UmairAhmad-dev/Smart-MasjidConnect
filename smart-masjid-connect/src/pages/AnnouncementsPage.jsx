// src/pages/AnnouncementsPage.jsx
import { useState, useEffect } from 'react'; 
import { Search, X } from 'lucide-react'; // Make sure lucide-react is installed

const formatFullDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export default function AnnouncementsPage({ t }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search States
  const [searchTerm, setSearchTerm] = useState('');

  // Modified fetch to handle keywords
  const fetchAnnouncements = async (keyword = '') => {
    try {
      setLoading(true);
      const url = keyword 
        ? `http://localhost:5000/api/announcements?keyword=${encodeURIComponent(keyword)}` 
        : 'http://localhost:5000/api/announcements';

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const sorted = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAnnouncements(sorted);
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

  useEffect(() => {
    fetchAnnouncements();
  }, []); 

  // Handler for search form
  const handleSearch = (e) => {
    e.preventDefault();
    fetchAnnouncements(searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm('');
    fetchAnnouncements('');
  };

  if (loading && announcements.length === 0) {
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

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      
      {/* Header Section with Short Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h1 className="text-4xl font-extrabold text-masjid-dark">{t.navAnnouncements}</h1>
        
        {/* Short Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search news..." 
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-masjid-gold transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          {searchTerm && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-masjid-gold"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
      
      {announcements.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-lg border-2 border-dashed border-slate-200 rounded-2xl">
              No announcements found{searchTerm ? ` for "${searchTerm}"` : ""}.
          </div>
      ) : (
          <div className="space-y-8">
            {announcements.map(announcement => {
              const isUrgent = announcement.priority === 'high';

              return (
                <div key={announcement._id} className={`bg-white p-8 rounded-2xl shadow border ${isUrgent ? 'border-masjid-gold/40' : 'border-slate-100'} transition-transform hover:scale-[1.01] hover:shadow-lg`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-white text-2xl ${isUrgent ? 'bg-masjid-gold' : 'bg-slate-100 text-masjid-gold'}`}>📢</div>
                          <h2 className="text-2xl font-bold text-masjid-dark leading-tight">{announcement.title}</h2>
                      </div>
                  
                    <span className="shrink-0 text-sm font-mono text-masjid-dark bg-slate-100 px-3 py-1.5 rounded-full">
                      {formatFullDate(announcement.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-slate-700 text-lg leading-relaxed max-w-4xl">{announcement.content}</p>
                  
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