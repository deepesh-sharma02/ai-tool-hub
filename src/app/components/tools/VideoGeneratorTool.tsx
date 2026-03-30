import { useState } from 'react';
import { ArrowLeft, Video, Wand2 } from 'lucide-react';
import type { Language } from '../../App';

interface VideoGeneratorToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Create Video',
    inputLabel: 'Describe the video you want',
    inputPlaceholder: 'A timelapse of clouds moving over a city...',
    generateBtn: 'Generate Video',
    generating: 'Generating...',
    note: 'Note',
    noteText: 'Video generation is a complex feature that requires specialized AI APIs like Runway ML, Synthesia, or similar services. This is a placeholder showing the integration structure.',
    setupInfo: 'To enable this feature:',
    step1: '1. Get an API key from Runway ML, Synthesia, or similar',
    step2: '2. Add the key to backend environment variables',
    step3: '3. Implement video generation logic in ai_tools.py',
    step4: '4. Note: Video generation can be expensive and slow',
    alternative: 'Alternative: Consider using simple slideshow/presentation tools for MVP',
  },
  hi: {
    title: 'वीडियो बनाएं',
    inputLabel: 'वह वीडियो बताएं जो आप चाहते हैं',
    inputPlaceholder: 'एक शहर के ऊपर बादलों की टाइमलैप्स...',
    generateBtn: 'वीडियो बनाएं',
    generating: 'बन रहा है...',
    note: 'नोट',
    noteText: 'वीडियो जनरेशन एक जटिल सुविधा है जिसके लिए विशेष AI API की आवश्यकता है।',
    setupInfo: 'इस सुविधा को सक्षम करने के लिए:',
    step1: '1. Runway ML या Synthesia से API key प्राप्त करें',
    step2: '2. बैकएंड में key जोड़ें',
    step3: '3. ai_tools.py में वीडियो जनरेशन लॉजिक implement करें',
    step4: '4. नोट: वीडियो जनरेशन महंगा और धीमा हो सकता है',
    alternative: 'विकल्प: MVP के लिए सरल स्लाइडशो/प्रेजेंटेशन टूल का उपयोग करें',
  },
  gu: {
    title: 'વીડિયો બનાવો',
    inputLabel: 'તમે જે વીડિયો ઇચ્છો છો તેનું વર્ણન કરો',
    inputPlaceholder: 'શહેર ઉપર વાદળોની ટાઇમલેપ્સ...',
    generateBtn: 'વીડિયો બનાવો',
    generating: 'બની રહ્યું છે...',
    note: 'નોંધ',
    noteText: 'વીડિયો જનરેશન એક જટિલ ફીચર છે જેને વિશેષ AI API ની જરૂર છે।',
    setupInfo: 'આ ફીચર સક્ષમ કરવા માટે:',
    step1: '1. Runway ML અથવા Synthesia થી API key મેળવો',
    step2: '2. બેકએન્ડમાં key ઉમેરો',
    step3: '3. ai_tools.py માં વીડિયો જનરેશન લોજિક implement કરો',
    step4: '4. નોંધ: વીડિયો જનરેશન ખર્ચાળ અને ધીમું હોઈ શકે છે',
    alternative: 'વિકલ્પ: MVP માટે સરળ સ્લાઇડશો/પ્રેઝન્ટેશન ટૂલ્સનો ઉપયોગ કરો',
  },
};

const API_BASE_URL = 'http://localhost:5000/api';

export function VideoGeneratorTool({ onBack, language }: VideoGeneratorToolProps) {
  const t = translations[language];
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Video generation feature is not yet configured');
      } else {
        alert(data.note || 'Video generation not available');
      }
    } catch (error) {
      console.error('Video generation error:', error);
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Video className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl">{t.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            ⚠️ {t.note}
          </h3>
          <p className="mb-3">{t.noteText}</p>
          <div className="text-sm">
            <p className="font-semibold mb-1">{t.setupInfo}</p>
            <p>{t.step1}</p>
            <p>{t.step2}</p>
            <p>{t.step3}</p>
            <p>{t.step4}</p>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm"><strong>💡 {t.alternative}</strong></p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <label className="block mb-3 text-lg">{t.inputLabel}</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl resize-none focus:border-purple-500 focus:outline-none"
          />

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="w-full mt-6 bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            {loading ? t.generating : t.generateBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
