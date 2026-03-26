import React, { useState, useEffect } from 'react';
import SetupModal from './components/SetupModal';
import VaultUnlockModal from './components/VaultUnlockModal';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import NoteEditor from './components/NoteEditor';
import WalletConnect from './components/WalletConnect';
import StatusBar from './components/StatusBar';
import { useTheme } from './hooks/useTheme';
import {
  encryptFile,
  decryptData,
  encryptText,
  decryptText,
  checkPasswordStrength
} from './utils/encryption';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  uploadToIPFS,
  downloadFromIPFS
} from './utils/ipfs';
import {
  connectWallet,
  registerFileHash,
  getUserFiles,
  getWalletAddress,
  getBalance,
  formatAddress
} from './utils/web3';

const STORAGE_KEY_VAULT = 'ownnet-vault-data';
const STORAGE_KEY_PASSWORD_HASH = 'ownnet-vault-password';
const STORAGE_KEY_FILES = 'ownnet-vault-files';
const STORAGE_KEY_RECOVERY = 'ownnet-vault-recovery';

function App() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [isSetup, setIsSetup] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [password, setPassword] = useState(null);
  const [files, setFiles] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [activeTab, setActiveTab] = useState('files');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedPasswordHash = localStorage.getItem(STORAGE_KEY_PASSWORD_HASH);
    const storedFiles = localStorage.getItem(STORAGE_KEY_FILES);
    
    if (storedPasswordHash) {
      setIsSetup(false);
      setShowUnlockModal(true);
    }
    
    if (storedFiles) {
      try {
        setFiles(JSON.parse(storedFiles));
      } catch (e) {
        console.error('Failed to parse stored files:', e);
      }
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
  }, [files]);

  const handleSetupComplete = (masterPassword, recoveryPhrase, isCancelled) => {
    // Handle cancel from setup modal - go to locked screen
    if (isCancelled) {
      setIsSetup(false);
      setShowUnlockModal(false);
      return;
    }
    
    if (!masterPassword) {
      return;
    }
    
    const strength = checkPasswordStrength(masterPassword);
    if (strength === 'weak') {
      alert('Please choose a stronger password');
      return;
    }
    
    localStorage.setItem(STORAGE_KEY_PASSWORD_HASH, btoa(masterPassword));
    if (recoveryPhrase) {
      localStorage.setItem(STORAGE_KEY_RECOVERY, btoa(recoveryPhrase));
    }
    setPassword(masterPassword);
    setIsSetup(false);
    setIsLocked(false);
    setShowUnlockModal(false);
  };

  const handleUnlock = (enteredCredential, isRecoveryPhrase = false) => {
    const storedHash = localStorage.getItem(STORAGE_KEY_PASSWORD_HASH);
    const storedRecovery = localStorage.getItem(STORAGE_KEY_RECOVERY);
    
    if (isRecoveryPhrase) {
      // Check recovery phrase
      if (storedRecovery && btoa(enteredCredential) === storedRecovery) {
        // Recovery phrase matches - derive password from it
        setPassword(enteredCredential);
        setIsLocked(false);
        setShowUnlockModal(false);
      } else {
        alert('Invalid recovery phrase');
      }
    } else {
      // Check password
      if (btoa(enteredCredential) === storedHash) {
        setPassword(enteredCredential);
        setIsLocked(false);
        setShowUnlockModal(false);
      } else {
        alert('Incorrect password');
      }
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure? This will delete all your encrypted data.')) {
      localStorage.removeItem(STORAGE_KEY_PASSWORD_HASH);
      localStorage.removeItem(STORAGE_KEY_FILES);
      localStorage.removeItem(STORAGE_KEY_VAULT);
      localStorage.removeItem(STORAGE_KEY_RECOVERY);
      setFiles([]);
      setPassword(null);
      setIsSetup(true);
      setIsLocked(true);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const encrypted = await encryptFile(file, password);
      const storageResult = await saveToLocalStorage('file-' + Date.now(), encrypted.data);
      
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        encryptedSize: encrypted.encryptedSize,
        timestamp: Date.now(),
        storageKey: storageResult.hash,
        ipfsHash: storageResult.hash,
        isLocal: storageResult.local
      };
      
      if (walletAddress) {
        try {
          await registerFileHash(storageResult.hash);
          newFile.onChain = true;
        } catch (e) {
          console.error('Failed to register on blockchain:', e);
        }
      }
      
      setFiles(prev => [newFile, ...prev]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to encrypt and upload file');
    }
  };

  const handleFileDownload = async (file) => {
    try {
      const encryptedData = loadFromLocalStorage(file.storageKey);
      
      if (!encryptedData) {
        alert('File data not found');
        return;
      }
      
      const decrypted = await decryptData(encryptedData, password);
      const blob = new Blob([decrypted], { type: file.type });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to decrypt file. Wrong password?');
    }
  };

  const handleFileDelete = (fileId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const handleNoteSave = async (title, content) => {
    try {
      const encrypted = await encryptText(content, password);
      
      const newNote = {
        id: Date.now().toString(),
        name: title + '.txt',
        type: 'text/plain',
        size: content.length,
        timestamp: Date.now(),
        encryptedContent: encrypted,
        isNote: true
      };
      
      setFiles(prev => [newNote, ...prev]);
    } catch (error) {
      console.error('Save note failed:', error);
      alert('Failed to save note');
    }
  };

  const handleWalletConnect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      const balance = await getBalance();
      setWalletBalance(balance);
      return address;
    } catch (error) {
      console.error('Wallet connect error:', error);
      throw error;
    }
  };

  const handleLock = () => {
    setPassword(null);
    setIsLocked(true);
    setShowUnlockModal(false);
  };

  const handleShowUnlock = () => {
    setShowUnlockModal(true);
  };

  const handleCancelUnlock = () => {
    setShowUnlockModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">🔐</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-main">OwnNet Vault</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Privacy-First Data Storage</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {!isSetup && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-base text-sm font-medium ${
                isLocked 
                  ? 'bg-error/20 text-error border border-error/30' 
                  : 'bg-success/20 text-success border border-success/30'
              }`}>
                {isLocked ? '🔒 Locked' : '🔓 Unlocked'}
              </div>
            )}
            
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-base border border-border bg-secondary-background hover:bg-background transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            
            <WalletConnect
              onConnect={handleWalletConnect}
              address={walletAddress}
              balance={walletBalance}
            />
          </div>
        </header>
        
        {isSetup ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-main">Your Data, Your Control</h2>
              <p className="text-muted-foreground text-base sm:text-lg">
                A privacy-first vault where your data is encrypted locally before storage.
                Only you hold the keys to unlock it.
              </p>
            </div>
            
            <SetupModal onComplete={handleSetupComplete} />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="p-5 bg-secondary-background rounded-base border border-border text-center">
                <div className="text-3xl mb-3">🔐</div>
                <div className="font-semibold mb-2">Client-Side Encryption</div>
                <div className="text-sm text-muted-foreground">
                  All data is encrypted in your browser before leaving your device
                </div>
              </div>
              <div className="p-5 bg-secondary-background rounded-base border border-border text-center">
                <div className="text-3xl mb-3">🔑</div>
                <div className="font-semibold mb-2">You Own the Keys</div>
                <div className="text-sm text-muted-foreground">
                  Only you can decrypt your data. We never see your password
                </div>
              </div>
              <div className="p-5 bg-secondary-background rounded-base border border-border text-center">
                <div className="text-3xl mb-3">🌐</div>
                <div className="font-semibold mb-2">Blockchain Verified</div>
                <div className="text-sm text-muted-foreground">
                  Optionally verify file ownership on the blockchain
                </div>
              </div>
            </div>
          </div>
        ) : isLocked ? (
          <>
            {!showUnlockModal ? (
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-6">🔒</div>
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-main">Vault is Locked</h2>
                  <p className="text-muted-foreground text-base sm:text-lg">
                    Your files are encrypted and secure. Unlock to access them.
                  </p>
                </div>
                
                <div className="text-center mb-8">
                  <button 
                    onClick={handleShowUnlock}
                    className="px-8 py-3 bg-main text-main-foreground rounded-base font-semibold hover:opacity-90 transition-opacity"
                  >
                    🔓 Unlock Vault
                  </button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Don't have a vault?{' '}
                    <button 
                      onClick={handleReset}
                      className="text-main hover:underline"
                    >
                      Create new vault
                    </button>
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-secondary-background rounded-base border border-border text-center">
                    <div className="text-3xl mb-3">🔐</div>
                    <div className="font-semibold mb-2">Client-Side Encryption</div>
                    <div className="text-sm text-muted-foreground">
                      All data is encrypted in your browser before leaving your device
                    </div>
                  </div>
                  <div className="p-5 bg-secondary-background rounded-base border border-border text-center">
                    <div className="text-3xl mb-3">🔑</div>
                    <div className="font-semibold mb-2">You Own the Keys</div>
                    <div className="text-sm text-muted-foreground">
                      Only you can decrypt your data. We never see your password
                    </div>
                  </div>
                  <div className="p-5 bg-secondary-background rounded-base border border-border text-center">
                    <div className="text-3xl mb-3">🌐</div>
                    <div className="font-semibold mb-2">Blockchain Verified</div>
                    <div className="text-sm text-muted-foreground">
                      Optionally verify file ownership on the blockchain
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <VaultUnlockModal 
                onUnlock={handleUnlock} 
                onReset={handleReset} 
                onCancel={handleCancelUnlock} 
              />
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 bg-secondary-background rounded-base p-5 sm:p-6 border border-border">
                <div className="flex gap-2 mb-5">
                  <button
                    className={`flex-1 px-4 py-2.5 rounded-base border transition-all ${
                      activeTab === 'files' 
                        ? 'bg-main text-main-foreground border-main' 
                        : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                    }`}
                    onClick={() => setActiveTab('files')}
                  >
                    📁 Files
                  </button>
                  <button
                    className={`flex-1 px-4 py-2.5 rounded-base border transition-all ${
                      activeTab === 'notes' 
                        ? 'bg-main text-main-foreground border-main' 
                        : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                    }`}
                    onClick={() => setActiveTab('notes')}
                  >
                    📝 Notes
                  </button>
                </div>
                
                {activeTab === 'files' && (
                  <FileUpload onUpload={handleFileUpload} />
                )}
                
                {activeTab === 'notes' && (
                  <NoteEditor onSave={handleNoteSave} />
                )}
              </div>
              
              <div className="lg:col-span-8 bg-secondary-background rounded-base p-5 sm:p-6 border border-border">
                <FileList
                  files={files}
                  onDownload={handleFileDownload}
                  onDelete={handleFileDelete}
                />
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-3">
                Your files are encrypted and stored locally. Lock the vault to require password on next access.
              </p>
              <button 
                onClick={handleLock} 
                className="px-6 py-3 bg-secondary-background border border-border rounded-base hover:bg-background transition-colors font-medium inline-flex items-center gap-2"
              >
                <span>🔒</span>
                <span>Lock Vault</span>
              </button>
            </div>
            
            <StatusBar
              walletConnected={!!walletAddress}
              ipfsConnected={false}
              encryptionReady={!!password}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;