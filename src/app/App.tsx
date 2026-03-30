import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AIHub } from './components/AIHub';
import { DocumentTools } from './components/DocumentTools';
import { BusinessHub } from './components/BusinessHub';
import { StudentCareerHub } from './components/StudentCareerHub';
import { Footer } from './components/Footer';
import { Login } from './components/Login';

// Tool Pages
import { AITranslationTool } from './components/tools/AITranslationTool';
import { SpellCheckTool } from './components/tools/SpellCheckTool';
import { PDFChatTool } from './components/tools/PDFChatTool';
import { AskQuestionTool } from './components/tools/AskQuestionTool';
//import { ImageGeneratorTool } from './components/tools/ImageGeneratorTool';
//import { VideoGeneratorTool } from './components/tools/VideoGeneratorTool';
import { SummarizeTool } from './components/tools/SummarizeTool';
import { SpeechToTextTool } from './components/tools/SpeechToTextTool';
import { ImageOCRTool } from './components/tools/ImageOCRTool';
import { PDFConverterTool } from './components/tools/PDFConverterTool';
import { InvoiceTool } from './components/tools/InvoiceTool';
import { CareerWizard } from './components/tools/CareerWizard';

export type Language = 'en' | 'hi' | 'gu';
export type ActiveTool = null | 'translation' | 'spellcheck' | 'pdfchat' | 'askquestion' | 'imageGenerator' | 'videoGenerator' | 'summarize' | 'speechToText' | 'imageOCR' | 'pdfConverter' | 'invoice' | 'career';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Show login page
  if (showLogin) {
    return <Login onBack={() => setShowLogin(false)} onLogin={handleLogin} language={language} />;
  }

  // Tool page rendering
  if (activeTool === 'translation') {
    return <AITranslationTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'spellcheck') {
    return <SpellCheckTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'pdfchat') {
    return <PDFChatTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'askquestion') {
    return <AskQuestionTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'imageGenerator') {
    return <ImageGeneratorTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'videoGenerator') {
    return <VideoGeneratorTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'summarize') {
    return <SummarizeTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'speechToText') {
    return <SpeechToTextTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'imageOCR') {
    return <ImageOCRTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'pdfConverter') {
    return <PDFConverterTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'invoice') {
    return <InvoiceTool onBack={() => setActiveTool(null)} language={language} />;
  }
  if (activeTool === 'career') {
    return <CareerWizard onBack={() => setActiveTool(null)} language={language} />;
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      <Header 
        language={language} 
        onLanguageChange={setLanguage}
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      
      <main>
        <Hero onNavigate={setActiveTool} language={language} />
        <AIHub onToolSelect={setActiveTool} language={language} />
        <DocumentTools onToolSelect={setActiveTool} language={language} />
        <BusinessHub onToolSelect={setActiveTool} language={language} />
        <StudentCareerHub onToolSelect={setActiveTool} language={language} />
      </main>

      <Footer language={language} />
    </div>
  );
}