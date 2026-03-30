import { useState } from 'react';
import { Menu, X, Globe, LogIn, LogOut, User, Sparkles } from 'lucide-react';
import type { Language } from '../App';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user?: any;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const translations = {
  en: {
    aiHub: 'AI Hub',
    documentTools: 'Document Tools',
    businessHub: 'Business Hub',
    studentCareer: 'Student Career Hub',
    login: 'Login',
  },
  hi: {
    aiHub: 'एआई हब',
    documentTools: 'दस्तावेज़ उपकरण',
    businessHub: 'व्यापार हब',
    studentCareer: 'छात्र करियर हब',
    login: 'लॉगिन',
  },
  gu: {
    aiHub: 'એઆઈ હબ',
    documentTools: 'દસ્તાવેજ સાધનો',
    businessHub: 'બિઝનેસ હબ',
    studentCareer: 'વિદ્યાર્થી કારકિર્દી હબ',
    login: 'લૉગિન',
  },
};

export function Header({ language, onLanguageChange, user, onLoginClick, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[language];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-600" />
          <span className="font-bold text-lg">AI Seva</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <button onClick={() => scrollToSection('ai-hub')} className="flex items-center gap-2 hover:text-blue-600 transition">
            <span>🧠</span>
            <span>{t.aiHub}</span>
          </button>
          <button onClick={() => scrollToSection('document-tools')} className="flex items-center gap-2 hover:text-blue-600 transition">
            <span>📄</span>
            <span>{t.documentTools}</span>
          </button>
          <button onClick={() => scrollToSection('business-hub')} className="flex items-center gap-2 hover:text-blue-600 transition">
            <span>🏪</span>
            <span>{t.businessHub}</span>
          </button>
          <button onClick={() => scrollToSection('student-career')} className="flex items-center gap-2 hover:text-blue-600 transition">
            <span>🎓</span>
            <span>{t.studentCareer}</span>
          </button>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded-full text-sm transition ${language === 'en' ? 'bg-white shadow' : ''}`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-3 py-1 rounded-full text-sm transition ${language === 'hi' ? 'bg-white shadow' : ''}`}
            >
              हिं
            </button>
            <button
              onClick={() => onLanguageChange('gu')}
              className={`px-3 py-1 rounded-full text-sm transition ${language === 'gu' ? 'bg-white shadow' : ''}`}
            >
              ગુ
            </button>
          </div>

          {/* Login/User */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm">{user.name}</span>
              </div>
              <button onClick={onLogout} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 p-2">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={onLoginClick} className="hidden md:flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
              <LogIn className="w-4 h-4" />
              <span>{t.login}</span>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-white z-50 p-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => scrollToSection('ai-hub')}
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <span className="text-3xl">🧠</span>
              <span className="text-lg">{t.aiHub}</span>
            </button>
            <button
              onClick={() => scrollToSection('document-tools')}
              className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <span className="text-3xl">📄</span>
              <span className="text-lg">{t.documentTools}</span>
            </button>
            <button
              onClick={() => scrollToSection('business-hub')}
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
            >
              <span className="text-3xl">🏪</span>
              <span className="text-lg">{t.businessHub}</span>
            </button>
            <button
              onClick={() => scrollToSection('student-career')}
              className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition"
            >
              <span className="text-3xl">🎓</span>
              <span className="text-lg">{t.studentCareer}</span>
            </button>
            
            {user ? (
              <>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>{user.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <button onClick={onLogout} className="flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition">
                  <LogOut className="w-6 h-6" />
                  <span className="text-lg">Logout</span>
                </button>
              </>
            ) : (
              <button onClick={onLoginClick} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                <LogIn className="w-6 h-6" />
                <span className="text-lg">{t.login}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}