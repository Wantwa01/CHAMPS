
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import { AuthProvider, useAuth } from './components/DashboardApp';
import DashboardWrapper from './components/DashboardWrapper';
import { StethoscopeIcon, AmbulanceIcon, CalendarIcon, ChatIcon, MapPinIcon, UserIcon } from './components/Icons';
import { User, Role, AmbulanceRequest } from './types';

export type Language = 'EN' | 'CH' | 'TU';
export type Theme = 'light' | 'dark';
export type Page = 'home' | 'login' | 'register' | 'dashboard';

const translations = {
  EN: {
    headerTitle: 'Wezi Medical Centre',
    bookNow: 'Book Now',
    login: 'Login',
    logout: 'Logout',
    heroTitle: 'Personalized Care, Available Anytime.',
    heroSubtitle: 'Welcome to Wezi Medical Centre. We provide high-quality medical care with a focus on patient well-being. How can we help you today?',
    symptomChecker: 'Symptom Checker',
    callAmbulance: 'Call Ambulance',
    scheduleAppointment: 'Schedule Appointment',
    contactSupport: 'Contact Support',
    findDepartment: 'Find Department',
    myWeziPortal: 'MyWezi Portal',
    teamTitle: 'Meet Our Team',
    teamSubtitle: 'Dedicated professionals providing exceptional care.',
    footerAbout: 'Wezi Medical Centre is dedicated to providing top-tier medical services with a personal touch. Our state-of-the-art facility and expert staff are here for you 24/7.',
    quickLinks: 'Quick Links',
    home: 'Home',
    services: 'Services',
    // FIX: Add 'pharmacy' translation.
    pharmacy: 'Pharmacy',
    team: 'Team',
    contactUs: 'Contact Us',
    address: '123 Health St, Wellness City, 12345',
    phone: '(123) 456-7890',
    email: 'contact@wezi.med',
    copyright: '© 2024 Wezi Medical Centre. All rights reserved.',
    serviceHubTitle: 'Patient Service Hub',
    aiAssistantTitle: 'AI-Powered Assistant',
    aiDisclaimer: 'This is an AI assistant for general inquiries and is not a substitute for professional medical advice.',
    aiPlaceholder: 'Ask about our services...',
    send: 'Send',
    departmentDirectoryTitle: 'Department Directory',
    // Login page translations
    loginWelcome: 'Welcome Back',
    loginSubtitle: 'Sign in to access your medical records and services',
    loginUsername: 'Username',
    loginUsernamePlaceholder: 'Enter your username',
    loginUsernameRequired: 'Username is required',
    loginUsernameMinLength: 'Username must be at least 3 characters',
    loginEmail: 'Email Address',
    loginEmailPlaceholder: 'Enter your email',
    loginEmailRequired: 'Email is required',
    loginEmailInvalid: 'Please enter a valid email',
    loginPassword: 'Password',
    loginPasswordPlaceholder: 'Enter your password',
    loginPasswordRequired: 'Password is required',
    loginPasswordMinLength: 'Password must be at least 6 characters',
    loginRememberMe: 'Remember me',
    loginForgotPassword: 'Forgot password?',
    loginSignIn: 'Sign In',
    loginSigningIn: 'Signing in...',
    loginOr: 'or',
    loginWithGoogle: 'Continue with Google',
    loginNoAccount: "Don't have an account?",
    loginSignUp: 'Sign up',
  },
  CH: {
    headerTitle: 'Wezi Medical Centre',
    bookNow: 'Sunganitsani Tsopano',
    login: 'Lowani',
    logout: 'Tulukani',
    heroTitle: 'Chithandizo Chamunthu Payekha, Chopezeka Nthawi Zonse.',
    heroSubtitle: 'Takulandirani ku Wezi Medical Centre. Timapereka chithandizo chamankhwala chapamwamba poganizira kwambiri za odwala. Tingakuthandizeni bwanji lero?',
    symptomChecker: 'Wowunika Zizindikiro',
    callAmbulance: 'Itanani Ambulansi',
    scheduleAppointment: 'Sunganitsani Nthawi',
    contactSupport: 'Funsani Wothandizira',
    findDepartment: 'Pezani Dipatimenti',
    myWeziPortal: 'MyWezi Portal',
    teamTitle: 'Kumanani ndi Gulu Lathu',
    teamSubtitle: 'Akatswiri odzipereka omwe amapereka chisamaliro chapadera.',
    footerAbout: 'Wezi Medical Centre yadzipereka kupereka chithandizo chamankhwala chapamwamba. Malo athu amakono ndi ogwira ntchito ali pano kwa inu 24/7.',
    quickLinks: 'Maulalo Ofulumira',
    home: 'Kunyumba',
    services: 'Ntchito',
    // FIX: Add 'pharmacy' translation.
    pharmacy: 'Malo Olandirira Mankhwala',
    team: 'Gulu',
    contactUs: 'Tilankhule Nafe',
    address: '123 Health St, Wellness City, 12345',
    phone: '(123) 456-7890',
    email: 'contact@wezi.med',
    copyright: '© 2024 Wezi Medical Centre. Ufulu wonse ndi wotetezedwa.',
    serviceHubTitle: 'Malo Othandizira Odwala',
    aiAssistantTitle: 'Mothandizi Wanzeru Wopangidwa',
    aiDisclaimer: 'Uyu ndi wothandizira wa AI pa mafunso wamba ndipo salowa m\'malo mwa upangiri wa akatswiri azachipatala.',
    aiPlaceholder: 'Funsani za ntchito zathu...',
    send: 'Tuma',
    departmentDirectoryTitle: 'Kalozera wa Madipatimenti',
    // Login page translations
    loginWelcome: 'Takulandirani Bwino',
    loginSubtitle: 'Lowani kuti mupeze zolemba zanu za mankhwala ndi ntchito',
    loginUsername: 'Dzina la wogwiritsa',
    loginUsernamePlaceholder: 'Lembani dzina lanu la wogwiritsa',
    loginUsernameRequired: 'Dzina la wogwiritsa ndi lofunika',
    loginUsernameMinLength: 'Dzina la wogwiritsa liyenera kukhala masiku 3 kapena kupitilira',
    loginEmail: 'Imelo',
    loginEmailPlaceholder: 'Lembani imelo yanu',
    loginEmailRequired: 'Imelo ndi yofunika',
    loginEmailInvalid: 'Chonde lembani imelo yovomerezeka',
    loginPassword: 'Mawu achinsinsi',
    loginPasswordPlaceholder: 'Lembani mawu anu achinsinsi',
    loginPasswordRequired: 'Mawu achinsinsi ndi ofunika',
    loginPasswordMinLength: 'Mawu achinsinsi ayenera kukhala osachepera 6',
    loginRememberMe: 'Ndikumbukire',
    loginForgotPassword: 'Mwaiwala mawu achinsinsi?',
    loginSignIn: 'Lowani',
    loginSigningIn: 'Mukulowa...',
    loginOr: 'kapena',
    loginWithGoogle: 'Pitirizani ndi Google',
    loginNoAccount: 'Mulibe akaunti?',
    loginSignUp: 'Lembani',
  },
  TU: {
    headerTitle: 'Wezi Medical Centre',
    bookNow: 'Bookani Tsopano',
    login: 'Lowani',
    logout: 'Tulukani',
    heroTitle: 'Chithandizo Chamunthu Payekha, Chopezeka Nthawi Zonse.',
    heroSubtitle: 'Takulandirani ku Wezi Medical Centre. Timapereka chithandizo chamankhwala chapamwamba poganizira kwambiri za odwala. Tingakuthandizeni bwanji lero?',
    symptomChecker: 'Wowunika Zizindikiro',
    callAmbulance: 'Itanani Ambulansi',
    scheduleAppointment: 'Sunganitsani Nthawi',
    contactSupport: 'Funsani Wothandizira',
    findDepartment: 'Pezani Dipatimenti',
    myWeziPortal: 'MyWezi Portal',
    teamTitle: 'Kumanani ndi Gulu Lathu',
    teamSubtitle: 'Akatswiri odzipereka omwe amapereka chisamaliro chapadera.',
    footerAbout: 'Wezi Medical Centre yadzipereka kupereka chithandizo chamankhwala chapamwamba. Malo athu amakono ndi ogwira ntchito ali pano kwa inu 24/7.',
    quickLinks: 'Maulalo Ofulumira',
    home: 'Kunyumba',
    services: 'Ntchito',
    // FIX: Add 'pharmacy' translation.
    pharmacy: 'Malo Olandirira Mankhwala',
    team: 'Gulu',
    contactUs: 'Tilankhule Nafe',
    address: '123 Health St, Wellness City, 12345',
    phone: '(123) 456-7890',
    email: 'contact@wezi.med',
    copyright: '© 2024 Wezi Medical Centre. Ufulu wonse ndi wotetezedwa.',
    serviceHubTitle: 'Malo Othandizira Odwala',
    aiAssistantTitle: 'Mothandizi Wanzeru Wopangidwa',
    aiDisclaimer: 'Uyu ndi wothandizira wa AI pa mafunso wamba ndipo salowa m\'malo mwa upangiri wa akatswiri azachipatala.',
    aiPlaceholder: 'Funsani za ntchito zathu...',
    send: 'Tuma',
    departmentDirectoryTitle: 'Kalozera wa Madipatimenti',
    // Login page translations
    loginWelcome: 'Takulandirani Bwino',
    loginSubtitle: 'Lowani kuti mupeze zolemba zanu za mankhwala ndi ntchito',
    loginUsername: 'Zina la wogwiritsa',
    loginUsernamePlaceholder: 'Lembani zina lanu la wogwiritsa',
    loginUsernameRequired: 'Zina la wogwiritsa ndi lofunika',
    loginUsernameMinLength: 'Zina la wogwiritsa liyenera kukhala masiku 3 kapena kupitilira',
    loginEmail: 'Imeli',
    loginEmailPlaceholder: 'Lembani imeli yanu',
    loginEmailRequired: 'Imeli ndi yofunika',
    loginEmailInvalid: 'Chonde lembani imeli yovomerezeka',
    loginPassword: 'Chinsinsi',
    loginPasswordPlaceholder: 'Lembani chinsinsi chanu',
    loginPasswordRequired: 'Chinsinsi ndi chofunika',
    loginPasswordMinLength: 'Chinsinsi chiyenera kukhala chosachepera 6',
    loginRememberMe: 'Ndikumbukire',
    loginForgotPassword: 'Mwaluwika chinsinsi?',
    loginSignIn: 'Lowani',
    loginSigningIn: 'Mukulowa...',
    loginOr: 'kapena',
    loginWithGoogle: 'Pitirizani ndi Google',
    loginNoAccount: 'Mulije akaunti?',
    loginSignUp: 'Lembani',
  },
};

