import React, { useState, useEffect } from 'react';
import { generateRecoveryPhrase, validateRecoveryPhrase, getRandomVerificationWords } from '../utils/recovery';

export default function SetupModal({ onComplete }) {
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
    console.log('Form submitted, password:', password, 'confirmPassword:', confirmPassword);
    
    if (password.length < 8) {
      console.log('Password too short');
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      console.log('Passwords do not match');
      setError('Passwords do not match');
      return;
    }
    
    console.log('Password strength:', strength);
    if (strength === 'weak') {
      console.log('Password is weak');
      setError('Password is too weak. Add uppercase, numbers, or special characters.');
      return;
    }
    
    console.log('Generating recovery phrase...');
    try {
      // Generate recovery phrase and go to step 2
      const phrase = generateRecoveryPhrase();
      console.log('Recovery phrase generated:', phrase.substring(0, 20) + '...');
      setRecoveryPhrase(phrase);
      const words = getRandomVerificationWords(phrase);
      setVerificationWords(words);
      setStep(2);
      console.log('Moving to step 2');
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
    
    // Check if user entered correct verification words
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
    <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-secondary-background rounded-base p-6 sm:p-8 w-full max-w-md border border-border shadow-lg relative">
        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to cancel? You\'ll need to start over.')) {
              onComplete(null, null, true);
            }
          }}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background rounded-base transition-colors"
          aria-label="Cancel"
        >
          ✕
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-main text-main-foreground' : 'bg-border text-muted-foreground'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 ${step >= 2 ? 'bg-main' : 'bg-border'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-main text-main-foreground' : 'bg-border text-muted-foreground'
          }`}>
            2
          </div>
          <div className={`w-12 h-1 ${step >= 3 ? 'bg-main' : 'bg-border'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 3 ? 'bg-main text-main-foreground' : 'bg-border text-muted-foreground'
          }`}>
            3
          </div>
        </div>

        {step === 1 && (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Create Your Vault Password</h2>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Create a strong password. You'll need it to unlock your vault.
            </p>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium text-sm">
                  Master Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent pr-12"
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
                  <div className="h-1.5 bg-border rounded mt-2 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${getStrengthColor()} ${getStrengthWidth()}`}></div>
                  </div>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Strength: <span className={getStrengthTextColor()}>{strength}</span>
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Confirm your password"
                />
              </div>
              
              {error && (
                <p className="text-error mb-4 text-sm bg-error/10 p-3 rounded-base">
                  {error}
                </p>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-main text-main-foreground px-6 py-3 rounded-base font-semibold hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Recovery Phrase</h2>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Write down these 12 words. You'll need them if you forget your password.
            </p>
            
            <div className="bg-background border border-border rounded-base p-4 mb-4">
              <div className="grid grid-cols-3 gap-2">
                {recoveryPhrase.split(' ').map((word, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                    <span className="font-medium">{word}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleCopyPhrase}
              className="w-full bg-secondary-background border border-border px-4 py-2 rounded-base text-muted-foreground hover:text-foreground hover:bg-background transition-colors mb-6 text-sm"
            >
              📋 Copy to Clipboard
            </button>
            
            <div className="bg-warning/20 border border-warning/30 rounded-base p-4 mb-6">
              <p className="text-sm text-warning font-medium mb-1">⚠️ Important</p>
              <p className="text-xs sm:text-sm text-warning/80">
                Store this phrase safely! If you lose both your password AND recovery phrase, your data cannot be recovered.
              </p>
              <p className="text-xs sm:text-sm text-warning/80 mt-2">
                <strong>You will need BOTH your password AND recovery phrase to recover on a new device.</strong>
              </p>
            </div>
            
            <button 
              type="button"
              onClick={() => setStep(3)}
              className="w-full bg-main text-main-foreground px-6 py-3 rounded-base font-semibold hover:opacity-90 transition-opacity"
            >
              I've Written It Down
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Verify Recovery Phrase</h2>
            <p className="text-muted-foreground mb-6 text-sm sm:text-base">
              Enter the following words from your recovery phrase to confirm you wrote it down correctly.
            </p>
            
            <form onSubmit={handleVerificationSubmit}>
              {verificationWords.map(({ index, word }) => (
                <div key={index} className="mb-4">
                  <label className="block mb-2 font-medium text-sm">
                    Word #{index + 1} <span className="text-muted-foreground font-normal">(word {index + 1} of your phrase)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
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
                <p className="text-error mb-4 text-sm bg-error/10 p-3 rounded-base">
                  {error}
                </p>
              )}
              
              <button 
                type="submit" 
                className="w-full bg-main text-main-foreground px-6 py-3 rounded-base font-semibold hover:opacity-90 transition-opacity"
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
                className="w-full bg-secondary-background border border-border px-6 py-3 rounded-base text-muted-foreground hover:text-foreground hover:bg-background transition-colors mt-3"
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