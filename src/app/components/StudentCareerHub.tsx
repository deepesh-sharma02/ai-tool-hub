import { GraduationCap, Compass, BookOpen, TrendingUp } from 'lucide-react';
import type { Language, ActiveTool } from '../App';

interface StudentCareerHubProps {
  onToolSelect: (tool: ActiveTool) => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Student Career Hub',
    subtitle: 'Find your perfect career path',
    careerGuide: 'Career Guide',
    careerGuideDesc: 'Get personalized career roadmap',
    exploreOptions: 'Explore Careers',
    exploreOptionsDesc: 'Discover different career paths',
    freeResources: 'Free Resources',
    freeResourcesDesc: 'Access study materials',
    skillDev: 'Skill Development',
    skillDevDesc: 'Learn new skills',
    startBtn: 'Start Career Quiz',
    startDesc: 'Answer a few questions to get your personalized career roadmap',
  },
  hi: {
    title: 'छात्र करियर हब',
    subtitle: 'अपना सही करियर खोजें',
    careerGuide: 'करियर गाइड',
    careerGuideDesc: 'व्यक्तिगत करियर रोडमैप प्राप्त करें',
    exploreOptions: 'करियर खोजें',
    exploreOptionsDesc: 'विभिन्न करियर पथ खोजें',
    freeResources: 'मुफ्त संसाधन',
    freeResourcesDesc: 'अध्ययन सामग्री प्राप्त करें',
    skillDev: 'कौशल विकास',
    skillDevDesc: 'नए कौशल सीखें',
    startBtn: 'करियर क्विज शुरू करें',
    startDesc: 'अपना व्यक्तिगत करियर रोडमैप पाने के लिए कुछ सवालों के जवाब दें',
  },
  gu: {
    title: 'વિદ્યાર્થી કારકિર્દી હબ',
    subtitle: 'તમારો સંપૂર્ણ કારકિર્દી માર્ગ શોધો',
    careerGuide: 'કારકિર્દી માર્ગદર્શિકા',
    careerGuideDesc: 'વ્યક્તિગત કારકિર્દી રોડમેપ મેળવો',
    exploreOptions: 'કારકિર્દી શોધો',
    exploreOptionsDesc: 'વિવિધ કારકિર્દી માર્ગો શોધો',
    freeResources: 'મફત સંસાધનો',
    freeResourcesDesc: 'અભ્યાસ સામગ્રી એક્સેસ કરો',
    skillDev: 'કુશળતા વિકાસ',
    skillDevDesc: 'નવી કુશળતા શીખો',
    startBtn: 'કારકિર્દી ક્વિઝ શરૂ કરો',
    startDesc: 'તમારો વ્યક્તિગત કારકિર્દી રોડમેપ મેળવવા માટે કેટલાક પ્રશ્નોના જવાબ આપો',
  },
};

export function StudentCareerHub({ onToolSelect, language }: StudentCareerHubProps) {
  const t = translations[language];

  return (
    <section id="student-career" className="max-w-7xl mx-auto px-4 py-16 bg-white/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-3">🎓 {t.title}</h2>
        <p className="text-gray-600 text-lg">{t.subtitle}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-8 rounded-2xl mb-8 text-center">
          <GraduationCap className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl mb-4">{t.startBtn}</h3>
          <p className="mb-6 opacity-90">{t.startDesc}</p>
          <button
            onClick={() => onToolSelect('career')}
            className="bg-white text-orange-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition"
          >
            {t.startBtn} →
          </button>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onToolSelect('career')}
            className="p-6 bg-blue-50 hover:bg-blue-100 rounded-2xl border-2 border-blue-200 transition text-left"
          >
            <Compass className="w-10 h-10 text-blue-600 mb-3" />
            <h4 className="mb-2">{t.exploreOptions}</h4>
            <p className="text-sm text-gray-600">{t.exploreOptionsDesc}</p>
          </button>

          <button
            onClick={() => onToolSelect('career')}
            className="p-6 bg-green-50 hover:bg-green-100 rounded-2xl border-2 border-green-200 transition text-left"
          >
            <BookOpen className="w-10 h-10 text-green-600 mb-3" />
            <h4 className="mb-2">{t.freeResources}</h4>
            <p className="text-sm text-gray-600">{t.freeResourcesDesc}</p>
          </button>

          <button
            onClick={() => onToolSelect('career')}
            className="p-6 bg-purple-50 hover:bg-purple-100 rounded-2xl border-2 border-purple-200 transition text-left"
          >
            <TrendingUp className="w-10 h-10 text-purple-600 mb-3" />
            <h4 className="mb-2">{t.skillDev}</h4>
            <p className="text-sm text-gray-600">{t.skillDevDesc}</p>
          </button>
        </div>
      </div>
    </section>
  );
}
