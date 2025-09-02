import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

interface LandingPageProps {
  onLoginClick: () => void;
  onChatbotClick: () => void;
}

const useScrollReveal = () => {
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentSections = sectionsRef.current;
    currentSections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      currentSections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };
};

const useAnimatedCounter = (target: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = target;
          if (start === end) return;

          const incrementTime = (duration / end);
          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
          }, incrementTime);
          
          observer.unobserve(ref.current!);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
};

const LandingHeader: React.FC<{ onLoginClick: () => void; }> = ({ onLoginClick }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const headerOffset = 80; 
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <header className="bg-white/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-40 border-b border-slate-900/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-2.5 cursor-pointer">
          <Icon name="brand" className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Wezi Medical</h1>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#services" onClick={(e) => handleNavClick(e, 'services')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium cursor-pointer">Services</a>
          <a href="#doctors" onClick={(e) => handleNavClick(e, 'doctors')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium cursor-pointer">Doctors</a>
          <a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium cursor-pointer">Testimonials</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-slate-600 hover:text-blue-600 transition-colors font-medium cursor-pointer">Contact Us</a>
        </nav>
        <div className="flex items-center gap-4">
          <button
              onClick={onLoginClick}
              className="bg-red-500 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-md shadow-red-500/20"
            >
              Emergency
            </button>
          <button
            onClick={onLoginClick}
            className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md shadow-blue-500/20"
          >
            Portal Login
          </button>
        </div>
      </div>
    </header>
  );
};