export type TranslationSet = typeof translations['EN'];

const teamMembers = [
    { name: 'Dr. Evelyn Reed', specialty: 'Cardiologist' },
    { name: 'Dr. Ben Carter', specialty: 'Neurologist' },
    { name: 'Dr. Olivia Chen', specialty: 'Dentist' },
    { name: 'Dr. Samuel Jones', specialty: 'Pulmonologist' },
];

const departments = [
  { name: 'Emergency', location: 'Ground Floor, West Wing' },
  { name: 'Outpatient Department (OPD)', location: 'Ground Floor, East Wing' },
  { name: 'Admissions (Inpatient)', location: 'First Floor, Main Lobby' },
  { name: 'Antenatal Care', location: 'Second Floor, Women\'s Health Wing' },
  { name: 'Surgical Theatre', location: 'Third Floor, Restricted Access' },
];

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Custom hook for scroll animations
const useScrollAnimation = <T extends HTMLElement>(): [React.RefObject<T>, boolean] => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, isVisible];
};


const QuickActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  isEmergency?: boolean;
}> = ({ icon, title, isEmergency = false }) => {
  const textColor = isEmergency ? 'text-red-500 dark:text-red-400' : 'text-slate-800 dark:text-slate-200';
  const iconBg = isEmergency ? 'bg-red-50 dark:bg-red-900/50' : 'bg-blue-50 dark:bg-blue-900/50';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-700/50 transition-shadow duration-300 p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4">
      <div className={`rounded-full p-4 ${iconBg}`}>
        {icon}
      </div>
      <h3 className={`text-lg font-semibold ${textColor}`}>{title}</h3>
    </div>
  );
};

