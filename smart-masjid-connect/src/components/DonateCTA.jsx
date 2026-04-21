// src/components/DonateCTA.jsx
export default function DonateCTA({ t }) {
  return (
    // Prominent background banner
    <section className="bg-masjid-accent/10 border-2 border-dashed border-masjid-accent rounded-2xl p-12 text-center shadow-lg">
      <h3 className="text-4xl font-extrabold text-masjid-dark mb-4">{t.donateCTA}</h3>
      <p className="text-lg text-slate-700 max-w-xl mx-auto mb-10">
        Your contributions help us maintain the Masjid and provide essential services to our community.
      </p>
      {/* This button will trigger the POST donation form we planned for Database Lab */}
      <button className="bg-masjid-gold text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-masjid-gold/90 transition-transform transform hover:scale-105 shadow-md">
        {t.navDonate}
      </button>
    </section>
  );
}