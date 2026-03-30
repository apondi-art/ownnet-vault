import React, { useState } from 'react';

export default function HeroSection({ onGetStarted }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: '🔐',
      title: 'AES-256 Encryption',
      description: 'Military-grade encryption on your device before upload',
    },
    {
      icon: '🔑',
      title: 'You Hold the Keys',
      description: 'Only you can decrypt your data. We never see your password.',
    },
    {
      icon: '🌐',
      title: 'Decentralized Storage',
      description: 'Files stored on IPFS, not centralized servers.',
    },
    {
      icon: '⛓️',
      title: 'Blockchain Sync',
      description: 'Access your files from any device, anywhere.',
    },
    {
      icon: '🚫',
      title: 'No Account Required',
      description: 'No email, no tracking, complete anonymity.',
    },
    {
      icon: '⚡',
      title: 'Instant Setup',
      description: 'Start encrypting in under 30 seconds.',
    },
  ];

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-main/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-main/10 border border-main/30 rounded-full mb-6">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-main">Privacy-First Data Storage</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
          Your Data,
          <span className="block mt-2 bg-gradient-to-r from-main via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            Your Control
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          A secure data vault where your files are encrypted locally before storage.
          <span className="block mt-2 font-medium text-foreground">
            Only <span className="text-main">you</span> hold the keys.
          </span>
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-main text-white rounded-lg font-semibold text-lg hover:bg-main-dark transition-all hover:shadow-lg hover:-translate-y-0.5 mb-12"
        >
          🚀 Get Started 
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-12">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-main">100%</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Client-Side Encrypted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-main">0</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Third-Party Access</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-main">∞</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Cross-Device Sync</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-5 bg-secondary-background rounded-lg border border-border hover:border-main/30 transition-all cursor-default"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
              {hoveredFeature === index && (
                <div className="absolute inset-0 bg-main/5 rounded-lg pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border">
            <span className="text-sm">🔒</span>
            <span className="text-xs text-muted-foreground">End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border">
            <span className="text-sm">🌐</span>
            <span className="text-xs text-muted-foreground">IPFS Powered</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border">
            <span className="text-sm">⛓️</span>
            <span className="text-xs text-muted-foreground">Blockchain Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}