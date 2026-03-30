import { Globe, CheckCircle, FileText, HelpCircle, FileStack, Mic } from 'lucide-react';
import type { Language, ActiveTool } from '../App';

interface AIHubProps {
  onToolSelect: (tool: ActiveTool) => void;
  language: Language;
}

const translations = {
  en: {
    title: 'AI Hub',
    subtitle: 'Choose what you want to do',
    translation: 'AI Translation',
    translationDesc: 'Translate to any language',
    spellcheck: 'Spell Check',
    spellcheckDesc: 'Fix spelling & grammar',
    pdfchat: 'Chat with PDF',
    pdfchatDesc: 'Ask questions about your PDF',
    askquestion: 'Ask a Question',
    askquestionDesc: 'Get instant answers',
    summarize: 'Summarize Document',
    summarizeDesc: 'Get quick summary',
    speech: 'Speech ↔ Text',
    speechDesc: 'Convert speech and text',
  },
  hi: {
    title: 'एआई हब',
    subtitle: 'चुनें कि आप क्या करना चाहते हैं',
    translation: 'एआई अनुवाद',
    translationDesc: 'किसी भी भाषा में अनुवाद करें',
    spellcheck: 'स्पेलिंग जांच',
    spellcheckDesc: 'वर्तनी और व्याकरण ठीक करें',
    pdfchat: 'PDF से बातचीत',
    pdfchatDesc: 'अपने PDF के बारे में सवाल पूछें',
    askquestion: 'सवाल पूछें',
    askquestionDesc: 'तुरंत जवाब पाएं',
    imageGen: 'छवि बनाएं',
    imageGenDesc: 'टेक्स्ट से छवि बनाएं',
    videoGen: 'वीडियो बनाएं',
    videoGenDesc: 'वीडियो सामग्री तैयार करें',
    summarize: 'दस्तावेज़ सारांश',
    summarizeDesc: 'त्वरित सारांश प्राप्त करें',
    speech: 'भाषण ↔ टेक्स्ट',
    speechDesc: 'भाषण और टेक्स्ट बदलें',
  },
  gu: {
    title: 'એઆઈ હબ',
    subtitle: 'તમે શું કરવા માંગો છો તે પસંદ કરો',
    translation: 'એઆઈ અનુવાદ',
    translationDesc: 'કોઈપણ ભાષામાં અનુવાદ કરો',
    spellcheck: 'સ્પેલિંગ તપાસ',
    spellcheckDesc: 'જોડણી અને વ્યાકરણ ઠીક કરો',
    pdfchat: 'PDF સાથે ચેટ',
    pdfchatDesc: 'તમારા PDF વિશે પ્રશ્નો પૂછો',
    askquestion: 'પ્રશ્ન પૂછો',
    askquestionDesc: 'તાત્કાલિક જવાબ મેળવો',
    imageGen: 'છબી બનાવો',
    imageGenDesc: 'ટેક્સ્ટથી છબી બનાવો',
    videoGen: 'વિડિઓ બનાવો',
    videoGenDesc: 'વિડિઓ સામગ્રી બનાવો',
    summarize: 'દસ્તાવેજ સારાંશ',
    summarizeDesc: 'ઝડપી સારાંશ મેળવો',
    speech: 'ભાષણ ↔ ટેક્સ્ટ',
    speechDesc: 'ભાષણ અને ટેક્સ્ટ રૂપાંતર',
  },
};

export function AIHub({ onToolSelect, language }: AIHubProps) {
  const t = translations[language];

  const tools = [
    { id: 'translation' as ActiveTool, icon: Globe, title: t.translation, desc: t.translationDesc, color: 'blue' },
    { id: 'spellcheck' as ActiveTool, icon: CheckCircle, title: t.spellcheck, desc: t.spellcheckDesc, color: 'green' },
    { id: 'pdfchat' as ActiveTool, icon: FileText, title: t.pdfchat, desc: t.pdfchatDesc, color: 'purple' },
    { id: 'askquestion' as ActiveTool, icon: HelpCircle, title: t.askquestion, desc: t.askquestionDesc, color: 'orange' },
    { id: 'summarize' as ActiveTool, icon: FileStack, title: t.summarize, desc: t.summarizeDesc, color: 'indigo' },
    { id: 'speechToText' as ActiveTool, icon: Mic, title: t.speech, desc: t.speechDesc, color: 'teal' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    green: 'bg-green-50 hover:bg-green-100 border-green-200',
    purple: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    orange: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    pink: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
    red: 'bg-red-50 hover:bg-red-100 border-red-200',
    indigo: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
    teal: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
  };

  const iconColorMap: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    pink: 'text-pink-600',
    red: 'text-red-600',
    indigo: 'text-indigo-600',
    teal: 'text-teal-600',
  };

  return (
    <section id="ai-hub" className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-3">🧠 {t.title}</h2>
        <p className="text-gray-600 text-lg">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={`p-6 rounded-2xl border-2 transition ${colorMap[tool.color]} text-left`}
          >
            <tool.icon className={`w-12 h-12 mb-4 ${iconColorMap[tool.color]}`} />
            <h3 className="mb-2">{tool.title}</h3>
            <p className="text-sm text-gray-600">{tool.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
