import { useState } from 'react';
import { ArrowLeft, Mic, Volume2, Download } from 'lucide-react';
import type { Language } from '../../App';

interface SpeechToTextToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Speech & Text',
    textToSpeech: 'Text to Speech',
    speechToText: 'Speech to Text',
    inputPlaceholder: 'Enter text to convert to speech...',
    convertBtn: 'Convert to Speech',
    converting: 'Converting...',
    recordBtn: 'Start Recording',
    recording: 'Recording...',
    stopBtn: 'Stop Recording',
    selectLang: 'Language',
    download: 'Download Audio',
    result: 'Transcription',
  },
  hi: {
    title: 'भाषण और पाठ',
    textToSpeech: 'पाठ से भाषण',
    speechToText: 'भाषण से पाठ',
    inputPlaceholder: 'भाषण में बदलने के लिए टेक्स्ट दर्ज करें...',
    convertBtn: 'भाषण में बदलें',
    converting: 'बदल रहा है...',
    recordBtn: 'रिकॉर्डिंग शुरू करें',
    recording: 'रिकॉर्डिंग...',
    stopBtn: 'रिकॉर्डिंग रोकें',
    selectLang: 'भाषा',
    download: 'ऑडियो डाउनलोड करें',
    result: 'ट्रांसक्रिप्शन',
  },
  gu: {
    title: 'ભાષણ અને ટેક્સ્ટ',
    textToSpeech: 'ટેક્સ્ટ થી ભાષણ',
    speechToText: 'ભાષણ થી ટેક્સ્ટ',
    inputPlaceholder: 'ભાષણમાં રૂપાંતરિત કરવા માટે ટેક્સ્ટ દાખલ કરો...',
    convertBtn: 'ભાષણમાં રૂપાંતરિત કરો',
    converting: 'રૂપાંતરિત થઈ રહ્યું છે...',
    recordBtn: 'રેકોર્ડિંગ શરૂ કરો',
    recording: 'રેકોર્ડિંગ...',
    stopBtn: 'રેકોર્ડિંગ બંધ કરો',
    selectLang: 'ભાષા',
    download: 'ઓડિયો ડાઉનલોડ કરો',
    result: 'ટ્રાન્સક્રિપ્શન',
  },
};

const API_BASE_URL = 'http://localhost:5000/api';

export function SpeechToTextTool({ onBack, language }: SpeechToTextToolProps) {
  const t = translations[language];
  const [mode, setMode] = useState<'tts' | 'stt'>('tts');
  const [textInput, setTextInput] = useState('');
  const [selectedLang, setSelectedLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  const handleTextToSpeech = async () => {
    if (!textInput.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/text-to-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textInput, lang: selectedLang }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const audio = new Audio(url);
        audio.play();
      } else {
        alert('Text-to-speech failed');
      }
    } catch (error) {
      console.error('TTS error:', error);
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.lang = selectedLang === 'en' ? 'en-US' : selectedLang === 'hi' ? 'hi-IN' : 'gu-IN';
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscription(transcript);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setRecording(false);
      };

      recognitionInstance.onend = () => {
        setRecording(false);
      };

      recognitionInstance.start();
      setRecognition(recognitionInstance);
      setRecording(true);
    } else {
      alert('Speech recognition not supported in this browser. Please use Chrome.');
    }
  };

  const handleStopRecording = () => {
    if (recognition) {
      recognition.stop();
      setRecording(false);
    }
  };

  const handleDownloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'speech.mp3';
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-teal-600" />
            <h1 className="text-xl">{t.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setMode('tts')}
            className={`flex-1 py-3 rounded-xl transition ${mode === 'tts' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 border-2'}`}
          >
            {t.textToSpeech}
          </button>
          <button
            onClick={() => setMode('stt')}
            className={`flex-1 py-3 rounded-xl transition ${mode === 'stt' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 border-2'}`}
          >
            {t.speechToText}
          </button>
        </div>

        {mode === 'tts' ? (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block mb-2">{t.selectLang}</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full p-4 mb-4 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="gu">Gujarati (ગુજરાતી)</option>
              <option value="mr">Marathi (मराठी)</option>
            </select>

            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="w-full h-40 p-4 border-2 border-gray-300 rounded-xl resize-none focus:border-teal-500 focus:outline-none mb-4"
            />

            <button
              onClick={handleTextToSpeech}
              disabled={!textInput.trim() || loading}
              className="w-full bg-teal-600 text-white py-4 rounded-xl hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <Volume2 className="w-5 h-5" />
              {loading ? t.converting : t.convertBtn}
            </button>

            {audioUrl && (
              <button
                onClick={handleDownloadAudio}
                className="w-full mt-3 bg-green-50 text-green-700 py-4 rounded-xl hover:bg-green-100 border-2 border-green-200 transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {t.download}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <label className="block mb-2">{t.selectLang}</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full p-4 mb-6 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:outline-none"
              disabled={recording}
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="gu">Gujarati (ગુજરાતી)</option>
            </select>

            <div className="text-center mb-6">
              <button
                onClick={recording ? handleStopRecording : handleStartRecording}
                className={`w-32 h-32 rounded-full transition flex items-center justify-center mx-auto ${
                  recording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-teal-600 hover:bg-teal-700'
                } text-white`}
              >
                <Mic className="w-16 h-16" />
              </button>
              <p className="mt-4 text-lg">
                {recording ? t.recording : t.recordBtn}
              </p>
            </div>

            {transcription && (
              <div>
                <h3 className="text-lg mb-2">{t.result}</h3>
                <div className="p-4 bg-teal-50 border-2 border-teal-200 rounded-xl">
                  <p className="whitespace-pre-wrap">{transcription}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
