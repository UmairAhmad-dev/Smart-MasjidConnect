
import PrayerTimesCard from '../components/PrayerTimesCard';

export default function PrayersPage({ t }) {
  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <h1 className="text-4xl font-extrabold text-masjid-dark mb-6">{t.navPrayers}</h1>
     
      <div className="w-full">
        <PrayerTimesCard t={t} />
      </div>
      
      <p className="text-sm text-slate-500 max-w-lg text-center mx-auto">
        Please note: Prayer times may vary slightly. Contact the Masjid office for official verification. Last Updated: 17 Apr 2026.
      </p>
    </div>
  );
}