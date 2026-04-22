// src/components/Footer.jsx
export default function Footer({ t }) {
  return (
    <footer className="bg-masjid-dark text-slate-300 mt-16 py-12 px-6">
      <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h4 className="text-2xl font-bold text-white mb-3">{t.projectName}</h4>
          <p className="text-slate-400 max-w-md">Serving our community with spiritual guidance, educational resources, and essential services.</p>
        </div>
        <div className="text-sm md:text-right">
          <p>&copy; 2026 {t.projectName}. All rights reserved.</p>
          {/*<p>Developed by: Umair Nadeem</p>*/}
        </div>
      </div>
    </footer>
  );
}