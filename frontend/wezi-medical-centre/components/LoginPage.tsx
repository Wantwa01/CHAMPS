import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, LockIcon, UserIcon, ArrowRightIcon, SunIcon, MoonIcon } from './Icons';
import { Language, Theme, TranslationSet } from '../App';
import { useAuth } from './DashboardApp';

interface LoginPageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSet;
  theme: Theme;
  toggleTheme: () => void;
  onLoginSuccess: () => void;
  onBackToHome: () => void;
  onSignUp?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  language,
  setLanguage,
  t,
  theme,
  toggleTheme,
  onLoginSuccess,
  onBackToHome,
  onSignUp
}) => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      newErrors.username = t.loginUsernameRequired || 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = t.loginUsernameMinLength || 'Username must be at least 3 characters';
    }
    
    if (!formData.password) {
      newErrors.password = t.loginPasswordRequired;
    } else if (formData.password.length < 6) {
      newErrors.password = t.loginPasswordMinLength;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData.username, formData.password);
      onLoginSuccess();
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
              onClick={onBackToHome}
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
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className={`w-full max-w-md transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Login Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 relative overflow-hidden">
            {/* Card Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-400/5 dark:to-indigo-400/5 rounded-3xl"></div>
            
            {/* Header */}
            <div className="relative z-10 text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t.loginWelcome}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {t.loginSubtitle}
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.loginUsername || 'Username'}
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
                    placeholder={t.loginUsernamePlaceholder || 'Enter your username'}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.loginPassword}
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
                    placeholder={t.loginPasswordPlaceholder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                  >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                    {t.loginRememberMe}
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  {t.loginForgotPassword}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t.loginSigningIn}
                  </>
                ) : (
                  <>
                    {t.loginSignIn}
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="relative z-10 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
              </div>
            )}

            {/* Divider */}
            <div className="relative z-10 my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {t.loginOr}
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="relative z-10 space-y-3">
              <button className="w-full bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-600 transition-all duration-200 transform hover:scale-[1.02] shadow-sm hover:shadow-md flex items-center justify-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {t.loginWithGoogle}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="relative z-10 text-center mt-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t.loginNoAccount}{' '}
                <button 
                  onClick={onSignUp}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  {t.loginSignUp}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
