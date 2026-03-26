import React from 'react';

export default function ConfirmModal({ message, onConfirm, onCancel, title = 'Confirm', confirmText = 'Confirm', danger = false }) {
  if (!message) return null;
  
  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-[60] p-4">
      <div className="bg-secondary-background rounded-base p-6 sm:p-8 w-full max-w-md border border-border shadow-lg relative">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {message}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-secondary-background border border-border px-6 py-3 rounded-base text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 rounded-base font-semibold transition-opacity ${
              danger 
                ? 'bg-error text-white hover:opacity-90' 
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