import React from 'react';

export default function ErrorModal({ message, onClose, title = 'Error' }) {
  if (!message) return null;
  
  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-[60] p-4">
      <div className="bg-secondary-background rounded-base p-6 sm:p-8 w-full max-w-md border border-border shadow-lg relative">
        <div className="text-center mb-4">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-error">{title}</h2>
          <p className="text-muted-foreground text-sm sm:text-base whitespace-pre-line">
            {message}
          </p>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-main text-main-foreground px-6 py-3 rounded-base font-semibold hover:opacity-90 transition-opacity"
        >
          OK
        </button>
      </div>
    </div>
  );
}