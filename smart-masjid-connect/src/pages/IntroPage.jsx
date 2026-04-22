
import masjidHeroImage from '../assets/hero-mosque.jpg'; 

export default function IntroPage({ t }) {
  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      
   
      <h1 className="text-4xl font-extrabold text-masjid-dark tracking-tight leading-tight">
        {t.navAbout}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white p-10 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')] rounded-2xl"></div>
        
        
        <div className="z-10 relative flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-masjid-dark leading-tight">
            Serving the Muslim Community
          </h2>
          
          <p className="text-lg text-slate-700 leading-relaxed max-w-xl">
            Welcome to {t.urduMasjidName}. Founded with the purpose of providing spiritual guidance and fostering community ties, we have served the Vaxjo community for decades.
          </p>
          
          <p className="text-slate-600 leading-relaxed max-w-md">
            Our Masjid is not just a place of worship, but a vibrant educational and social hub for all age groups. We offer various classes, community events, and support services.
          </p>
          
    
          <div className="mt-8 pt-4 border-t border-slate-200">
             <blockquote className="text-masjid-gold font-serif text-lg leading-relaxed italic" dir="rtl">
     شہر ساہیوال کا خوبصورت اور قیمتی اثاثہ
            </blockquote>
          </div>
        </div>
        
      
        <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-2 border-masjid-gold/30 z-10 relative group">
          <img 
            src={masjidHeroImage} 
            alt="Main Masjid View - Växjö Muslims" 
            
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-500 group-hover:scale-100" 
          />
        </div>
      </div>
    </div>
  );
}