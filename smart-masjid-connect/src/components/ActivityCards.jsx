// src/components/ActivityCards.jsx

// Mock features adapted from image_3.png (What We Do)
const mockActivities = [
  { _id: '1', title: "Quran Learning", urTitle: "قرآن لرننگ", icon: "📖" },
  { _id: '2', title: "Community Events", urTitle: "کمیونٹی ایونٹس", icon: "🤝" },
  { _id: '3', title: "Charity Distribution", urTitle: "صدقات کی تقسیم", icon: "🤲" },
  { _id: '4', title: "Funeral Services", urTitle: "جنازہ کی خدمات", icon: "🕌" },
];

export default function ActivityCards({ t }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-bold text-masjid-dark">MASJID ACTIVITIES</h3>
          <button className="text-masjid-gold font-semibold hover:underline">Explore All</button>
      </div>

      {/* Grid adapted from image_3.png style cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {mockActivities.map(activity => (
          <div key={activity._id} className="bg-white p-6 rounded-2xl shadow border border-slate-100 text-center flex flex-col items-center gap-4 transition-transform hover:scale-105">
            {/* Medallion style, using icon placeholder for midterm */}
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center font-bold text-white text-3xl border-2 border-masjid-accent/20">
                <span className="text-masjid-gold">{activity.icon}</span>
            </div>
            <div>
                <p className="text-xl font-extrabold text-masjid-dark leading-tight">{activity.title}</p>
                <p className="text-sm font-serif text-masjid-gold/80 mt-1" dir="rtl">{activity.urTitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}