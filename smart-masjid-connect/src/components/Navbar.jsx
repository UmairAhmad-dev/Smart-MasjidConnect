import { Link } from 'react-router-dom';
import masjidLogoImage from '../assets/logo-mosque.jpg'; 

export default function Navbar({ setLang, lang, t }) {
  
  const navLinks = [
    { key: 'navHome', path: '/' },
    { key: 'navPrayers', path: '/prayers' },
    { key: 'navAbout', path: '/about' }, 
    { key: 'navAnnouncements', path: '/announcements' },
    { key: 'navIntezamia', path: '/intezamia' }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-3 hover:opacity-90">
          <img 
            src={masjidLogoImage} 
            alt="Muslims Logo - Masjid Connect" 
            className="h-10 w-10 rounded-full object-cover object-center border-2 border-masjid-gold/30 shadow-md" 
          />
          
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-masjid-dark tracking-tight">
              {t.projectName}
            </span>
            {lang === 'en' && (
              <span className="text-xs text-slate-500 font-serif tracking-wide" dir="rtl">
                {t.urduMasjidName}
              </span>
            )}
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.key} 
              to={link.path} 
              className="text-masjid-dark hover:text-masjid-gold font-semibold transition-colors"
            >
              {t[link.key]}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
            className="px-4 py-1.5 border border-masjid-dark text-masjid-dark rounded-full text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            {lang === 'en' ? 'اردو' : 'English'}
          </button>
          
          <Link 
            to="/donate" 
            className="bg-masjid-gold text-white px-6 py-2 rounded-full font-semibold hover:bg-masjid-gold/90 transition-transform transform hover:scale-105 shadow-md"
          >
            {t.navDonate}
          </Link>
        </div>

      </nav>
    </header>
  );
}