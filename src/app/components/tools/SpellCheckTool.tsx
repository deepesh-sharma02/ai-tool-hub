import { useState } from 'react';
import { ArrowLeft, CheckCircle, Copy } from 'lucide-react';
import type { Language } from '../../App';

interface SpellCheckToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Spell Check',
    inputLabel: 'Enter text to check',
    inputPlaceholder: 'Type your text here...',
    checkBtn: 'Check Spelling',
    checking: 'Checking...',
    result: 'Corrected Text',
    corrections: 'Corrections Found',
    noErrors: 'No errors found!',
    copy: 'Copy',
  },
  hi: {
    title: 'स्पेलिंग जांच',
    inputLabel: 'जांच के लिए टेक्स्ट दर्ज करें',
    inputPlaceholder: 'यहां अपना टेक्स्ट टाइप करें...',
    checkBtn: 'स्पेलिंग जांचें',
    checking: 'जांच हो रही है...',
    result: 'सुधारा गया टेक्स्ट',
    corrections: 'सुधार मिले',
    noErrors: 'कोई त्रुटि नहीं मिली!',
    copy: 'कॉपी करें',
  },
  gu: {
    title: 'સ્પેલિંગ ચેક',
    inputLabel: 'તપાસ માટે ટેક્સ્ટ દાખલ કરો',
    inputPlaceholder: 'અહીં તમારો ટેક્સ્ટ ટાઈપ કરો...',
    checkBtn: 'સ્પેલિંગ તપાસો',
    checking: 'તપાસ થઈ રહી છે...',
    result: 'સુધારેલ ટેક્સ્ટ',
    corrections: 'સુધારા મળ્યા',
    noErrors: 'કોઈ ભૂલ મળી નથી!',
    copy: 'કૉપિ કરો',
  },
};

const API_BASE_URL = 'https://ai-tool-hub-4a7n.onrender.com/api/ai';

export function SpellCheckTool({ onBack, language }: SpellCheckToolProps) {
  const t = translations[language];
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [corrections, setCorrections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/ai/spell-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.corrected);
        setCorrections(data.corrections || []);
      } else {
        setError(data.error || 'Spell check failed');
      }
    } catch (error) {
      setError('Connection error. Please make sure backend is running.');
      console.error('Spell check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert(language === 'en' ? 'Copied!' : language === 'hi' ? 'कॉपी हो गया!' : 'કૉપિ થયું!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h1 className="text-xl">{t.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block mb-3 text-lg">{t.inputLabel}</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl resize-none focus:border-blue-500 focus:outline-none"
          />

          <button
            onClick={handleCheck}
            disabled={!inputText.trim() || loading}
            className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? t.checking : t.checkBtn}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg mb-4">{t.result}</h3>
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl mb-4">
              <p className="whitespace-pre-wrap">{result}</p>
            </div>

            {corrections.length > 0 && (
              <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                <h4 className="font-semibold mb-2">{t.corrections}: {corrections.length}</h4>
                {corrections.map((corr, idx) => (
                  <div key={idx} className="text-sm mb-1">
                    <span className="line-through text-red-600">{corr.original}</span> → <span className="text-green-600">{corr.corrected}</span>
                  </div>
                ))}
              </div>
            )}

            {corrections.length === 0 && (
              <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <p className="text-green-700">✓ {t.noErrors}</p>
              </div>
            )}

            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border-2 border-blue-200 transition"
            >
              <Copy className="w-5 h-5" />
              <span>{t.copy}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
