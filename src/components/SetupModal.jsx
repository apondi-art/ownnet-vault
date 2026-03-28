import React, { useState } from 'react';
import { generateValidMnemonic } from '../utils/wallet';
import { getRandomVerificationWords } from '../utils/recovery';

export default function SetupModal({ onComplete, onUseRecovery, onCancel }) {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState('weak');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [verificationWords, setVerificationWords] = useState([]);
  const [userVerificationInput, setUserVerificationInput] = useState({});

  const checkStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setStrength(checkStrength(pwd));
    setError('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (strength === 'weak') {
      setError('Password is too weak. Add uppercase, numbers, or special characters.');
      return;
    }
    
    try {
      const phrase = generateValidMnemonic();
      setRecoveryPhrase(phrase);
      const words = getRandomVerificationWords(phrase);
      setVerificationWords(words);
      setStep(2);
    } catch (err) {
      console.error('Error generating recovery phrase:', err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleCopyPhrase = () => {
    navigator.clipboard.writeText(recoveryPhrase);
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    
    let allCorrect = true;
    for (const { index } of verificationWords) {
      const userWord = (userVerificationInput[index] || '').toLowerCase().trim();
      const actualWord = recoveryPhrase.split(' ')[index];
      if (userWord !== actualWord) {
        allCorrect = false;
        break;
      }
    }
    
    if (!allCorrect) {
      setError('One or more words are incorrect. Please check your recovery phrase and try again.');
      return;
    }
    
    onComplete(password, recoveryPhrase);
  };

  const getStrengthColor = () => {
    if (strength === 'weak') return 'bg-error';
    if (strength === 'medium') return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthWidth = () => {
    if (strength === 'weak') return 'w-1/3';
    if (strength === 'medium') return 'w-2/3';
    return 'w-full';
  };

  const getStrengthTextColor = () => {
    if (strength === 'weak') return 'text-error';
    if (strength === 'medium') return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-secondary-background rounded-lg p-6 sm:p-8 w-full max-w-md border border-border shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else if (confirm('Are you sure you want to cancel? You\'ll need to start over.')) {
              onComplete(null, null, true);
            }
          }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background rounded-lg transition-all"
          aria-label="Cancel"
        >
          ✕
        </button>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= 1 ? 'bg-gradient-to-r from-main to-main-light text-white shadow-md' : 'bg-border text-muted-foreground'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 rounded-full transition-all ${step >= 2 ? 'bg-gradient-to-r from-main to-main-light' : 'bg-border'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= 2 ? 'bg-gradient-to-r from-main to-main-light text-white shadow-md' : 'bg-border text-muted-foreground'
          }`}>
            2
          </div>
          <div className={`w-16 h-1 rounded-full transition-all ${step >= 3 ? 'bg-gradient-to-r from-main to-main-light' : 'bg-border'}`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= 3 ? 'bg-gradient-to-r from-main to-main-light text-white shadow-md' : 'bg-border text-muted-foreground'
          }`}>
            3
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-main/20 to-teal-500/20 flex items-center justify-center">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Create Your Vault Password</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Create a strong password. You'll need it to unlock your vault.
              </p>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-sm">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent pr-12 transition-all"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {password && (
                  <div className="h-2 bg-border rounded mt-2 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}></div>
                  </div>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Strength: <span className={`font-semibold ${getStrengthTextColor()}`}>{strength}</span>
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Confirm your password"
                />
              </div>
              
              {error && (
                <p className="text-error mb-4 text-sm bg-error-light p-3 rounded-lg border border-error/30">
                  {error}
                </p>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-main to-main-light text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Continue
              </button>
              
              {onUseRecovery && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have a vault?{' '}
                    <button
                      type="button"
                      onClick={onUseRecovery}
                      className="text-main hover:underline font-medium"
                    >
                      Use recovery phrase
                    </button>
                  </p>
                </div>
              )}
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                <span className="text-3xl">🔑</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Recovery Phrase</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Write down these 12 words. You'll need them if you forget your password.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-background to-border-light border border-border rounded-lg p-4 mb-4">
              <div className="grid grid-cols-3 gap-2">
                {recoveryPhrase.split(' ').map((word, index) => (
                  <div key={index} className="flex items-center gap-2 bg-background/50 px-2 py-1.5 rounded">
                    <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                    <span className="font-medium text-sm">{word}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleCopyPhrase}
              className="w-full bg-secondary-background border border-border px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background hover:border-main/50 transition-all mb-4 text-sm font-medium"
            >
              📋 Copy to Clipboard
            </button>
            
            <div className="bg-warning-light border border-warning/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-warning font-semibold mb-1">⚠️ Important</p>
              <p className="text-xs sm:text-sm text-warning/80">
                Store this phrase safely! If you lose both your password AND recovery phrase, your data cannot be recovered.
              </p>
              <p className="text-xs sm:text-sm text-warning/80 mt-2 font-medium">
                You will need BOTH your password AND recovery phrase to recover on a new device.
              </p>
            </div>
            
            <button 
              type="button"
              onClick={() => setStep(3)}
              className="w-full bg-gradient-to-r from-main to-main-light text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              I've Written It Down
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-success/20 to-emerald-500/20 flex items-center justify-center">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Verify Recovery Phrase</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Enter the following words from your recovery phrase to confirm you wrote it down correctly.
              </p>
            </div>
            
            <form onSubmit={handleVerificationSubmit}>
              {verificationWords.map(({ index, word }) => (
                <div key={index} className="mb-4">
                  <label className="block mb-2 font-medium text-sm">
                    Word #{index + 1} <span className="text-muted-foreground font-normal">(word {index + 1} of your phrase)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all"
                    value={userVerificationInput[index] || ''}
                    onChange={(e) => setUserVerificationInput({
                      ...userVerificationInput,
                      [index]: e.target.value.toLowerCase().trim()
                    })}
                    placeholder={`Type word #${index + 1}`}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck="false"
                  />
                  {userVerificationInput[index] && userVerificationInput[index].toLowerCase().trim() !== word && (
                    <p className="text-xs text-warning mt-1">
                      This word doesn't match what you wrote down
                    </p>
                  )}
                </div>
              ))}
              
              {error && (
                <p className="text-error mb-4 text-sm bg-error-light p-3 rounded-lg">
                  {error}
                </p>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-success to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all mb-3"
              >
                Create Vault
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setStep(2);
                  setError('');
                  setUserVerificationInput({});
                }}
                className="w-full bg-secondary-background border border-border px-6 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background hover:border-main/50 transition-all"
              >
                ← Go Back to Recovery Phrase
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}