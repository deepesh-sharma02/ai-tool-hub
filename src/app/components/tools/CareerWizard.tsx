import { useState } from 'react';
import { ArrowLeft, GraduationCap, ArrowRight, ExternalLink } from 'lucide-react';
import type { Language } from '../../App';

interface CareerWizardProps {
  onBack: () => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Career Guide',
    step1: 'What is your age?',
    step2: 'What are you interested in?',
    step3: 'What is your education level?',
    next: 'Next',
    back: 'Back',
    getResults: 'Get Career Roadmap',
    loading: 'Analyzing...',
    resultTitle: 'Your Personalized Career Roadmap',
    nextSteps: 'Next Steps',
    skills: 'Skills to Develop',
    resources: 'Free Resources',
    timeline: 'Timeline',
    advice: 'Personalized Advice',
    tech: 'Technology',
    medical: 'Medical',
    govt: 'Government Job',
    business: 'Business',
    arts: 'Arts & Creative',
    class10: '10th Standard',
    class12: '12th Standard',
    graduate: 'Graduate',
    postgrad: 'Post Graduate',
  },
  hi: {
    title: 'करियर गाइड',
    step1: 'आपकी उम्र क्या है?',
    step2: 'आपकी रुचि किसमें है?',
    step3: 'आपकी शिक्षा का स्तर क्या है?',
    next: 'अगला',
    back: 'पीछे',
    getResults: 'करियर रोडमैप प्राप्त करें',
    loading: 'विश्लेषण हो रहा है...',
    resultTitle: 'आपका व्यक्तिगत करियर रोडमैप',
    nextSteps: 'अगले कदम',
    skills: 'विकसित करने के लिए कौशल',
    resources: 'निःशुल्क संसाधन',
    timeline: 'समय सीमा',
    advice: 'व्यक्तिगत सलाह',
    tech: 'तकनीक',
    medical: 'चिकित्सा',
    govt: 'सरकारी नौकरी',
    business: 'व्यापार',
    arts: 'कला और रचनात्मक',
    class10: '10वीं कक्षा',
    class12: '12वीं कक्षा',
    graduate: 'स्नातक',
    postgrad: 'स्नातकोत्तर',
  },
  gu: {
    title: 'કારકિર્દી માર્ગદર્શિકા',
    step1: 'તમારી ઉંમર શું છે?',
    step2: 'તમને કયામાં રસ છે?',
    step3: 'તમારું શિક્ષણ સ્તર શું છે?',
    next: 'આગળ',
    back: 'પાછળ',
    getResults: 'કારકિર્દી રોડમેપ મેળવો',
    loading: 'વિશ્લેષણ થઈ રહ્યું છે...',
    resultTitle: 'તમારો વ્યક્તિગત કારકિર્દી રોડમેપ',
    nextSteps: 'આગળના પગલાં',
    skills: 'વિકસાવવા માટે કૌશલ્યો',
    resources: 'મફત સંસાધનો',
    timeline: 'સમયરેખા',
    advice: 'વ્યક્તિગત સલાહ',
    tech: 'ટેકનોલોજી',
    medical: 'તબીબી',
    govt: 'સરકારી નોકરી',
    business: 'બિઝનેસ',
    arts: 'કલા અને સર્જનાત્મક',
    class10: '10મું ધોરણ',
    class12: '12મું ધોરણ',
    graduate: 'સ્નાતક',
    postgrad: 'અનુસ્નાતક',
  },
};

const API_BASE_URL = 'https://ai-tool-hub-4a7n.onrender.com/api/career/recommend';

