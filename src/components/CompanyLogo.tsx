import React from 'react';

interface CompanyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  isPrint?: boolean;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  isPrint = false,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-9',
    md: 'w-10 h-12',
    lg: 'w-14 h-16',
    xl: 'w-20 h-24',
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Precision Vector Emblem matching Gloziyo Water Droplet + Eco Green Leaf & Sparkles */}
      <div className={`relative shrink-0 ${iconDimensions} flex items-center justify-center`}>
        <svg
          viewBox="0 0 120 140"
          className="w-full h-full drop-shadow-sm select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Blue Droplet Gradient */}
            <linearGradient id="dropBlueGrad" x1="60" y1="5" x2="105" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="35%" stopColor="#0ea5e9" />
              <stop offset="70%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#034894" />
            </linearGradient>

            {/* Bright Cyan Droplet Core */}
            <linearGradient id="cyanCore" x1="45" y1="20" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Green Eco Leaf Gradient */}
            <linearGradient id="leafGreenGrad" x1="15" y1="60" x2="70" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="40%" stopColor="#4ade80" />
              <stop offset="85%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            {/* Dark Navy Shadow Swish */}
            <linearGradient id="navyShadow" x1="70" y1="70" x2="110" y2="105" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
          </defs>

          {/* Sparkles / Stars in the surrounding air */}
          <path d="M100 22 L102 27 L107 29 L102 31 L100 36 L98 31 L93 29 L98 27 Z" fill="#0f172a" opacity="0.85" />
          <circle cx="106" cy="18" r="1.5" fill="#0f172a" opacity="0.6" />
          <path d="M15 48 L17 51 L20 52 L17 53 L15 56 L13 53 L10 52 L13 51 Z" fill="#0f172a" opacity="0.85" />
          <circle cx="24" cy="40" r="1.2" fill="#0f172a" opacity="0.5" />
          <circle cx="18" cy="88" r="1.5" fill="#0f172a" opacity="0.6" />

          {/* Droplet Base Shadow Swish (Right / Back) */}
          <path
            d="M58 8 C62 16 88 48 98 75 C108 102 96 118 78 123 C68 126 50 125 45 123 C65 120 95 106 88 78 C82 52 64 25 58 8 Z"
            fill="url(#navyShadow)"
          />

          {/* Main Top Blue Water Droplet with Curved Flow */}
          <path
            d="M58 8 C57 12 75 40 85 64 C93 84 84 105 72 114 C65 120 48 116 38 108 C50 110 75 102 78 82 C82 60 62 32 58 8 Z"
            fill="url(#dropBlueGrad)"
          />

          {/* Cyan Droplet Inner Highlight Core */}
          <path
            d="M57 14 C58 20 70 42 76 60 C82 76 74 95 62 104 C68 98 73 84 70 70 C66 52 58 32 57 14 Z"
            fill="url(#cyanCore)"
          />

          {/* White sparkle reflections on the blue droplet */}
          <path d="M68 32 L70 37 L75 39 L70 41 L68 46 L66 41 L61 39 L66 37 Z" fill="#ffffff" />
          <path d="M78 52 L79.5 55.5 L83 57 L79.5 58.5 L78 62 L76.5 58.5 L73 57 L76.5 55.5 Z" fill="#ffffff" opacity="0.9" />
          <circle cx="60" cy="50" r="1.8" fill="#ffffff" opacity="0.8" />
          <circle cx="85" cy="78" r="1.8" fill="#ffffff" opacity="0.9" />

          {/* Bottom Left Lime-Green Leaf */}
          <path
            d="M56 46 C56 46 45 62 34 76 C23 90 20 102 24 112 C28 122 40 126 54 122 C64 118 72 108 72 96 C72 82 63 60 56 46 Z"
            fill="url(#leafGreenGrad)"
          />

          {/* Leaf Inner Sheen / Highlight */}
          <path
            d="M50 56 C44 70 33 86 28 98 C25 106 28 114 36 116 C30 112 28 102 33 92 C38 82 46 68 50 56 Z"
            fill="#bbf7d0"
            opacity="0.8"
          />

          {/* White sparkle on the leaf */}
          <path d="M46 96 L47.5 99.5 L51 101 L47.5 102.5 L46 106 L44.5 102.5 L41 101 L44.5 99.5 Z" fill="#ffffff" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight font-sans ${
                isPrint ? 'text-black' : 'text-slate-900'
              } ${size === 'lg' || size === 'xl' ? 'text-2xl tracking-tighter' : 'text-lg leading-tight'}`}
            >
              GLOZIYO
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300 tracking-wider uppercase">
              SERVICES PVT LTD
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 tracking-wide">
            Statutory Compliance &amp; Workforce Management
          </span>
          <span className="text-[10px] font-mono text-blue-700 font-semibold">
            LIN: 1-8125-1293-8
          </span>
        </div>
      )}
    </div>
  );
};
