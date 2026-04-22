import { useState, useEffect } from 'react';

export default function IntezamiaPage({ t }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/members')
      .then(res => res.json())
      .then(data => {
        if (data.success) setMembers(data.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div className="p-20 text-center">Loading Committee...</div>;

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <h1 className="text-4xl font-extrabold text-masjid-dark">{t.navIntezamia}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {members.map(member => (
          <div key={member._id} className="bg-white p-8 rounded-2xl shadow border border-slate-100 text-center flex flex-col items-center gap-4 transition-transform hover:scale-105">
            <div className="h-24 w-24 rounded-full bg-masjid-gold flex items-center justify-center font-bold text-white text-3xl">👤</div>
            <div>
                <p className="text-xl font-extrabold text-masjid-dark">{member.name}</p>
                <p className="text-sm font-semibold text-slate-500">{member.role}</p>
                <p className="text-xs font-serif text-slate-400 mt-1" dir="rtl">{member.urRole}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}