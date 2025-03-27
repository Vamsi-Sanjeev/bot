import React, { useState, useEffect, useRef } from 'react';
import { FileUpload } from './components/FileUpload';
import { ToolSelector } from './components/ToolSelector';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import { TimelineGuide } from './components/TimelineGuide';
import { Bot, Moon, Sun, Sparkles, BookOpen, Brain, ListChecks, ChevronDown, Info, HelpCircle, ChevronRight } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { useChatStore } from './store/chatStore';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [showTools, setShowTools] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { setInputText, selectedTool, inputText } = useChatStore();
  
  const aboutRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const tools = [
    {
      id: 'summarize',
      name: 'Summarize',
      icon: BookOpen,
      description: 'Generate concise summaries',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      icon: Brain,
      description: 'Create study flashcards',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      id: 'quiz',
      name: 'Quiz',
      icon: ListChecks,
      description: 'Generate practice questions',
      gradient: 'from-green-500 to-green-600',
    },
  ];

  const faqs = [
    {
      question: "What types of files can I upload?",
      answer: "You can upload text files (.txt), PDFs (.pdf), and images (.png, .jpg, .jpeg). Our system will automatically extract text from these files for processing."
    },
    {
      question: "How does the summarization tool work?",
      answer: "The summarization tool analyzes your text and extracts the most important information, creating concise summaries of varying lengths (short, medium, or long) while maintaining the key points."
    },
    {
      question: "Can I customize the quiz questions?",
      answer: "Yes! You can customize the quiz type (multiple-choice, true/false, or fill-in-the-blanks), difficulty level, and number of questions to match your study needs."
    },
    {
      question: "Are my study materials saved?",
      answer: "Currently, all generated content is session-based. We recommend downloading your materials using the download button if you want to save them for later use."
    },
    {
      question: "Is there a limit to how much text I can process?",
      answer: "While there's no strict limit, we recommend processing text in chunks of 2000-3000 words for optimal results and better organization of your study materials."
    }
  ];

  const handleTextConfirm = () => {
    setShowConfirmation(false);
    setShowTools(true);
  };

  const handleTextInput = (text: string) => {
    setInputText(text);
    setShowConfirmation(true);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition > windowHeight * 0.5) {
        setShowGuide(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900'
    }`}>
      <div className={`max-w-6xl mx-auto backdrop-blur-sm min-h-screen shadow-2xl flex flex-col ${
        theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'
      }`}>
        <header className={`flex flex-col items-center gap-4 p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  Splan
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Study Smart
                </p>
              </div>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollToSection(aboutRef)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
              
              <button
                onClick={() => scrollToSection(faqRef)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-500'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent animate-float">
                Your Learning Assistant
              </h2>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-float" />
            </div>
            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Transform any text into interactive study materials
            </p>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col">
          {!showConfirmation && !showTools ? (
            <div className="flex-1 grid md:grid-cols-2 gap-8 p-8 animate-fade-in">
              <div className="space-y-4">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Enter Your Text
                </h2>
                <textarea
                  className={`w-full h-64 p-4 rounded-xl border-2 transition-all duration-300 resize-none ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-800 focus:border-blue-500'
                  }`}
                  placeholder="Paste your study material here..."
                  onChange={(e) => {
                    const text = e.target.value.trim();
                    if (text.length > 0) {
                      handleTextInput(text);
                    }
                  }}
                />
              </div>

              <div className="space-y-4">
                <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Upload PDF or Image
                </h2>
                <div className="h-64">
                  <FileUpload onFileProcessed={handleTextInput} />
                </div>
              </div>
            </div>
          ) : showConfirmation ? (
            <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
              <div className={`max-w-2xl w-full p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <h2 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Confirm Your Text
                </h2>
                <div className={`p-4 rounded-lg mb-6 max-h-60 overflow-y-auto ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'
                }`}>
                  {inputText}
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    Edit Text
                  </button>
                  <button
                    onClick={handleTextConfirm}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex">
              <div className={`w-1/4 border-r overflow-y-auto transition-all duration-500 ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } ${selectedTool ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                <ToolSelector />
              </div>

              <div className="flex-1 flex flex-col">
                {!selectedTool ? (
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center space-y-8 animate-fade-in">
                      <h2 className={`text-2xl font-bold ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        Choose Your Learning Tool
                      </h2>
                      <div className="grid grid-cols-3 gap-8 max-w-4xl">
                        {tools.map((tool) => (
                          <button
                            key={tool.id}
                            onClick={() => useChatStore.getState().setSelectedTool(tool.id)}
                            className={`group p-6 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                            } shadow-lg hover:shadow-xl`}
                          >
                            <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${tool.gradient} 
                              flex items-center justify-center mb-4 transition-transform duration-300 
                              group-hover:scale-110`}>
                              <tool.icon className="w-8 h-8 text-white" />
                            </div>
                            <div className={`text-lg font-semibold mb-2 ${
                              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                            }`}>
                              {tool.name}
                            </div>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {tool.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      <ChatWindow />
                    </div>
                    <ChatInput />
                  </>
                )}
              </div>
            </div>
          )}

          {/* How-To Guide Section */}
          <div className={`transition-all duration-700 ease-in-out ${
            showGuide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div ref={aboutRef} className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-12`}>
              <div className="max-w-4xl mx-auto">
                <h2 className={`text-3xl font-bold mb-12 text-center ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  How to Use Splan
                </h2>
                <TimelineGuide theme={theme} />
              </div>
            </div>

            {/* FAQ Section */}
            <div ref={faqRef} className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-12 bg-gradient-to-br ${
              theme === 'dark' ? 'from-purple-900/50 to-blue-900/50' : 'from-purple-50 to-blue-50'
            }`}>
              <div className="max-w-4xl mx-auto">
                <h2 className={`text-3xl font-bold mb-12 text-center ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-300 ${
                        theme === 'dark' ? 'hover:bg-gray-800/50' : 'hover:bg-white/50'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className={`w-full p-6 rounded-xl flex items-center justify-between ${
                          expandedFaq === index
                            ? theme === 'dark'
                              ? 'bg-gray-800 text-white'
                              : 'bg-white text-gray-900'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <h3 className="text-lg font-semibold text-left">{faq.question}</h3>
                        <ChevronRight
                          className={`w-5 h-5 transition-transform duration-300 ${
                            expandedFaq === index ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          expandedFaq === index ? 'max-h-48' : 'max-h-0'
                        }`}
                      >
                        <p className={`px-6 pb-6 ${
                          theme === 'dark'
                            ? 'text-gray-400 bg-gray-800'
                            : 'text-gray-600 bg-white'
                        }`}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className={`mt-12 flex items-center gap-2 mx-auto px-6 py-3 rounded-xl 
                transition-all duration-300 transform hover:scale-105 ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <ChevronDown className="w-5 h-5" />
              <span>Back to Top</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;