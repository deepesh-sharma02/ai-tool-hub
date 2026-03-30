import { Shield, Mail, FileText, Info } from 'lucide-react';
import type { Language } from '../App';

interface FooterProps {
  language: Language;
}

const translations = {
  en: {
    about: 'About',
    privacy: 'Privacy Policy',
    contact: 'Contact',
    trust: "We don't store your files.",
    trustDesc: 'All processing happens securely and files are deleted immediately after use.',
  },
  hi: {
    about: 'के बारे में',
    privacy: 'गोपनीयता नीति',
    contact: 'संपर्क',
    trust: 'हम आपकी फाइलें संग्रहीत नहीं करते हैं।',
    trustDesc: 'सभी प्रसंस्करण सुरक्षित रूप से होता है और उपयोग के बाद फाइलें तुरंत हटा दी जाती हैं।',
  },
  gu: {
    about: 'વિશે',
    privacy: 'ગોપનીયતા નીતિ',
    contact: 'સંપર્ક',
    trust: 'અમે તમારી ફાઇલો સ્ટોર કરતા નથી.',
    trustDesc: 'તમામ પ્રક્રિયા સુરક્ષિત રીતે થાય છે અને ઉપયોગ પછી ફાઇલો તરત જ કાઢી નાખવામાં આવે છે.',
  },
};

export function Footer({ language }: FooterProps) {
  const t = translations[language];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Trust Message */}
        <div className="bg-green-900/50 border-2 border-green-600 rounded-2xl p-6 mb-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-3 text-green-400" />
          <h3 className="text-xl mb-2">🔒 {t.trust}</h3>
          <p className="text-green-200 text-sm">{t.trustDesc}</p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="flex items-center justify-center gap-2 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition">
            <Info className="w-5 h-5" />
            <span>{t.about}</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition">
            <FileText className="w-5 h-5" />
            <span>{t.privacy}</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition">
            <Mail className="w-5 h-5" />
            <span>{t.contact}</span>
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm">
          © 2026 AI Seva. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
