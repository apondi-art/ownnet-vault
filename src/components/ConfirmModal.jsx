import React from 'react';

export default function ConfirmModal({ message, onConfirm, onCancel, title = 'Confirm', confirmText = 'Confirm', danger = false }) {
  if (!message) return null;
  
  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-[60] p-4">
      <div className="bg-secondary-background rounded-base p-6 sm:p-8 w-full max-w-md border border-border shadow-lg relative">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-foreground">{title}</h2>
          <div className="text-foreground/90 dark:text-foreground/80 text-sm sm:text-base whitespace-pre-line text-left bg-background/50 dark:bg-background/30 p-3 rounded-lg">
            {message}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-secondary-background border border-border px-6 py-3 rounded-base text-muted-foreground hover:text-foreground hover:bg-background transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 rounded-base font-semibold transition-all ${
              danger 
                ? 'bg-error text-white hover:bg-red-600' 
                : 'bg-main text-main-foreground hover:opacity-90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}