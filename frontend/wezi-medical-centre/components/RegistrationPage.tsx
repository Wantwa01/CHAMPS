import React, { useState, useEffect } from 'react';
import { Language, Theme } from '../App';
import { useAuth } from './DashboardApp';
import { authService, AdultRegistrationData, GuardianRegistrationData } from '../services/authService';
import { UserIcon, LockIcon, PhoneIcon, SunIcon, MoonIcon, ArrowRightIcon, XIcon } from './Icons';

interface RegistrationPageProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: any;
  theme: Theme;
  toggleTheme: () => void;
  onRegistrationSuccess: () => void;
  onBackToLogin: () => void;
}

type RegistrationType = 'adult' | 'guardian';

const RegistrationPage: React.FC<RegistrationPageProps> = ({
  language,
  setLanguage,
  t,
  theme,
  toggleTheme,
  onRegistrationSuccess,
  onBackToLogin
}) => {
  const [registrationType, setRegistrationType] = useState<RegistrationType>('adult');
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    nationality: 'malawian' as 'malawian' | 'non-malawian',
    nationalId: '',
    passportNumber: '',
    password: '',
    confirmPassword: '',
    guardianName: '', // For guardian registration
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    setIsVisible(true);
    // Generate floating particles for futuristic effect
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 6) {
      newErrors.phone = 'Phone number must be at least 6 digits';
    }
    
    if (formData.nationality === 'malawian' && !formData.nationalId) {
      newErrors.nationalId = 'National ID is required for Malawian citizens';
    }
    
    if (formData.nationality === 'non-malawian' && !formData.passportNumber) {
      newErrors.passportNumber = 'Passport number is required for non-Malawian citizens';
    }
    
    if (registrationType === 'guardian' && !formData.guardianName) {
      newErrors.guardianName = 'Guardian name is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (registrationType === 'adult') {
        const adultData: AdultRegistrationData = {
          username: formData.username,
          phone: formData.phone,
          nationality: formData.nationality,
          nationalId: formData.nationalId || undefined,
          passportNumber: formData.passportNumber || undefined,
          password: formData.password,
        };
        await authService.registerAdult(adultData);
      } else {
        const guardianData: GuardianRegistrationData = {
          username: formData.username,
          phone: formData.phone,
          guardianName: formData.guardianName,
          nationality: formData.nationality,
          nationalId: formData.nationalId || undefined,
          passportNumber: formData.passportNumber || undefined,
          password: formData.password,
        };
        await authService.registerGuardian(guardianData);
      }
      
      onRegistrationSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      phone: '',
      nationality: 'malawian',
      nationalId: '',
      passportNumber: '',
      password: '',
      confirmPassword: '',
      guardianName: '',
    });
    setErrors({});
    setError(null);
  };

  const switchRegistrationType = (type: RegistrationType) => {
    setRegistrationType(type);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400/30 dark:bg-blue-300/20 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBackToLogin}
              className="text-xl font-bold text-slate-900 dark:text-slate-100 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {t.headerTitle}
            </button>
            
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 flex items-center">
                {(['EN', 'CH', 'TU'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-300 ${
                      language === lang
                        ? 'bg-white text-blue-500 dark:bg-slate-900 dark:text-blue-400 shadow-sm'
                        : 'bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200" 
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className={`w-full max-w-md transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Registration Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Create Account
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Join Wezi Medical Centre to access our services
              </p>
            </div>

            {/* Registration Type Toggle */}
            <div className="mb-6">
              <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-1 flex">
                <button
                  onClick={() => switchRegistrationType('adult')}
                  className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    registrationType === 'adult'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Adult Patient
                </button>
                <button
                  onClick={() => switchRegistrationType('guardian')}
                  className={`flex-1 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    registrationType === 'guardian'
                      ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Guardian
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center">
                  <XIcon className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.username ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Enter your username"
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.username}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.phone ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Guardian Name Field (only for guardian registration) */}
              {registrationType === 'guardian' && (
                <div>
                  <label htmlFor="guardianName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Guardian Name
                  </label>
                  <input
                    id="guardianName"
                    name="guardianName"
                    type="text"
                    value={formData.guardianName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.guardianName ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Enter guardian name"
                  />
                  {errors.guardianName && (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.guardianName}</p>
                  )}
                </div>
              )}

              {/* Nationality Field */}
              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nationality
                </label>
                <select
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="malawian">Malawian</option>
                  <option value="non-malawian">Non-Malawian</option>
                </select>
              </div>

              {/* National ID Field (for Malawian citizens) */}
              {formData.nationality === 'malawian' && (
                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    National ID
                  </label>
                  <input
                    id="nationalId"
                    name="nationalId"
                    type="text"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.nationalId ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Enter your National ID"
                  />
                  {errors.nationalId && (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.nationalId}</p>
                  )}
                </div>
              )}

              {/* Passport Number Field (for non-Malawian citizens) */}
              {formData.nationality === 'non-malawian' && (
                <div>
                  <label htmlFor="passportNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Passport Number
                  </label>
                  <input
                    id="passportNumber"
                    name="passportNumber"
                    type="text"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.passportNumber ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Enter your passport number"
                  />
                  {errors.passportNumber && (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.passportNumber}</p>
                  )}
                </div>
              )}

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.password ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-700 border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-500 dark:border-red-400' : 'border-slate-300 dark:border-slate-600'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  onClick={onBackToLogin}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;
