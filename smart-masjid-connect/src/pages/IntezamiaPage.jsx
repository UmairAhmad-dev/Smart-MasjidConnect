// src/pages/IntezamiaPage.jsx

// Mock team data
const mockIntezamia = [
  { _id: '1', name: "Imam Khalid", role: "Head Imam", urRole: "ہیڈ امام" },
  { _id: '2', name: "Dr. Ahmed", role: "President", urRole: "صدر" },
  { _id: '3', name: "Br. Omar", role: "Treasurer", urRole: "خزانچی" },
  { _id: '4', name: "Br. Zain", role: "Secretary", urRole: "سیکرٹری" },
];

export default function IntezamiaPage({ t }) {
  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <h1 className="text-4xl font-extrabold text-masjid-dark">{t.navIntezamia}</h1>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {mockIntezamia.map(member => (
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