import { useState } from 'react';
import { ChevronDown, ChevronUp, Image, FileText, Edit } from 'lucide-react';
import type { Language, ActiveTool } from '../App';

interface DocumentToolsProps {
  onToolSelect: (tool: ActiveTool) => void;
  language: Language;
}

const translations = {
  en: {
    title: 'Document Tools',
    subtitle: 'Process and convert your documents',
    imageOCR: 'Image & OCR Tools',
    pdfTools: 'PDF Tools',
    editConvert: 'Edit & Convert',
    imageOCRDesc: 'Extract text from images',
    pdfToolsDesc: 'Convert and edit PDFs',
    editConvertDesc: 'Edit documents and convert formats',
  },
  hi: {
    title: 'दस्तावेज़ उपकरण',
    subtitle: 'अपने दस्तावेज़ों को संसाधित और परिवर्तित करें',
    imageOCR: 'छवि और OCR उपकरण',
    pdfTools: 'PDF उपकरण',
    editConvert: 'संपादित और परिवर्तित करें',
    imageOCRDesc: 'छवियों से टेक्स्ट निकालें',
    pdfToolsDesc: 'PDF परिवर्तित और संपादित करें',
    editConvertDesc: 'दस्तावेज़ संपादित करें और प्रारूप बदलें',
  },
  gu: {
    title: 'દસ્તાવેજ સાધનો',
    subtitle: 'તમારા દસ્તાવેજોને પ્રોસેસ અને કન્વર્ટ કરો',
    imageOCR: 'છબી અને OCR સાધનો',
    pdfTools: 'PDF સાધનો',
    editConvert: 'સંપાદિત કરો અને રૂપાંતર કરો',
    imageOCRDesc: 'છબીઓમાંથી ટેક્સ્ટ કાઢો',
    pdfToolsDesc: 'PDF રૂપાંતર અને સંપાદિત કરો',
    editConvertDesc: 'દસ્તાવેજો સંપાદિત કરો અને ફોર્મેટ બદલો',
  },
};