const SecondaryAction: React.FC<{
  icon: React.ReactNode;
  label: string;
}> = ({ icon, label }) => {
  return (
    <button className="bg-slate-100 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 font-medium rounded-full px-5 py-3 flex items-center gap-2.5 transition-colors duration-200">
      {icon}
      <span>{label}</span>
    </button>
  );
};

const AppContent: React.FC = () => {
  const [language, setLanguage] = useState<Language>('EN');
  const [theme, setTheme] = useState<Theme>('light');
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [quickActionsRef, areQuickActionsVisible] = useScrollAnimation<HTMLElement>();
  const [secondaryActionsRef, areSecondaryActionsVisible] = useScrollAnimation<HTMLElement>();
  const [serviceHubRef, isServiceHubVisible] = useScrollAnimation<HTMLElement>();
  const [teamRef, isTeamVisible] = useScrollAnimation<HTMLElement>();

  const t = translations[language];

  let ai: GoogleGenAI | null = null;
  if (process.env.API_KEY) {
      ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(userPrefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleLogin = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
    } else {
      setCurrentPage('login');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleRegistrationSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  const handleSignUp = () => {
    setCurrentPage('register');
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim() || !ai) return;

    const newUserMessage: ChatMessage = { role: 'user', text: userMessage };
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userMessage,
        config: {
          systemInstruction: "You are a helpful assistant for Wezi Medical Centre, a hospital in Mzuzu, Malawi. Your role is to answer patient questions about our services and department locations. Do not provide medical advice. Be friendly, concise, and professional. The available departments are: Emergency (Ground Floor, West Wing), Outpatient (OPD) (Ground Floor, East Wing), Admissions (First Floor, Main Lobby), Antenatal Care (Second Floor, Women's Health Wing), Surgical Theatre (Third Floor, Restricted Access).",
        },
      });
      
      const modelResponse: ChatMessage = { role: 'model', text: response.text };
      setChatHistory(prev => [...prev, modelResponse]);
    } catch (error) {
      console.error("Error generating content:", error);
      const errorResponse: ChatMessage = { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setChatHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render login page if current page is login
      if (currentPage === 'login') {
      return (
        <LoginPage
          language={language}
          setLanguage={setLanguage}
          t={t}
          theme={theme}
          toggleTheme={toggleTheme}
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={handleBackToHome}
          onSignUp={handleSignUp}
        />
      );
    }

    if (currentPage === 'register') {
      return (
        <RegistrationPage
          language={language}
          setLanguage={setLanguage}
          t={t}
          theme={theme}
          toggleTheme={toggleTheme}
          onRegistrationSuccess={handleRegistrationSuccess}
          onBackToLogin={handleBackToLogin}
        />
      );
    }

  // Render dashboard if current page is dashboard
  if (currentPage === 'dashboard') {
    return <DashboardWrapper />;
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans min-h-screen transition-colors duration-300">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        t={t} 
        theme={theme}
        toggleTheme={toggleTheme}
        isLoggedIn={isLoggedIn}
        toggleLogin={toggleLogin}
      />
      <main className="container mx-auto px-4 py-16 sm:py-20 md:py-24 overflow-x-hidden">
        {/* Hero Section */}
        <section className="text-center mb-20 md:mb-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4 animate-fade-in-up">
            {t.heroTitle}
          </h1>
          <p className="max-w-3xl mx-auto text-slate-600 dark:text-slate-400 text-lg animate-fade-in-up animation-delay-300">
            {t.heroSubtitle}
          </p>
        </section>

        {/* Quick Actions Section */}
        <section 
          ref={quickActionsRef} 
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-20 md:mb-24 transition-all duration-700 ease-out ${areQuickActionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <QuickActionCard icon={<StethoscopeIcon />} title={t.symptomChecker} />
          <QuickActionCard icon={<AmbulanceIcon />} title={t.callAmbulance} isEmergency />
          <QuickActionCard icon={<CalendarIcon />} title={t.scheduleAppointment} />
        </section>

        {/* Secondary Actions Section */}
        <section 
          ref={secondaryActionsRef} 
          className={`flex flex-wrap justify-center items-center gap-4 mb-20 md:mb-24 transition-all duration-700 ease-out delay-200 ${areSecondaryActionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
          <SecondaryAction icon={<ChatIcon />} label={t.contactSupport} />
          <SecondaryAction icon={<MapPinIcon />} label={t.findDepartment} />
          <SecondaryAction icon={<UserIcon />} label={t.myWeziPortal} />
        </section>

        {/* Patient Service Hub Section */}
        <section 
          ref={serviceHubRef}
          className={`max-w-6xl mx-auto mb-20 md:mb-24 transition-all duration-700 ease-out ${isServiceHubVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 text-center mb-12">{t.serviceHubTitle}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* AI Assistant */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">{t.aiAssistantTitle}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{t.aiDisclaimer}</p>
                    <div className="h-72 sm:h-80 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 overflow-y-auto flex flex-col gap-4 mb-4">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`max-w-[85%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white self-end rounded-br-none' : 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 self-start rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        ))}
                         {isLoading && (
                            <div className="self-start flex items-center gap-2">
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            placeholder={t.aiPlaceholder}
                            className="flex-grow bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!ai || isLoading}
                        />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-slate-400" disabled={!ai || isLoading || !userMessage.trim()}>
                            {t.send}
                        </button>
                    </form>
                </div>

                {/* Department Directory */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">{t.departmentDirectoryTitle}</h3>
                    <ul className="space-y-4">
                        {departments.map((dept, index) => (
                            <li key={index} className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">{dept.name}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{dept.location}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        {/* Team Section */}
        <section
          ref={teamRef}
          className={`text-center transition-all duration-700 ease-out ${isTeamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t.teamTitle}</h2>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 text-lg mb-12">{t.teamSubtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                    <div key={index} className="text-center">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                          <UserIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{member.name}</h3>
                        <p className="text-blue-500 dark:text-blue-400">{member.specialty}</p>
                    </div>
                ))}
            </div>
        </section>

      </main>
      <Footer t={t} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
