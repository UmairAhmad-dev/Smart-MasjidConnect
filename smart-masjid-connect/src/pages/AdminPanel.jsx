import { useState, useEffect } from 'react';
import { 
  Trash2, PlusCircle, CalendarDays, Megaphone, 
  Search, X, LayoutDashboard, Users, BookOpen, Clock, Activity, ShieldCheck 
} from 'lucide-react'; 

const API_BASE_URL = 'http://localhost:5000/api'; 

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // --- Data States ---
  const [announcements, setAnnouncements] = useState([]);
  const [members, setMembers] = useState([]);
  const [hadith, setHadith] = useState({ text: '', source: '' });
  const [prayerForm, setPrayerForm] = useState({
    nextPrayerTime: '', fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '', jumah: ''
  });

  // --- Search State ---
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchAllData(); }, []);

  // --- 1. THE DATA ENGINE ---
  const fetchAllData = async (keyword = '') => {
    try {
      const annRes = await fetch(`${API_BASE_URL}/announcements${keyword ? `?keyword=${keyword}` : ''}`);
      const memRes = await fetch(`${API_BASE_URL}/members`);
      const hadRes = await fetch(`${API_BASE_URL}/hadith/today`);
      const prayRes = await fetch(`${API_BASE_URL}/prayertimes/current`);

      const ann = await annRes.json();
      const mem = await memRes.json();
      const had = await hadRes.json();
      const pray = await prayRes.json();

      if (ann.success) setAnnouncements(ann.data);
      if (mem.success) setMembers(mem.data);
      
      // Safety for Hadith
      if (had.success && had.data) setHadith(had.data);
      
      // Safety for Prayer Times
      if (pray.success && pray.data) {
        const t = pray.data.times;
        setPrayerForm({
          nextPrayerTime: pray.data.nextPrayerTime || '',
          fajr: t?.find(x => x.name === 'Fajr')?.time || '',
          dhuhr: t?.find(x => x.name === 'Dhuhr')?.time || '',
          asr: t?.find(x => x.name === 'Asr')?.time || '',
          maghrib: t?.find(x => x.name === 'Maghrib')?.time || '',
          isha: t?.find(x => x.name === 'Isha')?.time || '',
          jumah: t?.find(x => x.name === 'Jumah')?.time || '',
        });
      }
      setLoading(false);
    } catch (err) { console.log("Database Fetch Error"); setLoading(false); }
  };

  // --- 2. THE ACTION ENGINE ---
  const submitData = async (path, data, clearFields = []) => {
    try {
      const res = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        alert("Success: Database Updated!");
        clearFields.forEach(id => { document.getElementById(id).value = ''; });
        fetchAllData();
      } else {
        alert("DB Error: " + result.message);
      }
    } catch (err) { alert("Check Server Connection"); }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing MongoDB...</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FBFBFC] text-slate-900 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 p-8 flex flex-col sticky top-0 h-screen hidden xl:flex">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-slate-900 rounded-xl text-white shadow-lg"><ShieldCheck size={24}/></div>
          <h2 className="text-xl font-black tracking-tighter text-slate-800 uppercase">Masjid<span className="text-slate-400">OS</span></h2>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            {id: 'dashboard', label: 'Overview', icon: LayoutDashboard},
            {id: 'announcements', label: 'Announcements', icon: Megaphone},
            {id: 'prayers', label: 'Prayer Schedule', icon: Clock},
            {id: 'members', label: 'Management', icon: Users},
            {id: 'hadith', label: 'Daily Hadith', icon: BookOpen},
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <tab.icon size={20} /> <span className="text-sm tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 bg-slate-50 rounded-3xl border border-slate-100">
           <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span> MongoDB Online
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-12 max-w-7xl mx-auto w-full">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <h1 className="text-4xl font-black tracking-tight text-slate-800">Management Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm">
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Total Database Rows</p>
                <h3 className="text-5xl font-black">{announcements.length + members.length}</h3>
              </div>
              <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm">
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-2">Active Updates</p>
                <h3 className="text-5xl font-black">{announcements.length}</h3>
              </div>
              <div className="bg-slate-900 p-8 rounded-[35px] text-white flex flex-col justify-between shadow-2xl shadow-slate-200">
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Connection Health</p>
                <div className="flex items-end justify-between">
                   <h3 className="text-3xl font-black">100%</h3>
                   <Activity className="text-emerald-400 animate-pulse" size={32}/>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <h2 className="text-3xl font-black">Announcements</h2>
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search database..." 
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-slate-900 transition-all text-sm"
                  onChange={(e) => { setSearchTerm(e.target.value); fetchAllData(e.target.value); }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6 h-fit">
                <input id="annTitle" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-900" placeholder="Post Title" />
                <textarea id="annContent" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-slate-900 h-40 resize-none" placeholder="Message Details" />
                <button 
                  onClick={() => submitData('/announcements', { 
                    title: document.getElementById('annTitle').value, 
                    content: document.getElementById('annContent').value,
                    priority: 'medium'
                  }, ['annTitle', 'annContent'])}
                  className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:scale-[1.01] transition-transform"
                >
                  Confirm & Post News
                </button>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {announcements.map(ann => (
                  <div key={ann._id} className="p-6 bg-white rounded-[30px] border border-slate-100 flex justify-between items-center group hover:border-slate-300 transition-all">
                    <div>
                      <p className="font-bold text-slate-900">{ann.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-tighter">ID: {ann._id.slice(-8)}</p>
                    </div>
                    <button onClick={async () => { await fetch(`${API_BASE_URL}/announcements/${ann._id}`, {method:'DELETE'}); fetchAllData(); }} className="p-3 text-slate-200 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRAYER SCHEDULE */}
        {activeTab === 'prayers' && (
          <div className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-sm space-y-12 animate-in fade-in duration-500">
             <h2 className="text-3xl font-black">Jama'at Timings</h2>
             <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'jumah'].map(p => (
                  <div key={p} className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase text-center tracking-widest">{p}</label>
                    <input 
                      className="w-full p-5 bg-slate-50 rounded-[28px] border-none text-center font-mono font-black text-xl text-slate-800 focus:ring-4 focus:ring-slate-100 transition-all shadow-inner" 
                      value={prayerForm[p]}
                      onChange={(e) => setPrayerForm({...prayerForm, [p]: e.target.value})}
                    />
                  </div>
                ))}
             </div>
             <div className="p-8 bg-slate-50 rounded-[35px] space-y-4 border border-slate-100">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block ml-2">Next Prayer Highlight (Target Time)</label>
                <input className="w-full p-4 bg-white rounded-2xl border border-slate-200 font-bold" value={prayerForm.nextPrayerTime} onChange={(e) => setPrayerForm({...prayerForm, nextPrayerTime: e.target.value})} placeholder="e.g. 1:30 PM" />
             </div>
             <button 
                onClick={() => submitData('/prayertimes', {
                  dateEn: new Date().toLocaleDateString('en-GB'), // AUTO-FIX
                  dateUr: new Date().toLocaleDateString('ur-PK'), // AUTO-FIX
                  nextPrayerTime: prayerForm.nextPrayerTime,
                  times: [
                    { name: 'Fajr', time: prayerForm.fajr, urName: 'فجر' },
                    { name: 'Dhuhr', time: prayerForm.dhuhr, urName: 'ظہر' },
                    { name: 'Asr', time: prayerForm.asr, urName: 'عصر' },
                    { name: 'Maghrib', time: prayerForm.maghrib, urName: 'مغرب' },
                    { name: 'Isha', time: prayerForm.isha, urName: 'عشاء' },
                    { name: 'Jumah', time: prayerForm.jumah, urName: 'جمعہ' },
                  ]
                })}
                className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-xl shadow-2xl shadow-slate-200 hover:scale-[1.01] transition-transform"
             >
                Update Schedule & Sync Home
             </button>
          </div>
        )}

        {/* TAB 4: MANAGEMENT (COMMITTEE) */}
        {activeTab === 'members' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <h2 className="text-3xl font-black">Committee Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-5 h-fit">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Register New Official</p>
                  <input id="memName" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" placeholder="Full Name" />
                  <input id="memRole" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold" placeholder="Designation (English)" />
                  <input id="memUrRole" className="w-full p-4 bg-slate-50 rounded-2xl border-none text-right font-serif font-bold" placeholder="عہدہ (اردو)" />
                  <button onClick={() => submitData('/members', { 
                    name: document.getElementById('memName').value, 
                    role: document.getElementById('memRole').value,
                    urRole: document.getElementById('memUrRole').value
                  }, ['memName', 'memRole', 'memUrRole'])} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl">Confirm Member</button>
               </div>
               <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {members.map(m => (
                    <div key={m._id} className="p-6 bg-white rounded-[32px] border border-slate-100 flex items-center justify-between group hover:border-slate-900 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-300">
                           <Users size={24}/>
                        </div>
                        <div>
                          <p className="font-black text-lg leading-tight">{m.name}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{m.role}</p>
                        </div>
                      </div>
                      <button onClick={async () => { await fetch(`${API_BASE_URL}/members/${m._id}`, {method:'DELETE'}); fetchAllData(); }} className="text-slate-200 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* TAB 5: HADITH EDITOR */}
        {activeTab === 'hadith' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-500">
            <h2 className="text-4xl font-black text-center">Hadith Content Editor</h2>
            <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-xl space-y-8 text-center">
                <textarea 
                  className="w-full p-10 bg-slate-50 rounded-[45px] border-none text-2xl font-serif italic text-center h-52 focus:ring-4 focus:ring-slate-100 transition-all" 
                  placeholder="Enter Hadith Translation..."
                  value={hadith.text}
                  onChange={(e) => setHadith({...hadith, text: e.target.value})}
                />
                <input className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-center" placeholder="Source (e.g. Sahih Muslim)" value={hadith.source} onChange={(e) => setHadith({...hadith, source: e.target.value})} />
                <button 
                  onClick={() => submitData('/hadith', { text: hadith.text, source: hadith.source })}
                  className="w-full py-6 bg-slate-900 text-white font-black text-xl rounded-[35px] shadow-2xl shadow-slate-200"
                >
                  Push to Homepage Feed
                </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}