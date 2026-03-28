import React from 'react';

export default function Logo({ size = 'default', showText = true }) {
  const sizes = {
    small: { width: 28, height: 28 },
    default: { width: 36, height: 36 },
    large: { width: 48, height: 48 },
  };

  const { width, height } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width, height }}>
        <svg
          width={width}
          height={height}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="10"
            fill="url(#logoGrad1)"
          />
          
          <path
            d="M24 12 L24 20 C24 22 22 24 20 24 L14 24 C12 24 10 26 10 28 L10 36"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          
          <path
            d="M24 12 L24 20 C24 22 26 24 28 24 L34 24 C36 24 38 26 38 28 L38 36"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          
          <circle
            cx="24"
            cy="10"
            r="3"
            fill="white"
          />
          
          <rect
            x="34"
            y="32"
            width="6"
            height="6"
            rx="2"
            fill="white"
            opacity="0.9"
          />
          
          <rect
            x="14"
            y="28"
            width="6"
            height="6"
            rx="2"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-base leading-tight text-foreground">
            OwnNet
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight -mt-0.5">
            Vault
          </span>
        </div>
      )}
    </div>
  );
}