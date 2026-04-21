// src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { Trash2, PlusCircle, Save, CalendarDays, Megaphone } from 'lucide-react'; // Requires: npm install lucide-react

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust port if needed

// --- NATIVE DATE HELPERS FOR BACKEND STORAGE (Behind the scenes) ---
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

  // Form State (New Announcement)
  const [newAnnounce, setNewAnnounce] = useState({ title: '', content: '', priority: 'medium' });

  // Form State (Update Prayers)
  // (UPDATED): Date fields REMOVED from state. We generate them on submit.
  const [prayerForm, setPrayerForm] = useState({
    nextPrayerTime: '',
    fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', jumah: ''
  });


  // === 2. INITIAL DATA FETCHING ===
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch Announcements
      const annRes = await fetch(`${API_BASE_URL}/announcements`);
      if (!annRes.ok) throw new Error('Failed to fetch announcements.');
      const annData = await annRes.json();
      if (annData.success) {
        setAnnouncements(annData.data.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }

      // Fetch Current Prayers
      const prayRes = await fetch(`${API_BASE_URL}/prayertimes/current`);
      if (!prayRes.ok && prayRes.status !== 404) throw new Error('Failed to fetch prayer times.');
          
      if (prayRes.ok) {
          const prayData = await prayRes.json();
          if (prayData.success && prayData.data) {
            // (UPDATED): Only populating times from DB. Dates are ignored here.
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

    } catch (err) {
      console.error("Initialization Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // === 3. HANDLERS: ANNOUNCEMENTS (Unchanged) ===
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
        alert("Announcement Deleted Successfully.");
      } else { alert("Error: " + data.message); }
    } catch (err) { alert("Fetch Error: " + err.message); }
  };


  // === 4. HANDLERS: PRAYER TIMES (Updated to handle dateEn/dateUr automatically) ===
  const handlePrayerInput = (e) => {
    setPrayerForm({ ...prayerForm, [e.target.name]: e.target.value });
  };

  const submitPrayerUpdate = async (e) => {
    e.preventDefault();
    // (UPDATED): Dates are generated automatically right here before sending to DB.
    // This keeps your database schema happy without the admin having to type it.
    const payload = {
      dateEn: getTodayDateEn(), // Automatically generated
      dateUr: getTodayDateUr(), // Automatically generated
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
      if (data.success) {
        alert("Prayer Times Updated in Database! Today's Date added automatically.");
      } else { alert("Error: " + data.message); }
    } catch (err) { alert("Fetch Error: " + err.message); }
  };


  // === 5. UI LAYOUT & STYLING ===
  if (loading) return <div className="p-10 text-center animate-pulse text-xl text-slate-500">Loading Admin Panel...</div>;
  if (error) return <div className="p-10 text-center text-xl text-red-500">Error loading Admin Panel: {error}</div>;

  const inputClass = "w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-masjid-gold focus:border-masjid-gold outline-none transition";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5";
  const cardClass = "bg-white p-8 rounded-2xl shadow-lg border border-slate-100";
  const btnPrimary = "flex items-center gap-2 px-6 py-3 bg-masjid-gold text-white font-bold rounded-lg hover:bg-masjid-gold/90 transition duration-150 active:scale-95";

  return (
    <div className="container mx-auto px-6 py-12 space-y-12 bg-slate-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-masjid-dark mb-10 pb-4 border-b-4 border-masjid-gold inline-block">Masjid Admin Panel (Database Lab Demo)</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* === SECTION 1: UPDATE PRAYER TIMES FORM === */}
        <div className={`xl:col-span-2 ${cardClass} space-y-8`}>
            <div className="flex items-center gap-4">
                <CalendarDays className="w-10 h-10 text-masjid-accent" />
                <h2 className="text-2xl font-bold text-masjid-dark">Update Prayer Times</h2>
            </div>
            
            <form onSubmit={submitPrayerUpdate} className="space-y-6">
                {/* (UPDATED): Removed the row with Date En and Date Ur inputs. */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className={labelClass}>Next Prayer (Must match a time below, e.g., 1:30 PM)</label>
                        <input type="text" name="nextPrayerTime" value={prayerForm.nextPrayerTime} onChange={handlePrayerInput} className={inputClass} placeholder="e.g., 1:30 PM" required />
                        <p className="text-xs text-slate-400 mt-1">Note: Today's Date will be automatically added when you submit.</p>
                    </div>
                </div>

                {/* Individual Prayer Times Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 pt-4 border-t border-slate-100">
                    {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumah'].map(prayer => (
                        <div key={prayer}>
                            <label className={`${labelClass} capitalize`}>{prayer}</label>
                            <input type="text" name={prayer} value={prayerForm[prayer]} onChange={handlePrayerInput} className={`${inputClass} font-mono text-center`} placeholder="00:00 AM" required />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" className={btnPrimary}><Save size={20}/> Update Database</button>
                </div>
            </form>
        </div>

        {/* === SECTION 2: ADD NEW ANNOUNCEMENT FORM === */}
        <div className={`${cardClass} space-y-6`}>
            <div className="flex items-center gap-3">
                <PlusCircle className="w-9 h-9 text-masjid-accent" />
                <h2 className="text-2xl font-bold text-masjid-dark">Add New Announcement</h2>
            </div>
            <form onSubmit={submitAnnouncement} className="space-y-5">
                <div>
                    <label className={labelClass}>Announcement Title</label>
                    <input type="text" name="title" value={newAnnounce.title} onChange={handleAnnounceInput} className={inputClass} placeholder="E.g., Eid Ul Adha Qurbani" required />
                </div>
                <div>
                    <label className={labelClass}>Content</label>
                    <textarea name="content" value={newAnnounce.content} onChange={handleAnnounceInput} className={`${inputClass} h-32 resize-none`} placeholder="Detailed message..." required></textarea>
                </div>
                <div>
                    <label className={labelClass}>Priority</label>
                    <select name="priority" value={newAnnounce.priority} onChange={handleAnnounceInput} className={inputClass}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High (Urgent)</option>
                    </select>
                </div>
                <button type="submit" className={`${btnPrimary} w-full justify-center`}><Megaphone size={20}/> Post to Database</button>
            </form>
        </div>
      </div>

      {/* === SECTION 3: VIEW & DELETE ANNOUNCEMENTS LIST === */}
      <div className={`${cardClass} space-y-8`}>
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-masjid-dark">Current Announcements in Database ({announcements.length})</h2>
            <button onClick={fetchData} className="text-sm text-masjid-gold hover:underline">Refresh List</button>
        </div>
        
        <div className="space-y-5 max-h-[500px] overflow-y-auto pr-3">
            {announcements.map(ann => (
                <div key={ann._id} className="flex items-center justify-between gap-6 p-5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition">
                    <div className="flex-1 space-y-1">
                        <div className='flex items-center gap-3'>
                             <span className={`text-xs font-bold px-2 py-0.5 rounded ${ann.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>
                                 {(ann.priority || 'medium').toUpperCase()}
                             </span>
                             <h4 className="text-lg font-semibold text-masjid-dark">{ann.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{ann.content}</p>
                        <p className="text-xs text-slate-400 font-mono">ID: {ann._id} | Created: {new Date(ann.createdAt).toLocaleString()}</p>
                    </div>
                    <button 
                        onClick={() => deleteAnnouncement(ann._id)}
                        className="p-3 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition active:scale-95"
                        title="Delete Announcement"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            ))}
            {announcements.length === 0 && <div className='text-center py-10 text-slate-500'>No announcements found in database. Use the form above to add one.</div>}
        </div>
      </div>

    </div>
  );
}