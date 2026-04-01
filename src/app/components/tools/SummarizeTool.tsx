import { useState } from 'react';
import { ArrowLeft, FileText, Upload, Copy, Download } from 'lucide-react';
import type { Language } from '../../App';

interface SummarizeToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Summarize Document',
    inputLabel: 'Enter text or upload document',
    inputPlaceholder: 'Paste your text here...',
    uploadBtn: 'Or Upload File',
    summarizeBtn: 'Summarize',
    summarizing: 'Summarizing...',
    result: 'Summary',
    stats: 'Statistics',
    originalLength: 'Original',
    summaryLength: 'Summary',
    compression: 'Compression',
    copy: 'Copy',
    download: 'Download',
  },
  hi: {
    title: 'दस्तावेज़ सारांश',
    inputLabel: 'टेक्स्ट दर्ज करें या दस्तावेज़ अपलोड करें',
    inputPlaceholder: 'अपना टेक्स्ट यहां पेस्ट करें...',
    uploadBtn: 'या फ़ाइल अपलोड करें',
    summarizeBtn: 'सारांश बनाएं',
    summarizing: 'सारांश बन रहा है...',
    result: 'सारांश',
    stats: 'आंकड़े',
    originalLength: 'मूल',
    summaryLength: 'सारांश',
    compression: 'संपीड़न',
    copy: 'कॉपी करें',
    download: 'डाउनलोड करें',
  },
  gu: {
    title: 'દસ્તાવેજ સારાંશ',
    inputLabel: 'ટેક્સ્ટ દાખલ કરો અથવા દસ્તાવેજ અપલોડ કરો',
    inputPlaceholder: 'તમારો ટેક્સ્ટ અહીં પેસ્ટ કરો...',
    uploadBtn: 'અથવા ફાઇલ અપલોડ કરો',
    summarizeBtn: 'સારાંશ બનાવો',
    summarizing: 'સારાંશ બની રહ્યો છે...',
    result: 'સારાંશ',
    stats: 'આંકડા',
    originalLength: 'મૂળ',
    summaryLength: 'સારાંશ',
    compression: 'સંકોચન',
    copy: 'કૉપિ કરો',
    download: 'ડાઉનલોડ કરો',
  },
};

const API_BASE_URL = 'https://ai-tool-hub-4a7n.onrender.com/api/ai/summarize';

export function SummarizeTool({ onBack, language }: SummarizeToolProps) {
  const t = translations[language];
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.summary);
        setStats({
          original: data.original_length,
          summary: data.summary_length,
          compression: data.compression_ratio,
        });
      } else {
        alert('Summarization failed');
      }
    } catch (error) {
      console.error('Summarize error:', error);
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.summary);
        setStats({
          original: data.original_length,
          summary: data.summary_length,
          compression: data.compression_ratio,
        });
      } else {
        alert('Summarization failed');
      }
    } catch (error) {
      console.error('Summarize error:', error);
      alert('Connection error');
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
    a.download = 'summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
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
            className="w-full h-48 p-4 border-2 border-gray-300 rounded-xl resize-none focus:border-indigo-500 focus:outline-none"
          />

          <div className="mt-4 flex gap-3">
            <button
              onClick={handleSummarize}
              disabled={!inputText.trim() || loading}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? t.summarizing : t.summarizeBtn}
            </button>
            <label className="flex-1 cursor-pointer">
              <input
                type="file"
                accept=".txt,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
              <div className="flex items-center justify-center gap-2 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl border-2 border-gray-300 transition">
                <Upload className="w-5 h-5" />
                <span>{t.uploadBtn}</span>
              </div>
            </label>
          </div>
        </div>

        {result && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg mb-4">{t.result}</h3>
            <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl mb-4">
              <p className="whitespace-pre-wrap">{result}</p>
            </div>

            {stats && (
              <div className="mb-4 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl">
                <h4 className="font-semibold mb-2">{t.stats}</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">{t.originalLength}</div>
                    <div className="text-lg font-bold">{stats.original} words</div>
                  </div>
                  <div>
                    <div className="text-gray-600">{t.summaryLength}</div>
                    <div className="text-lg font-bold">{stats.summary} words</div>
                  </div>
                  <div>
                    <div className="text-gray-600">{t.compression}</div>
                    <div className="text-lg font-bold">{stats.compression}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
