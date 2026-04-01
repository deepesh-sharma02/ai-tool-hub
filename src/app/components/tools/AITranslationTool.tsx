import { useState } from 'react';
import { ArrowLeft, Globe, Copy, Download, Volume2 } from 'lucide-react';
import type { Language } from '../../App';

interface AITranslationToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'AI Translation',
    inputLabel: 'Enter text to translate',
    inputPlaceholder: 'Type or paste your text here...',
    selectLang: 'Translate to:',
    translateBtn: 'Translate',
    translating: 'Translating...',
    result: 'Translation Result',
    copy: 'Copy',
    download: 'Download',
    listen: 'Listen',
  },
  hi: {
    title: 'एआई अनुवाद',
    inputLabel: 'अनुवाद के लिए टेक्स्ट दर्ज करें',
    inputPlaceholder: 'यहां अपना टेक्स्ट टाइप करें या पेस्ट करें...',
    selectLang: 'इसमें अनुवाद करें:',
    translateBtn: 'अनुवाद करें',
    translating: 'अनुवाद हो रहा है...',
    result: 'अनुवाद परिणाम',
    copy: 'कॉपी करें',
    download: 'डाउनलोड करें',
    listen: 'सुनें',
  },
  gu: {
    title: 'એઆઈ અનુવાદ',
    inputLabel: 'અનુવાદ માટે ટેક્સ્ટ દાખલ કરો',
    inputPlaceholder: 'અહીં તમારો ટેક્સ્ટ ટાઈપ કરો અથવા પેસ્ટ કરો...',
    selectLang: 'આમાં અનુવાદ કરો:',
    translateBtn: 'અનુવાદ કરો',
    translating: 'અનુવાદ થઈ રહ્યો છે...',
    result: 'અનુવાદ પરિણામ',
    copy: 'કૉપિ કરો',
    download: 'ડાઉનલોડ કરો',
    listen: 'સાંભળો',
  },
};

const API_BASE_URL = 'https://ai-tool-hub-4a7n.onrender.com/api';

export function AITranslationTool({ onBack, language }: AITranslationToolProps) {
  const t = translations[language];
  const [inputText, setInputText] = useState('');
  const [targetLang, setTargetLang] = useState('hindi');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/ai/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: inputText, 
          target_lang: targetLang 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.translated);
      } else {
        setError(data.error || 'Translation failed');
      }
    } catch (error) {
      setError('Connection error. Please make sure backend is running.');
      console.error('Translation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    alert(language === 'en' ? 'Copied!' : language === 'hi' ? 'कॉपी हो गया!' : 'કૉપિ થયું!');
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translation.txt';
    a.click();
  };

  const handleListen = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: result, 
          lang: targetLang 
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
      } else {
        alert('Text-to-speech failed');
      }
    } catch (error) {
      console.error('TTS error:', error);
      alert('Text-to-speech not available');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl">{t.title}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block mb-3 text-lg">{t.inputLabel}</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl resize-none focus:border-blue-500 focus:outline-none"
          />

          {/* Language Selection */}
          <div className="mt-4">
            <label className="block mb-2">{t.selectLang}</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="hindi">Hindi (हिंदी)</option>
              <option value="gujarati">Gujarati (ગુજરાતી)</option>
              <option value="english">English</option>
              <option value="marathi">Marathi (मराठी)</option>
              <option value="tamil">Tamil (தமிழ்)</option>
              <option value="telugu">Telugu (తెలుగు)</option>
              <option value="bengali">Bengali (বাংলা)</option>
              <option value="kannada">Kannada (ಕನ್ನಡ)</option>
            </select>
          </div>

          {/* Action Button */}
          <button
            onClick={handleTranslate}
            disabled={!inputText.trim() || loading}
            className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? t.translating : t.translateBtn}
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg mb-4">{t.result}</h3>
            <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl mb-4">
              <p className="whitespace-pre-wrap">{result}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border-2 border-blue-200 transition"
              >
                <Copy className="w-5 h-5" />
                <span>{t.copy}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-xl border-2 border-green-200 transition"
              >
                <Download className="w-5 h-5" />
                <span>{t.download}</span>
              </button>
              <button
                onClick={handleListen}
                className="flex items-center justify-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border-2 border-purple-200 transition"
              >
                <Volume2 className="w-5 h-5" />
                <span>{t.listen}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