const HeroSection: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
  const addToRefs = useScrollReveal();
  return (
    <section 
      ref={addToRefs} 
      id="home" 
      className="relative min-h-[80vh] md:min-h-screen flex items-center bg-cover bg-center reveal"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160550-2173dba9996a?q=80&w=2070')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-xl p-8 md:p-12 bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50">
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tighter" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                    Take Care of Your Health Anytime, Anywhere.
                </h1>
                <p className="mt-6 text-lg text-slate-700">
                    Wezi Medical Centre offers a seamless digital experience.
                    Book appointments, get instant answers, and navigate our facility with ease.
                </p>
                <div className="mt-10">
                    <button
                        onClick={onLoginClick}
                        className="bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-xl shadow-blue-500/30"
                    >
                        Make An Appointment
                    </button>
                </div>
            </div>
            {/* Decorative Digital Services Card */}
             <div className="hidden lg:block absolute bottom-16 right-16 p-5 bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl border border-white/50 animate-fade-in-main" style={{ animationDelay: '0.5s' }}>
                <p className="font-bold text-sm text-slate-800 mb-4">Your Digital Health Hub</p>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-700">
                        <Icon name="calendar" className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold">Appointments</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                        <Icon name="chat" className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm font-semibold">AI Assistant</span>
                    </div>
                     <div className="flex items-center gap-2 text-slate-700">
                        <Icon name="ambulance" className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-semibold">Emergency</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

const MetricCard: React.FC<{ target: number; suffix: string; label: string; }> = ({ target, suffix, label }) => {
  const { count, ref } = useAnimatedCounter(target);
  return (
    <div className="bg-white/50 p-6 rounded-xl text-center shadow-lg border border-slate-200/60">
      <p className="text-4xl font-bold text-blue-600">
        <span ref={ref}>{count}</span>{suffix}
      </p>
      <p className="text-slate-600 mt-2">{label}</p>
    </div>
  )
};

const WhyChooseUsSection: React.FC = () => {
  const addToRefs = useScrollReveal();
  return (
    <section ref={addToRefs} className="py-24 bg-slate-50/70 reveal">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <MetricCard target={20} suffix="k+" label="Trusted Patients" />
          <MetricCard target={98} suffix="%" label="Satisfaction Rate" />
          <MetricCard target={24} suffix="/7" label="AI-Powered Support" />
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection: React.FC = () => {
  const addToRefs = useScrollReveal();
  return(
    <section ref={addToRefs} id="services" className="py-24 bg-white reveal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Easy Steps to Better Health</h2>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                Our platform simplifies your healthcare journey from start to finish.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center bg-blue-100 rounded-full mb-6 text-blue-600">
                <Icon name="userPlus" className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">1. Create Account</h3>
              <p className="text-slate-600">Sign up in minutes to get secure access to all our digital services.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center bg-indigo-100 rounded-full mb-6 text-indigo-600">
                <Icon name="search" className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">2. Find & Book</h3>
              <p className="text-slate-600">Search for specialists, view their availability, and book an appointment online.</p>
            </div>
             <div className="flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center bg-sky-100 rounded-full mb-6 text-sky-600">
                <Icon name="video" className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">3. Get Consultation</h3>
              <p className="text-slate-600">Consult with your doctor via video call or visit us using our virtual map for guidance.</p>
            </div>
        </div>
      </div>
    </section>
  )
}

const DoctorProfileCard: React.FC<{ name: string; specialty: string; image: string; }> = ({ name, specialty, image }) => (
    <div className="text-center group">
        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
            <img src={image} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
        <h4 className="mt-6 text-xl font-bold text-slate-800">{name}</h4>
        <p className="text-blue-600 font-medium">{specialty}</p>
    </div>
);

const DoctorsSection: React.FC = () => {
    const addToRefs = useScrollReveal();
    return (
        <section ref={addToRefs} id="doctors" className="py-24 bg-slate-50/70 reveal">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Meet Our Specialists</h2>
                    <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                        Our team of experienced and dedicated professionals is here to provide you with the best care.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                   <DoctorProfileCard name="Dr. Aureen Harazie" specialty="General Physician" image="https://images.unsplash.com/photo-1618498082410-b4aa22193b38?w=500&q=80" />
                   <DoctorProfileCard name="Dr. Emmnuel Sogolera" specialty="Cardiologist" image="https://images.unsplash.com/photo-1582750421291-d8bca7d0c4e4?w=500&q=80" />
                   <DoctorProfileCard name="Dr. Daniel Jere" specialty="Dentist" image="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&q=80" />
                   <DoctorProfileCard name="Dr. George Tembo" specialty="Orthopedist" image="https://images.unsplash.com/photo-1635309203632-411516e5c942?w=500&q=80" />
                </div>
            </div>
        </section>
    );
};

const TestimonialCard: React.FC<{ quote: string; name: string; role: string; }> = ({ quote, name, role }) => (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80 flex flex-col h-full">
        <div className="flex text-yellow-400 mb-4">
            <Icon name="star" className="w-5 h-5" /><Icon name="star" className="w-5 h-5" /><Icon name="star" className="w-5 h-5" /><Icon name="star" className="w-5 h-5" /><Icon name="star" className="w-5 h-5" />
        </div>
        <p className="text-slate-600 flex-grow">"{quote}"</p>
        <div className="mt-6">
            <p className="font-bold text-slate-800">{name}</p>
            <p className="text-sm text-slate-500">{role}</p>
        </div>
    </div>
);

const TestimonialsSection: React.FC = () => {
    const addToRefs = useScrollReveal();
    return(
        <section ref={addToRefs} id="testimonials" className="py-24 bg-white reveal">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-800 tracking-tight">What Our Patients Say</h2>
                    <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                        We are proud to have touched the lives of so many in our community.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <TestimonialCard 
                        quote="The new portal is a game-changer! Booking an appointment was so easy, and the AI assistant answered my questions instantly. Highly recommended!"
                        name="Patience B."
                        role="Patient"
                    />
                    <TestimonialCard 
                        quote="Navigating the hospital used to be confusing, but the virtual map feature led me straight to the pharmacy. A very thoughtful tool."
                        name="Jones T."
                        role="Patient"
                    />
                    <TestimonialCard 
                        quote="As someone who isn't very tech-savvy, I found the system incredibly intuitive. Wezi Medical is truly putting patients first with this platform."
                        name="Shalom M."
                        role="Patient"
                    />
                </div>
            </div>
        </section>
    );
}

const Footer: React.FC = () => (
    <footer id="contact" className="bg-slate-900 text-slate-400">
        <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
                <div>
                    <h4 className="font-bold text-white text-lg mb-4">Wezi Medical</h4>
                    <p className="text-sm">Modernizing healthcare in Mzuzu, Malawi with accessible, quality medical services.</p>
                </div>
                <div>
                    <h4 className="font-bold text-white text-lg mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#services" className="hover:text-blue-400 transition-colors">Services</a></li>
                        <li><a href="#doctors" className="hover:text-blue-400 transition-colors">Doctors</a></li>
                        <li><a href="#testimonials" className="hover:text-blue-400 transition-colors">Testimonials</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-white text-lg mb-4">Contact Us</h4>
                    <ul className="space-y-2 text-sm">
                        <li><address className="not-italic">PO Box 201, Mzuzu, Malawi</address></li>
                        <li><a href="tel:+265123456789" className="hover:text-blue-400 transition-colors">(+265) 123 456 789</a></li>
                        <li><a href="mailto:info@wezi.com" className="hover:text-blue-400 transition-colors">info@wezi.com</a></li>
                    </ul>
                </div>
                 <div>
                    <h4 className="font-bold text-white text-lg mb-4">Follow Us</h4>
                    <div className="flex gap-4 justify-center md:justify-start">
                        <a href="#" aria-label="Twitter" className="hover:text-white transition-colors"><Icon name="twitter" className="w-6 h-6"/></a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors"><Icon name="linkedin" className="w-6 h-6"/></a>
                        <a href="#" aria-label="GitHub" className="hover:text-white transition-colors"><Icon name="github" className="w-6 h-6"/></a>
                    </div>
                </div>
            </div>
            <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm">
                 <p>&copy; {new Date().getFullYear()} Wezi Medical Centre. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

const FloatingActionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-110 z-30"
        aria-label="Open AI health assistant"
    >
        <Icon name="chat" className="w-8 h-8" />
    </button>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onChatbotClick }) => {
  return (
    <div className="font-sans bg-white">
      <LandingHeader onLoginClick={onLoginClick}/>
      <main>
        <HeroSection onLoginClick={onLoginClick} />
        <WhyChooseUsSection />
        <HowItWorksSection />
        <DoctorsSection />
        <TestimonialsSection />
      </main>
      <Footer />
      <FloatingActionButton onClick={onChatbotClick} />
    </div>
  );
};