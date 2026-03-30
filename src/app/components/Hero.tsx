import { Brain, FileText, Store } from 'lucide-react';
import type { Language, ActiveTool } from '../App';

interface HeroProps {
  onNavigate: (tool: ActiveTool) => void;
  language: Language;
}

const translations = {
  en: {
    headline1: 'You choose the task.',
    headline2: 'We choose the AI.',
    btn1: 'Use AI Tools',
    btn2: 'Work with Documents',
    btn3: 'Tools for Business & Students',
  },
  hi: {
    headline1: 'आप काम चुनें।',
    headline2: 'हम AI चुनते हैं।',
    btn1: 'AI उपकरण उपयोग करें',
    btn2: 'दस्तावेज़ों के साथ काम करें',
    btn3: 'व्यापार और छात्रों के लिए उपकरण',
  },
  gu: {
    headline1: 'તમે કાર્ય પસંદ કરો.',
    headline2: 'અમે AI પસંદ કરીએ છીએ.',
    btn1: 'AI સાધનો વાપરો',
    btn2: 'દસ્તાવેજો સાથે કામ કરો',
    btn3: 'બિઝનેસ અને વિદ્યાર્થીઓ માટે સાધનો',
  },
};

export function Hero({ onNavigate, language }: HeroProps) {
  const t = translations[language];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="relative flex items-center justify-center h-full">
              <span className="text-8xl md:text-9xl">👆</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mb-12">
          <div className="text-3xl md:text-5xl mb-2">{t.headline1}</div>
          <div className="text-3xl md:text-5xl text-blue-600">{t.headline2}</div>
        </h1>

        {/* Primary Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <button
            onClick={() => scrollToSection('ai-hub')}
            className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white p-6 rounded-2xl hover:bg-blue-700 transition shadow-lg"
          >
            <Brain className="w-8 h-8" />
            <span className="text-lg">{t.btn1}</span>
          </button>

          <button
            onClick={() => scrollToSection('document-tools')}
            className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white p-6 rounded-2xl hover:bg-green-700 transition shadow-lg"
          >
            <FileText className="w-8 h-8" />
            <span className="text-lg">{t.btn2}</span>
          </button>

          <button
            onClick={() => scrollToSection('business-hub')}
            className="flex-1 flex items-center justify-center gap-3 bg-purple-600 text-white p-6 rounded-2xl hover:bg-purple-700 transition shadow-lg"
          >
            <Store className="w-8 h-8" />
            <span className="text-lg">{t.btn3}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
