import { useState } from 'react';
import { ArrowLeft, HelpCircle, Send } from 'lucide-react';
import type { Language } from '../../App';

interface AskQuestionToolProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: { 
    title: 'Ask a Question', 
    placeholder: 'Type your question here...', 
    send: 'Get Answer',
    processing: 'Thinking...'
  },
  hi: { 
    title: 'सवाल पूछें', 
    placeholder: 'यहां अपना सवाल टाइप करें...', 
    send: 'जवाब पाएं',
    processing: 'सोच रहे हैं...'
  },
  gu: { 
    title: 'પ્રશ્ન પૂછો', 
    placeholder: 'અહીં તમારો પ્રશ્ન ટાઈપ કરો...', 
    send: 'જવાબ મેળવો',
    processing: 'વિચારી રહ્યા છે...'
  },
};

const API_BASE_URL = 'https://ai-tool-hub-4a7n.onrender.com';

export function AskQuestionTool({ onBack, language }: AskQuestionToolProps) {
  const t = translations[language];
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; text: string }>>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    const userQuestion = question;
    setMessages(prev => [...prev, { type: 'user', text: userQuestion }]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/ask-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userQuestion }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { type: 'ai', text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { type: 'ai', text: 'Sorry, I could not answer that question.' }]);
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
          <HelpCircle className="w-6 h-6 text-orange-600" />
          <h1 className="text-xl">{t.title}</h1>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col">
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 mb-4 overflow-y-auto min-h-[400px] max-h-[500px]">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Ask me anything! I'll do my best to help you.
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-4 rounded-2xl max-w-[80%] ${msg.type === 'user' ? 'bg-orange-600 text-white' : 'bg-gray-100'}`}>
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
            placeholder={t.placeholder}
            disabled={loading}
            className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none disabled:bg-gray-100"
          />
          <button 
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="px-8 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition disabled:bg-gray-300 flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>{t.send}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
