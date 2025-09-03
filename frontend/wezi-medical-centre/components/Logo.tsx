import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  theme?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true,
  theme = 'light'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const logoColor = theme === 'dark' ? '#60A5FA' : '#2563EB'; // Blue color for both themes

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Building Icon */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Triangular roof/pediment */}
          <path 
            d="M12 2L22 8V22H2V8L12 2Z" 
            stroke={logoColor} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Main building structure */}
          <path 
            d="M4 8V20H20V8" 
            stroke={logoColor} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Columns */}
          <path 
            d="M8 12V20" 
            stroke={logoColor} 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          <path 
            d="M12 12V20" 
            stroke={logoColor} 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          <path 
            d="M16 12V20" 
            stroke={logoColor} 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          
          {/* Roof detail - small square in triangle */}
          <rect 
            x="11" 
            y="4" 
            width="2" 
            height="2" 
            fill={logoColor}
            rx="0.5"
          />
          
          {/* Entrance */}
          <path 
            d="M10 20V16H14V20" 
            stroke={logoColor} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      
      {/* Company Name */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-slate-900 dark:text-slate-100 ${textSizes[size]}`}>
            Wezi
          </span>
          <span className={`font-medium text-slate-600 dark:text-slate-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            Medical Centre
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
