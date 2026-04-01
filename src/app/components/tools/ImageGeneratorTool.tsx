import { useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Wand2 } from 'lucide-react';
import type { Language } from '../../App';

interface ImageGeneratorToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Generate Image',
    inputLabel: 'Describe the image you want',
    inputPlaceholder: 'A beautiful sunset over mountains...',
    generateBtn: 'Generate Image',
    generating: 'Generating...',
    note: 'Note',
    noteText: 'Image generation requires an API key from OpenAI DALL-E or Stability AI. This is a placeholder showing the integration structure.',
    setupInfo: 'To enable this feature:',
    step1: '1. Get an API key from OpenAI or Stability AI',
    step2: '2. Add the key to backend environment variables',
    step3: '3. Uncomment the API code in ai_tools.py',
  },
  hi: {
    title: 'इमेज जनरेट करें',
    inputLabel: 'वह इमेज बताएं जो आप चाहते हैं',
    inputPlaceholder: 'पहाड़ों के ऊपर एक सुंदर सूर्यास्त...',
    generateBtn: 'इमेज जनरेट करें',
    generating: 'जनरेट हो रहा है...',
    note: 'नोट',
    noteText: 'इमेज जनरेशन के लिए OpenAI DALL-E या Stability AI से API key की आवश्यकता है।',
    setupInfo: 'इस सुविधा को सक्षम करने के लिए:',
    step1: '1. OpenAI या Stability AI से API key प्राप्त करें',
    step2: '2. बैकएंड में key जोड़ें',
    step3: '3. ai_tools.py में API कोड को uncomment करें',
  },
  gu: {
    title: 'ઇમેજ બનાવો',
    inputLabel: 'તમે જે ઇમેજ ઇચ્છો છો તેનું વર્ણન કરો',
    inputPlaceholder: 'પર્વતો ઉપર સુંદર સૂર્યાસ્ત...',
    generateBtn: 'ઇમેજ બનાવો',
    generating: 'બની રહ્યું છે...',
    note: 'નોંધ',
    noteText: 'ઇમેજ જનરેશન માટે OpenAI DALL-E અથવા Stability AI થી API key જરૂરી છે।',
    setupInfo: 'આ ફીચર સક્ષમ કરવા માટે:',
    step1: '1. OpenAI અથવા Stability AI થી API key મેળવો',
    step2: '2. બેકએન્ડમાં key ઉમેરો',
    step3: '3. ai_tools.py માં API કોડ uncomment કરો',
  },
};

const API_BASE_URL = 'https://ai-tool-hub-4a7n.onrender.com/api';

export function ImageGeneratorTool({ onBack, language }: ImageGeneratorToolProps) {
  const t = translations[language];
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setImageUrl(data.placeholder_url || data.image_url);
      } else {
        alert(data.note || 'Image generation not configured');
      }
    } catch (error) {
      console.error('Image generation error:', error);
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-600" />
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
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <label className="block mb-3 text-lg">{t.inputLabel}</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl resize-none focus:border-indigo-500 focus:outline-none"
          />

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <Wand2 className="w-5 h-5" />
            {loading ? t.generating : t.generateBtn}
          </button>
        </div>

        {imageUrl && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <img
              src={imageUrl}
              alt="Generated"
              className="w-full rounded-xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}
