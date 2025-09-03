
import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from './Icons';
import { Language, Theme, TranslationSet } from '../App';
import Logo from './Logo';

const LanguageToggle: React.FC<{
  activeLang: Language;
  onLangChange: (lang: Language) => void;
}> = ({ activeLang, onLangChange }) => {
  const languages: Language[] = ['EN', 'CH', 'TU'];

  return (
    <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex items-center">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => onLangChange(lang)}
          className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${
            activeLang === lang
              ? 'bg-white text-blue-500 dark:bg-slate-900 dark:text-blue-400 shadow-sm'
              : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: TranslationSet;
    theme: Theme;
    toggleTheme: () => void;
    isLoggedIn: boolean;
    toggleLogin: () => void;
    onBookNow: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, t, theme, toggleTheme, isLoggedIn, toggleLogin, onBookNow }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);
  
  const MobileMenu = () => (
    <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
    >
        <div 
            className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                <Logo size="sm" theme={theme} />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-slate-500 dark:text-slate-400" aria-label="Close menu">
                    <CloseIcon />
                </button>
            </div>
            <div className="p-5 flex flex-col gap-5">
                <LanguageToggle activeLang={language} onLangChange={setLanguage} />
                <button 
                    onClick={toggleTheme}
                    className="flex items-center justify-between w-full text-left p-3 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <span className="font-medium">Toggle Theme</span>
                    {theme === 'light' ? <SunIcon /> : <MoonIcon />}
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700"></div>
                <button 
                  onClick={() => { onBookNow(); setIsMenuOpen(false); }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
                >
                    {t.bookNow}
                 </button>
                 <button 
                    onClick={() => { toggleLogin(); setIsMenuOpen(false); }}
                    className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors duration-300"
                 >
                    {isLoggedIn ? t.logout : t.login}
                 </button>
            </div>
        </div>
    </div>
  );

  return (
    <>
      <header className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Logo size="md" theme={theme} />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <LanguageToggle activeLang={language} onLangChange={setLanguage} />
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200" 
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <SunIcon /> : <MoonIcon />}
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
              <button 
                onClick={onBookNow}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                  {t.bookNow}
              </button>
              <button 
                  onClick={toggleLogin}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors duration-300"
              >
                  {isLoggedIn ? t.logout : t.login}
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(true)} className="p-2 text-slate-500 dark:text-slate-400" aria-label="Open menu">
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu />
    </>
  );
};

export default Header;