export function DocumentTools({ onToolSelect, language }: DocumentToolsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const t = translations[language];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const ocrTools = language === 'en' ? [
    { name: 'Image OCR (JPG/PNG)', desc: 'Upload image → Get text' },
    { name: 'OCR PDF to Text', desc: 'Convert scanned PDF to text' },
    { name: 'Handwriting OCR', desc: 'Extract handwritten text' },
    { name: 'Table Extraction', desc: 'Extract tables from images' },
    { name: 'Multi-Language OCR', desc: 'Recognize multiple languages' },
    { name: 'Batch OCR', desc: 'Process multiple files' },
    { name: 'Webcam OCR', desc: 'Capture and extract text' },
  ] : language === 'hi' ? [
    { name: 'छवि OCR (JPG/PNG)', desc: 'छवि अपलोड करें → टेक्स्ट प्राप्त करें' },
    { name: 'OCR PDF से टेक्स्ट', desc: 'स्कैन किए गए PDF को टेक्स्ट में बदलें' },
    { name: 'हस्तलेखन OCR', desc: 'हस्तलिखित टेक्स्ट निकालें' },
    { name: 'तालिका निष्कर्षण', desc: 'छवियों से तालिकाएं निकालें' },
    { name: 'बहु-भाषा OCR', desc: 'कई भाषाओं को पहचानें' },
    { name: 'बैच OCR', desc: 'कई फाइलें प्रोसेस करें' },
    { name: 'वेबकैम OCR', desc: 'कैप्चर करें और टेक्स्ट निकालें' },
  ] : [
    { name: 'છબી OCR (JPG/PNG)', desc: 'છબી અપલોડ કરો → ટેક્સ્ટ મેળવો' },
    { name: 'OCR PDF થી ટેક્સ્ટ', desc: 'સ્કેન થયેલ PDF ને ટેક્સ્ટમાં કન્વર્ટ કરો' },
    { name: 'હસ્તલેખન OCR', desc: 'હસ્તલિખિત ટેક્સ્ટ કાઢો' },
    { name: 'ટેબલ નિષ્કર્ષણ', desc: 'છબીઓમાંથી ટેબલ કાઢો' },
    { name: 'બહુ-ભાષા OCR', desc: 'બહુવિધ ભાષાઓ ઓળખો' },
    { name: 'બેચ OCR', desc: 'બહુવિધ ફાઇલો પ્રોસેસ કરો' },
    { name: 'વેબકેમ OCR', desc: 'કેપ્ચર કરો અને ટેક્સ્ટ કાઢો' },
  ];

  const pdfTools = language === 'en' ? [
    { name: 'PDF → Word', desc: 'Convert PDF to Word' },
    { name: 'PDF → Excel', desc: 'Convert PDF to Excel' },
    { name: 'PDF → JPG', desc: 'Convert PDF to images' },
    { name: 'Word → PDF', desc: 'Convert Word to PDF' },
    { name: 'Excel → PDF', desc: 'Convert Excel to PDF' },
    { name: 'PPT → PDF', desc: 'Convert PowerPoint to PDF' },
    { name: 'Compress PDF', desc: 'Reduce file size' },
    { name: 'Protect PDF', desc: 'Add password protection' },
    { name: 'Add Watermark', desc: 'Add watermark to PDF' },
    { name: 'Rotate PDF', desc: 'Rotate PDF pages' },
  ] : language === 'hi' ? [
    { name: 'PDF → Word', desc: 'PDF को Word में बदलें' },
    { name: 'PDF → Excel', desc: 'PDF को Excel में बदलें' },
    { name: 'PDF → JPG', desc: 'PDF को छवि में बदलें' },
    { name: 'Word → PDF', desc: 'Word को PDF में बदलें' },
    { name: 'Excel → PDF', desc: 'Excel को PDF में बदलें' },
    { name: 'PPT → PDF', desc: 'PowerPoint को PDF में बदलें' },
    { name: 'PDF संपीड़ित करें', desc: 'फाइल का आकार कम करें' },
    { name: 'PDF सुरक्षित करें', desc: 'पासवर्ड सुरक्षा जोड़ें' },
    { name: 'वॉटरमार्क जोड़ें', desc: 'PDF में वॉटरमार्क जोड़ें' },
    { name: 'PDF घुमाएं', desc: 'PDF पेज घुमाएं' },
  ] : [
    { name: 'PDF → Word', desc: 'PDF ને Word માં કન્વર્ટ કરો' },
    { name: 'PDF → Excel', desc: 'PDF ને Excel માં કન્વર્ટ કરો' },
    { name: 'PDF → JPG', desc: 'PDF ને છબીમાં કન્વર્ટ કરો' },
    { name: 'Word → PDF', desc: 'Word ને PDF માં કન્વર્ટ કરો' },
    { name: 'Excel → PDF', desc: 'Excel ને PDF માં કન્વર્ટ કરો' },
    { name: 'PPT → PDF', desc: 'PowerPoint ને PDF માં કન્વર્ટ કરો' },
    { name: 'PDF સંકુચિત કરો', desc: 'ફાઇલનું કદ ઘટાડો' },
    { name: 'PDF સુરક્ષિત કરો', desc: 'પાસવર્ડ સુરક્ષા ઉમેરો' },
    { name: 'વોટરમાર્ક ઉમેરો', desc: 'PDF માં વોટરમાર્ક ઉમેરો' },
    { name: 'PDF ફેરવો', desc: 'PDF પૃષ્ઠો ફેરવો' },
  ];

  const editTools = language === 'en' ? [
    { name: 'Edit PDF', desc: 'Modify PDF content' },
    { name: 'Edit Documents', desc: 'Edit Word, Excel files' },
    { name: 'Text → Speech', desc: 'Convert text to audio' },
  ] : language === 'hi' ? [
    { name: 'PDF संपादित करें', desc: 'PDF सामग्री संशोधित करें' },
    { name: 'दस्तावेज़ संपादित करें', desc: 'Word, Excel फाइलें संपादित करें' },
    { name: 'टेक्स्ट → भाषण', desc: 'टेक्स्ट को ऑडियो में बदलें' },
  ] : [
    { name: 'PDF સંપાદિત કરો', desc: 'PDF સામગ્રી સુધારો' },
    { name: 'દસ્તાવેજો સંપાદિત કરો', desc: 'Word, Excel ફાઇલો સંપાદિત કરો' },
    { name: 'ટેક્સ્ટ → ભાષણ', desc: 'ટેક્સ્ટને ઓડિયોમાં કન્વર્ટ કરો' },
  ];

  return (
    <section id="document-tools" className="max-w-7xl mx-auto px-4 py-16 bg-white/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl mb-3">📄 {t.title}</h2>
        <p className="text-gray-600 text-lg">{t.subtitle}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Image & OCR Tools */}
        <div className="border-2 border-blue-200 rounded-2xl overflow-hidden bg-white">
          <button
            onClick={() => toggleSection('ocr')}
            className="w-full p-6 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition"
          >
            <div className="flex items-center gap-4">
              <Image className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <h3 className="text-xl">🖼️ {t.imageOCR}</h3>
                <p className="text-sm text-gray-600">{t.imageOCRDesc}</p>
              </div>
            </div>
            {expandedSection === 'ocr' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
          {expandedSection === 'ocr' && (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ocrTools.map((tool, idx) => (
                <button
                  key={idx}
                  onClick={() => onToolSelect('imageOCR')}
                  className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-left"
                >
                  <div className="mb-1">{tool.name}</div>
                  <div className="text-sm text-gray-600">{tool.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* PDF Tools */}
        <div className="border-2 border-green-200 rounded-2xl overflow-hidden bg-white">
          <button
            onClick={() => toggleSection('pdf')}
            className="w-full p-6 flex items-center justify-between bg-green-50 hover:bg-green-100 transition"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-green-600" />
              <div className="text-left">
                <h3 className="text-xl">📄 {t.pdfTools}</h3>
                <p className="text-sm text-gray-600">{t.pdfToolsDesc}</p>
              </div>
            </div>
            {expandedSection === 'pdf' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
          {expandedSection === 'pdf' && (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pdfTools.map((tool, idx) => (
                <button
                  key={idx}
                  onClick={() => onToolSelect('pdfConverter')}
                  className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition text-left"
                >
                  <div className="mb-1">{tool.name}</div>
                  <div className="text-sm text-gray-600">{tool.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Edit & Convert */}
        <div className="border-2 border-purple-200 rounded-2xl overflow-hidden bg-white">
          <button
            onClick={() => toggleSection('edit')}
            className="w-full p-6 flex items-center justify-between bg-purple-50 hover:bg-purple-100 transition"
          >
            <div className="flex items-center gap-4">
              <Edit className="w-8 h-8 text-purple-600" />
              <div className="text-left">
                <h3 className="text-xl">✏️ {t.editConvert}</h3>
                <p className="text-sm text-gray-600">{t.editConvertDesc}</p>
              </div>
            </div>
            {expandedSection === 'edit' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </button>
          {expandedSection === 'edit' && (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {editTools.map((tool, idx) => (
                <button
                  key={idx}
                  onClick={() => onToolSelect('pdfConverter')}
                  className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-left"
                >
                  <div className="mb-1">{tool.name}</div>
                  <div className="text-sm text-gray-600">{tool.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
