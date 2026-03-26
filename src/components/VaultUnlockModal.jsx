import React, { useState } from 'react';

export default function VaultUnlockModal({ onUnlock, onReset, onCancel }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useRecoveryPhrase, setUseRecoveryPhrase] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (useRecoveryPhrase) {
      const cleanPhrase = recoveryPhrase
        .toLowerCase()
        .replace(/[,;.\n\r\t]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      const words = cleanPhrase.split(' ').filter(w => w.length > 0);
      
      if (words.length === 0) {
        setError('Please enter your recovery phrase');
        return;
      }
      
      if (words.length !== 12) {
        setError(`Your phrase has ${words.length} words, but it needs exactly 12 words.`);
        return;
      }
      
      onUnlock(cleanPhrase, true);
    } else {
      if (!password) {
        setError('Please enter your password');
        return;
      }
      onUnlock(password, false);
    }
  };

  const handlePhrasePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanText = pastedText
      .toLowerCase()
      .replace(/[,;.\n\r\t]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    setRecoveryPhrase(cleanText);
  };

  const wordCount = recoveryPhrase
    .toLowerCase()
    .replace(/[,;.\n\r\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(w => w.length > 0).length;

  return (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-secondary-background rounded-base p-6 sm:p-8 w-full max-w-md border border-border shadow-lg relative">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background rounded-base transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        )}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">Vault is Locked</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {useRecoveryPhrase 
              ? 'Enter your 12-word recovery phrase'
              : 'Enter your password to unlock and access your files'
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {!useRecoveryPhrase ? (
            <>
              <div className="mb-6">
                <label className="block mb-2 font-medium text-sm">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent pr-12"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              
              {error && (
                <p className="text-error mb-4 text-sm bg-error/10 p-3 rounded-base">
                  {error}
                </p>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-main text-main-foreground px-6 py-3 rounded-base font-semibold hover:opacity-90 transition-opacity mb-3"
              >
                🔓 Unlock Vault
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-sm">
                  Recovery Phrase <span className="text-muted-foreground font-normal">(12 words, separated by spaces)</span>
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent resize-none"
                  rows={3}
                  value={recoveryPhrase}
                  onChange={(e) => {
                    setRecoveryPhrase(e.target.value);
                    setError('');
                  }}
                  onPaste={handlePhrasePaste}
                  placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {recoveryPhrase ? `${wordCount} of 12 words` : ''}
                  </span>
                  {wordCount > 0 && (
                    <span className={`text-xs ${wordCount === 12 ? 'text-success' : 'text-warning'}`}>
                      {wordCount < 12 ? `${12 - wordCount} more needed` : '✓ Complete'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-background border border-border rounded-base p-3 mb-4">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Tip:</strong> Separate words with <strong>spaces</strong>, not commas. 
                  Commas and other separators are automatically removed when you paste.
                </p>
              </div>
              
              {error && (
                <p className="text-error mb-4 text-sm bg-error/10 p-3 rounded-base">
                  {error}
                </p>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-main text-main-foreground px-6 py-3 rounded-base font-semibold hover:opacity-90 transition-opacity mb-3"
              >
                🔓 Unlock with Recovery Phrase
              </button>
            </>
          )}
          
          {onCancel && !useRecoveryPhrase && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-secondary-background border border-border px-6 py-3 rounded-base text-muted-foreground hover:text-foreground hover:bg-background transition-colors mb-4"
            >
              Cancel
            </button>
          )}
          
          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => {
                setUseRecoveryPhrase(!useRecoveryPhrase);
                setError('');
                setPassword('');
                setRecoveryPhrase('');
              }}
              className="text-sm text-main hover:underline"
            >
              {useRecoveryPhrase ? 'Use password instead' : 'Use recovery phrase instead'}
            </button>
            
            <div className="text-xs text-muted-foreground">
              or{' '}
              <button
                type="button"
                onClick={onReset}
                className="text-main hover:underline"
              >
                create new vault
              </button>
              {' (deletes all data)'}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}