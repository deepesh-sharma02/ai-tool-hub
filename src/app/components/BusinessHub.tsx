import { Receipt, Calculator, TrendingUp, Send } from 'lucide-react';
import type { Language, ActiveTool } from '../App';

interface BusinessHubProps {
  onToolSelect: (tool: ActiveTool) => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Business Hub',
    subtitle: 'Simple tools for small shops & self-employed',
    createBill: 'Create Bill',
    createBillDesc: 'Generate invoice quickly',
    calculateTax: 'Calculate Tax',
    calculateTaxDesc: 'GST and tax calculator',
    todaySales: "Today's Sales",
    todaySalesDesc: 'Track daily earnings',
    sendWhatsApp: 'Send on WhatsApp',
    sendWhatsAppDesc: 'Share bills instantly',
  },
  hi: {
    title: 'व्यापार हब',
    subtitle: 'छोटी दुकानों और स्व-रोजगार के लिए सरल उपकरण',
    createBill: 'बिल बनाएं',
    createBillDesc: 'जल्दी से चालान तैयार करें',
    calculateTax: 'कर गणना करें',
    calculateTaxDesc: 'GST और कर कैलकुलेटर',
    todaySales: 'आज की बिक्री',
    todaySalesDesc: 'दैनिक कमाई ट्रैक करें',
    sendWhatsApp: 'WhatsApp पर भेजें',
    sendWhatsAppDesc: 'बिल तुरंत साझा करें',
  },
  gu: {
    title: 'બિઝનેસ હબ',
    subtitle: 'નાની દુકાનો અને સ્વ-રોજગાર માટે સરળ સાધનો',
    createBill: 'બિલ બનાવો',
    createBillDesc: 'ઝડપથી ઇન્વૉઇસ બનાવો',
    calculateTax: 'કર ગણતરી કરો',
    calculateTaxDesc: 'GST અને કર કેલ્ક્યુલેટર',
    todaySales: 'આજનું વેચાણ',
    todaySalesDesc: 'દૈનિક કમાણી ટ્રેક કરો',
    sendWhatsApp: 'WhatsApp પર મોકલો',
    sendWhatsAppDesc: 'બિલ તરત જ શેર કરો',
  },
};

export function BusinessHub({ onToolSelect, language }: BusinessHubProps) {
  const t = translations[language];

  const tools = [
    { icon: Receipt, title: t.createBill, desc: t.createBillDesc, color: 'bg-blue-50 hover:bg-blue-100 border-blue-200', iconColor: 'text-blue-600', onClick: () => onToolSelect('invoice') },
    { icon: Calculator, title: t.calculateTax, desc: t.calculateTaxDesc, color: 'bg-green-50 hover:bg-green-100 border-green-200', iconColor: 'text-green-600', onClick: () => onToolSelect('invoice') },
    { icon: TrendingUp, title: t.todaySales, desc: t.todaySalesDesc, color: 'bg-purple-50 hover:bg-purple-100 border-purple-200', iconColor: 'text-purple-600', onClick: () => onToolSelect('invoice') },
    { icon: Send, title: t.sendWhatsApp, desc: t.sendWhatsAppDesc, color: 'bg-green-50 hover:bg-green-100 border-green-200', iconColor: 'text-green-600', onClick: () => onToolSelect('invoice') },
  ];

  return (
    <section id="business-hub" className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-3">🏪 {t.title}</h2>
        <p className="text-gray-600 text-lg">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tools.map((tool, idx) => (
          <button
            key={idx}
            onClick={tool.onClick}
            className={`p-6 rounded-2xl border-2 transition ${tool.color} text-left`}
          >
            <tool.icon className={`w-12 h-12 mb-4 ${tool.iconColor}`} />
            <h3 className="mb-2">{tool.title}</h3>
            <p className="text-sm text-gray-600">{tool.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
