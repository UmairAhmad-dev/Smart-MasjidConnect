// src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { Trash2, PlusCircle, Save, CalendarDays, Megaphone, Search, X } from 'lucide-react'; 

const API_BASE_URL = 'http://localhost:5000/api'; 

const getTodayDateEn = () => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('en-GB', options);
};
const getTodayDateUr = () => {
    return new Date().toLocaleDateString('ur-PK', { day: 'numeric', month: 'long' });
};

export default function AdminPanel() {
  // === 1. STATE MANAGEMENT ===
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NEW: Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [newAnnounce, setNewAnnounce] = useState({ title: '', content: '', priority: 'medium' });
  const [prayerForm, setPrayerForm] = useState({
    nextPrayerTime: '',
    fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', jumah: ''
  });

  // === 2. DATA FETCHING ===
  useEffect(() => {
    fetchData();
  }, []);

  // UPDATED: Now accepts an optional keyword for searching
  const fetchData = async (keyword = '') => {
    setLoading(true);
    setError(null);
    try {
      // If a keyword is provided, we add it to the URL as a query parameter
      const url = keyword 
        ? `${API_BASE_URL}/announcements?keyword=${keyword}` 
        : `${API_BASE_URL}/announcements`;

      const annRes = await fetch(url);
      if (!annRes.ok) throw new Error('Failed to fetch announcements.');
      const annData = await annRes.json();
      if (annData.success) {
        setAnnouncements(annData.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }

      // Fetch Current Prayers (only on initial load, not search)
      if (!keyword) {
          const prayRes = await fetch(`${API_BASE_URL}/prayertimes/current`);
          if (prayRes.ok) {
              const prayData = await prayRes.json();
              if (prayData.success && prayData.data) {
                setPrayerForm({
                  nextPrayerTime: prayData.data.nextPrayerTime,
                  fajr: prayData.data.times.find(t => t.name === 'Fajr')?.time || '',
                  dhuhr: prayData.data.times.find(t => t.name === 'Dhuhr')?.time || '',
                  asr: prayData.data.times.find(t => t.name === 'Asr')?.time || '',
                  maghrib: prayData.data.times.find(t => t.name === 'Maghrib')?.time || '',
                  isha: prayData.data.times.find(t => t.name === 'Isha')?.time || '',
                  jumah: prayData.data.times.find(t => t.name === 'Jumah')?.time || '',
                });
              }
          }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Search Handlers
  const handleSearchSubmit = (e) => {
      e.preventDefault();
      setIsSearching(true);
      fetchData(searchTerm);
  };

  const clearSearch = () => {
      setSearchTerm('');
      setIsSearching(false);
      fetchData();
  };

  // === 3. HANDLERS: ANNOUNCEMENTS ===
  const handleAnnounceInput = (e) => {
    setNewAnnounce({ ...newAnnounce, [e.target.name]: e.target.value });
  };

  const submitAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAnnounce, author: "Admin" }) 
      });
      const data = await res.json();
      if (data.success) {
        setAnnouncements([data.data, ...announcements]); 
        setNewAnnounce({ title: '', content: '', priority: 'medium' }); 
        alert("Announcement Added Successfully!");
      } else { alert("Error: " + data.message); }
    } catch (err) { alert("Fetch Error: " + err.message); }
  };

  const deleteAnnouncement = async (id) => {
    if(!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/announcements/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAnnouncements(announcements.filter(ann => ann._id !== id)); 
        alert("Announcement Deleted.");
      } else { alert("Error: " + data.message); }
    } catch (err) { alert("Fetch Error: " + err.message); }
  };

  const handlePrayerInput = (e) => {
    setPrayerForm({ ...prayerForm, [e.target.name]: e.target.value });
  };

  const submitPrayerUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      dateEn: getTodayDateEn(),
      dateUr: getTodayDateUr(),
      nextPrayerTime: prayerForm.nextPrayerTime,
      times: [
        { name: 'Fajr', time: prayerForm.fajr, urName: 'فجر' },
        { name: 'Dhuhr', time: prayerForm.dhuhr, urName: 'ظہر' },
        { name: 'Asr', time: prayerForm.asr, urName: 'عصر' },
        { name: 'Maghrib', time: prayerForm.maghrib, urName: 'مغرب' },
        { name: 'Isha', time: prayerForm.isha, urName: 'عشاء' },
        { name: 'Jumah', time: prayerForm.jumah, urName: 'جمعہ' },
      ]
    };
    try {
      const res = await fetch(`${API_BASE_URL}/prayertimes`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) alert("Prayer Times Updated!");
      else alert("Error: " + data.message);
    } catch (err) { alert("Fetch Error: " + err.message); }
  };

  // === 5. UI LAYOUT ===
  if (loading && !isSearching) return <div className="p-10 text-center animate-pulse text-xl text-slate-500">Connecting to Database...</div>;
  if (error) return <div className="p-10 text-center text-xl text-red-500">Database Error: {error}</div>;

  const inputClass = "w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-masjid-gold focus:border-masjid-gold outline-none transition";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const cardClass = "bg-white p-8 rounded-2xl shadow-lg border border-slate-100";
  const btnPrimary = "flex items-center gap-2 px-6 py-3 bg-masjid-gold text-white font-bold rounded-lg hover:bg-masjid-gold/90 transition duration-150 active:scale-95";

  return (
    <div className="container mx-auto px-6 py-12 space-y-12 bg-slate-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-masjid-dark mb-10 pb-4 border-b-4 border-masjid-gold inline-block">Masjid Admin Panel (Database Lab)</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* SECTION 1: UPDATE PRAYER TIMES */}
        <div className={`xl:col-span-2 ${cardClass} space-y-8`}>
            <div className="flex items-center gap-4">
                <CalendarDays className="w-10 h-10 text-masjid-accent" />
                <h2 className="text-2xl font-bold text-masjid-dark">Update Prayer Times</h2>
            </div>
            <form onSubmit={submitPrayerUpdate} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className={labelClass}>Next Prayer (Must match a time below)</label>
                        <input type="text" name="nextPrayerTime" value={prayerForm.nextPrayerTime} onChange={handlePrayerInput} className={inputClass} placeholder="e.g., 1:30 PM" required />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 pt-4 border-t border-slate-100">
                    {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumah'].map(prayer => (
                        <div key={prayer}>
                            <label className={`${labelClass} capitalize`}>{prayer}</label>
                            <input type="text" name={prayer} value={prayerForm[prayer]} onChange={handlePrayerInput} className={`${inputClass} font-mono text-center`} required />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" className={btnPrimary}><Save size={20}/> Update Database</button>
                </div>
            </form>
        </div>

        {/* SECTION 2: ADD ANNOUNCEMENT */}
        <div className={`${cardClass} space-y-6`}>
            <div className="flex items-center gap-3">
                <PlusCircle className="w-9 h-9 text-masjid-accent" />
                <h2 className="text-2xl font-bold text-masjid-dark">New Announcement</h2>
            </div>
            <form onSubmit={submitAnnouncement} className="space-y-5">
                <input type="text" name="title" value={newAnnounce.title} onChange={handleAnnounceInput} className={inputClass} placeholder="Title" required />
                <textarea name="content" value={newAnnounce.content} onChange={handleAnnounceInput} className={`${inputClass} h-32 resize-none`} placeholder="Content" required></textarea>
                <select name="priority" value={newAnnounce.priority} onChange={handleAnnounceInput} className={inputClass}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
                <button type="submit" className={`${btnPrimary} w-full justify-center`}><Megaphone size={20}/> Post to DB</button>
            </form>
        </div>
      </div>

      {/* SECTION 3: SEARCH & LIST ANNOUNCEMENTS */}
      <div className={`${cardClass} space-y-8`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-masjid-dark">Database Records ({announcements.length})</h2>
            
            {/* NEW: SEARCH BAR UI */}
            <form onSubmit={handleSearchSubmit} className="flex w-full md:w-auto gap-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Search by title or content..." 
                        className={`${inputClass} pl-10 pr-10 text-sm`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-700 transition">Search</button>
            </form>
        </div>
        
        <div className="space-y-5 max-h-[500px] overflow-y-auto pr-3">
            {loading && isSearching ? <p className="text-center py-10">Searching Database...</p> : 
            announcements.map(ann => (
                <div key={ann._id} className="flex items-center justify-between gap-6 p-5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition">
                    <div className="flex-1 space-y-1">
                        <div className='flex items-center gap-3'>
                             <span className={`text-xs font-bold px-2 py-0.5 rounded ${ann.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>
                                 {(ann.priority || 'medium').toUpperCase()}
                             </span>
                             <h4 className="text-lg font-semibold text-masjid-dark">{ann.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{ann.content}</p>
                    </div>
                    <button onClick={() => deleteAnnouncement(ann._id)} className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition">
                        <Trash2 size={20} />
                    </button>
                </div>
            ))}
            {announcements.length === 0 && (
                <div className='text-center py-10 text-slate-500'>
                    {isSearching ? "No matching records found." : "No announcements found in database."}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}