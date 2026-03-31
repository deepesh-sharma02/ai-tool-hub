import { useState, useRef } from 'react';
import { ArrowLeft, FileText, Upload, Send } from 'lucide-react';
import type { Language } from '../../App';

interface PDFChatToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: { 
    title: 'Chat with PDF', 
    uploadBtn: 'Upload PDF', 
    askPlaceholder: 'Ask a question about your PDF...', 
    send: 'Send',
    uploading: 'Uploading...',
    processing: 'Processing...'
  },
  hi: { 
    title: 'PDF से बातचीत', 
    uploadBtn: 'PDF अपलोड करें', 
    askPlaceholder: 'अपने PDF के बारे में सवाल पूछें...', 
    send: 'भेजें',
    uploading: 'अपलोड हो रहा है...',
    processing: 'प्रोसेस हो रहा है...'
  },
  gu: { 
    title: 'PDF સાથે ચેટ', 
    uploadBtn: 'PDF અપલોડ કરો', 
    askPlaceholder: 'તમારા PDF વિશે પ્રશ્ન પૂછો...', 
    send: 'મોકલો',
    uploading: 'અપલોડ થઈ રહ્યું છે...',
    processing: 'પ્રોસેસ થઈ રહ્યું છે...'
  },
};

const API_BASE_URL = 'https://ai-tool-hub-4a7n.onrender.com';

export function PDFChatTool({ onBack, language }: PDFChatToolProps) {
  const t = translations[language];
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFile = useRef<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadedFile.current = file;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', '');

    try {
      const response = await fetch(`${API_BASE_URL}/ai/pdf-chat`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setPdfUploaded(true);
        setPdfText(data.pdf_length);
      } else {
        alert('Failed to upload PDF');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Connection error. Make sure backend is running.');
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim() || !uploadedFile.current) return;
    
    const userMessage = question;
    setMessages([...messages, { type: 'user', text: userMessage }]);
    setQuestion('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', uploadedFile.current);
    formData.append('question', userMessage);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/pdf-chat`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { type: 'ai', text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { type: 'ai', text: 'Sorry, I could not find an answer.' }]);
      }
    } catch (error) {
      console.error('Question error:', error);
      setMessages(prev => [...prev, { type: 'ai', text: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <FileText className="w-6 h-6 text-purple-600" />
          <h1 className="text-xl">{t.title}</h1>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {!pdfUploaded ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-3 p-12 border-4 border-dashed border-purple-300 rounded-2xl hover:bg-purple-50 transition disabled:bg-gray-100"
            >
              <Upload className="w-16 h-16 text-purple-600" />
              <div className="text-2xl">{uploading ? t.uploading : t.uploadBtn}</div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 mb-4 overflow-y-auto min-h-[400px] max-h-[500px]">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  PDF uploaded successfully! Ask any question about your document.
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-4 rounded-2xl max-w-[80%] ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-left mb-4">
                  <div className="inline-block p-4 rounded-2xl bg-gray-100">
                    {t.processing}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-4 flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleAsk()}
                placeholder={t.askPlaceholder}
                disabled={loading}
                className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
              />
              <button 
                onClick={handleAsk} 
                disabled={loading || !question.trim()}
                className="px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:bg-gray-300"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
