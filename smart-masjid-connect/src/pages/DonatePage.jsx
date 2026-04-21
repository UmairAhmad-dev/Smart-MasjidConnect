// src/pages/DonatePage.jsx
export default function DonatePage({ t }) {
  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <h1 className="text-4xl font-extrabold text-masjid-dark">{t.navDonate}</h1>
      
      <div className="bg-white p-10 rounded-2xl shadow border border-slate-100 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold text-masjid-dark mb-4">{t.projectName} Fund</h2>
        <p className="text-lg text-slate-700 max-w-xl leading-relaxed mb-10">
          Your contributions help us maintain the Masjid and provide essential services. Choose your cause and amount.
        </p>
        
        {/* Placeholder form structure, will connect MongoDB CRUD later */}
        <div className="w-full max-w-lg p-8 border border-slate-200 rounded-xl bg-slate-50 space-y-6">
            <input type="text" placeholder="Donor Name (Optional)" className="w-full p-4 border border-slate-300 rounded-lg"/>
            <input type="number" placeholder="Donation Amount" className="w-full p-4 border border-slate-300 rounded-lg"/>
            
            {/* Action button triggers MongoDB POST later */}
            <button className="bg-masjid-gold text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-masjid-gold/90 transition-transform transform hover:scale-105 shadow-md w-full">
                Process Donation
            </button>
        </div>
      </div>
    </div>
  );
}