export function CareerWizard({ onBack, language }: CareerWizardProps) {
  const t = translations[language];
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number | null>(null);
  const [interest, setInterest] = useState<string>('');
  const [education, setEducation] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [careerData, setCareerData] = useState<any>(null);

  const ageOptions = Array.from({ length: 20 }, (_, i) => i + 14);
  
  const interests = [
    { id: 'tech', label: t.tech, icon: '💻' },
    { id: 'medical', label: t.medical, icon: '⚕️' },
    { id: 'govt', label: t.govt, icon: '🏛️' },
    { id: 'business', label: t.business, icon: '💼' },
    { id: 'arts', label: t.arts, icon: '🎨' },
  ];

  const educationLevels = [
    { id: '10th', label: t.class10 },
    { id: '12th', label: t.class12 },
    { id: 'graduate', label: t.graduate },
    { id: 'postgrad', label: t.postgrad },
  ];

  const handleFinish = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/career/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: age,
          interest: interest,
          education: education,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCareerData(data);
        setShowResult(true);
      } else {
        alert('Failed to get career recommendation');
      }
    } catch (error) {
      console.error('Career error:', error);
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!careerData) return null;

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl mb-6">{t.resultTitle}</h2>

        <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border-2 border-orange-200">
          <h3 className="text-lg mb-2">{careerData.current_step}</h3>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3 flex items-center gap-2">
            📍 {t.nextSteps}
          </h3>
          <ul className="space-y-2">
            {careerData.next_steps?.map((step: string, idx: number) => (
              <li key={idx} className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                {idx + 1}. {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3 flex items-center gap-2">
            🎯 {t.skills}
          </h3>
          <div className="flex flex-wrap gap-2">
            {careerData.required_skills?.map((skill: string, idx: number) => (
              <span key={idx} className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3 flex items-center gap-2">
            📚 {t.resources}
          </h3>
          <div className="space-y-2">
            {careerData.free_resources?.map((resource: any, idx: number) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border-2 border-purple-200 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{resource.name}</div>
                    <div className="text-sm text-gray-600">{resource.type}</div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-purple-600" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg mb-3 flex items-center gap-2">
            ⏱️ {t.timeline}
          </h3>
          <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <p className="text-lg">{careerData.timeline}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg mb-3 flex items-center gap-2">
            💡 {t.advice}
          </h3>
          <ul className="space-y-2">
            {careerData.personalized_advice?.map((advice: string, idx: number) => (
              <li key={idx} className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                • {advice}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => {
            setShowResult(false);
            setStep(1);
            setAge(null);
            setInterest('');
            setEducation('');
          }}
          className="w-full mt-6 bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 transition"
        >
          Start New Search
        </button>
      </div>
    );
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <GraduationCap className="w-6 h-6 text-orange-600" />
            <h1 className="text-xl">{t.title}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {renderResult()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <GraduationCap className="w-6 h-6 text-orange-600" />
          <h1 className="text-xl">{t.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8 flex justify-between items-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 ${step > s ? 'bg-orange-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-2xl mb-6">{t.step1}</h2>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {ageOptions.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAge(a)}
                    className={`p-4 rounded-xl border-2 transition ${age === a ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-gray-300 hover:border-orange-400'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl mb-6">{t.step2}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interests.map((int) => (
                  <button
                    key={int.id}
                    onClick={() => setInterest(int.id)}
                    className={`p-6 rounded-xl border-2 transition ${interest === int.id ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-gray-300 hover:border-orange-400'}`}
                  >
                    <div className="text-4xl mb-2">{int.icon}</div>
                    <div className="text-lg">{int.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl mb-6">{t.step3}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {educationLevels.map((edu) => (
                  <button
                    key={edu.id}
                    onClick={() => setEducation(edu.id)}
                    className={`p-6 rounded-xl border-2 transition ${education === edu.id ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-gray-300 hover:border-orange-400'}`}
                  >
                    <div className="text-lg">{edu.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-4 rounded-xl transition"
              >
                {t.back}
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? age === null : step === 2 ? !interest : !education}
                className="flex-1 bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {t.next}
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!education || loading}
                className="flex-1 bg-orange-600 text-white py-4 rounded-xl hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? t.loading : t.getResults}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
