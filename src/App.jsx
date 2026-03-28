import React, { useState, useEffect, useRef } from 'react';
import SetupModal from './components/SetupModal';
import VaultUnlockModal from './components/VaultUnlockModal';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import NoteEditor from './components/NoteEditor';
import WalletConnect from './components/WalletConnect';
import StatusBar from './components/StatusBar';
import ErrorModal from './components/ErrorModal';
import ConfirmModal from './components/ConfirmModal';
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
  downloadFromIPFS,
  initIPFS,
  isPinataConfigured,
  deleteFromLocalStorage
} from './utils/ipfs';
import {
  hashPassword,
  verifyPassword
} from './utils/encryption';
import {
  connectWallet,
  registerFileHash,
  getUserFiles,
  getWalletAddress,
  getBalance,
  formatAddress,
  updateManifestOnChain,
  getManifestFromChain,
  hasVaultOnChain,
  isContractConfigured,
  initInternalWallet,
  getInternalWalletAddress,
  getInternalWalletBalance,
  hasEnoughGas,
  updateManifestWithInternalWallet,
  registerFileHashWithInternalWallet,
  getManifestFromInternalWallet,
  hasVaultWithInternalWallet
} from './utils/web3';
import {
  createManifest,
  addFileToManifest,
  removeFileFromManifest,
  encryptManifest,
  decryptManifest,
  getManifestIdForVault,
  getManifestSummary
} from './utils/manifest';
import {
  createAndStoreWallet,
  restoreWalletFromMnemonic,
  restoreWalletFromEncrypted,
  getStoredWallet,
  clearStoredWallet
} from './utils/wallet';

const STORAGE_KEY_VAULT = 'ownnet-vault-data';
const STORAGE_KEY_PASSWORD_HASH = 'ownnet-vault-password-hash';
const STORAGE_KEY_FILES = 'ownnet-vault-files';
const STORAGE_KEY_RECOVERY = 'ownnet-vault-recovery-hash';
const STORAGE_KEY_VAULT_ID = 'ownnet-vault-id';
const STORAGE_KEY_MANIFEST_CID = 'ownnet-vault-manifest-cid';
const STORAGE_KEY_ENCRYPTED_PASSWORD = 'ownnet-vault-encrypted-password';

function App() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [isSetup, setIsSetup] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [password, setPassword] = useState(null);
  const [files, setFiles] = useState([]);
  const [manifest, setManifest] = useState(null);
  const [vaultId, setVaultId] = useState(null);
  const [manifestCID, setManifestCID] = useState(null);
  const [internalWallet, setInternalWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [activeTab, setActiveTab] = useState('files');
const [loading, setLoading] = useState(true);
  const [ipfsReady, setIpfsReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [blockchainReady, setBlockchainReady] = useState(false);
  const [needsGas, setNeedsGas] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorTitle, setErrorTitle] = useState('Error');
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('Confirm');
  const [confirmAction, setConfirmAction] = useState(null);
  const [pendingRecoveryPhrase, setPendingRecoveryPhrase] = useState(null);
  
  const setupInProgress = useRef(false);
  
  const syncManifestToIPFS = async (manifestToSync, passwordOverride) => {
    const currentPassword = passwordOverride || password;
    if (!currentPassword) {
      console.error('No password available for manifest sync');
      return null;
    }
    
    try {
      const encryptedManifest = await encryptManifest(manifestToSync, currentPassword);
      const manifestBlob = new TextEncoder().encode(encryptedManifest);
      const result = await uploadToIPFS(manifestBlob);
      
      if (!result || !result.hash) {
        throw new Error('Failed to upload manifest to IPFS');
      }
      
      const manifestCID = result.hash;
      localStorage.setItem(STORAGE_KEY_MANIFEST_CID, manifestCID);
      setManifestCID(manifestCID);
      
      if (isContractConfigured() && internalWallet) {
        try {
          const hasGas = await hasEnoughGas();
          if (!hasGas) {
            setNeedsGas(true);
            console.warn('Insufficient ETH for blockchain sync. Need at least 0.001 ETH.');
            return manifestCID;
          }
          
          await updateManifestWithInternalWallet(manifestCID);
          console.log('Manifest synced to blockchain:', manifestCID);
          setSyncError(null);
        } catch (blockchainError) {
          console.error('Failed to sync to blockchain:', blockchainError);
          
          if (blockchainError.message?.includes('insufficient funds') || 
              blockchainError.message?.includes('gas')) {
            setNeedsGas(true);
            setSyncError('NeedSepoliaETH for blockchain sync. Get free ETH from faucet.');
          } else {
            setSyncError(blockchainError.message);
          }
        }
      }
      
      return manifestCID;
    } catch (error) {
      console.error('Failed to sync manifest:', error);
      throw error;
    }
  };
  
  const loadManifestFromIPFS = async (cid, passwordOverride) => {
    const currentPassword = passwordOverride || password;
    if (!currentPassword) {
      console.error('No password available for manifest decryption');
      return null;
    }
    
    try {
      const encryptedManifest = await downloadFromIPFS(cid);
      if (!encryptedManifest) {
        throw new Error('Failed to download manifest from IPFS');
      }
      
      const encryptedText = String.fromCharCode(...encryptedManifest);
      const manifestData = await decryptManifest(encryptedText, currentPassword);
      
      return manifestData;
    } catch (error) {
      console.error('Failed to load manifest from IPFS:', error);
      return null;
    }
  };
  
  useEffect(() => {
    const storedPasswordHash = localStorage.getItem(STORAGE_KEY_PASSWORD_HASH);
    const storedFiles = localStorage.getItem(STORAGE_KEY_FILES);
    const storedVaultId = localStorage.getItem(STORAGE_KEY_VAULT_ID);
    const storedManifestCID = localStorage.getItem(STORAGE_KEY_MANIFEST_CID);
    
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
    
    if (storedVaultId) {
      setVaultId(storedVaultId);
    }
    
    if (storedManifestCID) {
      setManifestCID(storedManifestCID);
    }
    
    initIPFS();
    setIpfsReady(isPinataConfigured());
    
    setLoading(false);
  }, []);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(files));
  }, [files]);
  
  const handleSetupComplete = async (masterPassword, recoveryPhrase, isCancelled) => {
    if (setupInProgress.current) {
      return;
    }
    setupInProgress.current = true;
    
    if (isCancelled) {
      setIsSetup(false);
      setShowUnlockModal(false);
      setupInProgress.current = false;
      return;
    }
    
    if (!masterPassword) {
      setupInProgress.current = false;
      return;
    }
    
    const strength = checkPasswordStrength(masterPassword);
    if (strength === 'weak') {
      setErrorMessage('Please choose a stronger password. Include uppercase, lowercase, numbers, and special characters.');
      setErrorTitle('Weak Password');
      setupInProgress.current = false;
      return;
    }
    
    const passwordHash = await hashPassword(masterPassword);
    localStorage.setItem(STORAGE_KEY_PASSWORD_HASH, passwordHash);
    
    if (recoveryPhrase) {
      const recoveryHash = await hashPassword(recoveryPhrase);
      localStorage.setItem(STORAGE_KEY_RECOVERY, recoveryHash);
      
      const encryptedPassword = await encryptText(masterPassword, recoveryPhrase);
      localStorage.setItem(STORAGE_KEY_ENCRYPTED_PASSWORD, encryptedPassword);
    }
    
    try {
      let wallet;
      if (recoveryPhrase) {
        wallet = await restoreWalletFromMnemonic(recoveryPhrase, masterPassword);
        console.log('Wallet restored from recovery phrase:', formatAddress(wallet.address));
      } else {
        wallet = await createAndStoreWallet(masterPassword);
        console.log('Internal wallet created:', formatAddress(wallet.address));
      }
      setInternalWallet(wallet);
      setWalletAddress(wallet.address);
      
      if (isContractConfigured() && wallet.privateKey) {
        try {
          await initInternalWallet(wallet.privateKey);
          const balance = await getInternalWalletBalance();
          setWalletBalance(balance);
          setBlockchainReady(true);
          setNeedsGas(!balance || parseFloat(balance) < 0.001);
          console.log('Blockchain ready. Balance:', balance, 'ETH');
        } catch (e) {
          console.warn('Could not initialize blockchain:', e.message);
          setBlockchainReady(false);
        }
      }
    } catch (e) {
      console.error('Failed to create internal wallet:', e);
    }
    
    const newManifest = createManifest(null);
    setManifest(newManifest);
    setVaultId(newManifest.vaultId);
    localStorage.setItem(STORAGE_KEY_VAULT_ID, newManifest.vaultId);
    
    try {
      await syncManifestToIPFS(newManifest, masterPassword);
    } catch (e) {
      console.error('Initial manifest sync failed:', e);
    }
    
    setPassword(masterPassword);
    setIsSetup(false);
    setIsLocked(false);
    setShowUnlockModal(false);
    setupInProgress.current = false;
  };

const handleUnlock = async (enteredCredential, isRecoveryPhrase = false, providedPassword = null) => {
    const storedHash = localStorage.getItem(STORAGE_KEY_PASSWORD_HASH);
    const storedRecovery = localStorage.getItem(STORAGE_KEY_RECOVERY);
    const storedVaultId = localStorage.getItem(STORAGE_KEY_VAULT_ID);
    const storedManifestCID = localStorage.getItem(STORAGE_KEY_MANIFEST_CID);
    const storedEncryptedPassword = localStorage.getItem(STORAGE_KEY_ENCRYPTED_PASSWORD);
    
    let verified = false;
    let restoredWalletAddress = null;
    let unlockPassword = null;
    
    if (isRecoveryPhrase) {
      const cleanPhrase = enteredCredential.toLowerCase().trim();
      const words = cleanPhrase.split(/\s+/).filter(w => w.length > 0);
      
      if (words.length !== 12) {
        setErrorMessage('Recovery phrase must be exactly 12 words.');
        setErrorTitle('Invalid Recovery Phrase');
        return;
      }
      
      try {
        const { getWalletFromMnemonic } = await import('./utils/wallet');
        const tempWallet = await getWalletFromMnemonic(cleanPhrase);
        restoredWalletAddress = tempWallet.address;
        
        const storedEncryptedPasswordForRecovery = storedEncryptedPassword;
        
        if (storedEncryptedPasswordForRecovery) {
          try {
            unlockPassword = await decryptText(storedEncryptedPasswordForRecovery, cleanPhrase);
          } catch (e) {
            console.error('Failed to decrypt master password:', e);
          }
        }
        
        if (!unlockPassword && providedPassword) {
          unlockPassword = providedPassword;
        }
        
        if (!unlockPassword) {
          setErrorMessage('Please enter your password in the recovery modal to complete vault recovery.');
          setErrorTitle('Password Required');
          return;
        }
        
        const wallet = await restoreWalletFromMnemonic(cleanPhrase, unlockPassword);
        setInternalWallet(wallet);
        setWalletAddress(wallet.address);
        console.log('Wallet restored from recovery phrase:', formatAddress(wallet.address));
        
        if (isContractConfigured() && wallet.privateKey) {
          try {
            await initInternalWallet(wallet.privateKey);
            const balance = await getInternalWalletBalance();
            setWalletBalance(balance);
            setBlockchainReady(true);
            setNeedsGas(!balance || parseFloat(balance) < 0.001);
          } catch (e) {
            console.warn('Could not initialize blockchain:', e.message);
          }
        }
        
        if (!storedRecovery) {
          const recoveryHash = await hashPassword(cleanPhrase);
          localStorage.setItem(STORAGE_KEY_RECOVERY, recoveryHash);
          
          const encryptedPassword = await encryptText(unlockPassword, cleanPhrase);
          localStorage.setItem(STORAGE_KEY_ENCRYPTED_PASSWORD, encryptedPassword);
          
          const passwordHash = await hashPassword(unlockPassword);
          localStorage.setItem(STORAGE_KEY_PASSWORD_HASH, passwordHash);
        }
        
        verified = true;
      } catch (e) {
        console.error('Failed to restore wallet from mnemonic:', e);
        setErrorMessage('The recovery phrase you entered is invalid. Please check your 12 words and try again.');
        setErrorTitle('Invalid Recovery Phrase');
        return;
      }
    } else {
      if (storedHash && await verifyPassword(enteredCredential, storedHash)) {
        verified = true;
        unlockPassword = enteredCredential;
        
        try {
          const storedWalletData = getStoredWallet();
          if (storedWalletData && storedWalletData.encryptedPrivateKey) {
            const wallet = await restoreWalletFromEncrypted(storedWalletData.encryptedPrivateKey, enteredCredential);
            restoredWalletAddress = wallet.address;
            setInternalWallet(wallet);
            setWalletAddress(wallet.address);
            console.log('Wallet restored from encrypted key:', formatAddress(wallet.address));
            
            if (isContractConfigured() && wallet.privateKey) {
              try {
                await initInternalWallet(wallet.privateKey);
                const balance = await getInternalWalletBalance();
                setWalletBalance(balance);
                setBlockchainReady(true);
                setNeedsGas(!balance || parseFloat(balance) < 0.001);
              } catch (e) {
                console.warn('Could not initialize blockchain:', e.message);
              }
            }
          }
        } catch (e) {
          console.error('Failed to restore internal wallet:', e);
        }
      } else {
        setErrorMessage('The password you entered is incorrect. Please try again.');
        setErrorTitle('Incorrect Password');
        return;
      }
    }
    
    if (verified && unlockPassword) {
      setPassword(unlockPassword);
      
      let manifestLoaded = false;
      const walletAddr = restoredWalletAddress || walletAddress;
      
      if (walletAddr && isContractConfigured()) {
        try {
          const onChainManifest = await getManifestFromInternalWallet(walletAddr);
          if (onChainManifest && onChainManifest.manifestCID) {
            const manifestData = await loadManifestFromIPFS(onChainManifest.manifestCID, unlockPassword);
            if (manifestData && manifestData.files) {
              setManifest(manifestData);
              setFiles(manifestData.files);
              setVaultId(manifestData.vaultId);
              localStorage.setItem(STORAGE_KEY_MANIFEST_CID, onChainManifest.manifestCID);
              if (manifestData.vaultId) {
                localStorage.setItem(STORAGE_KEY_VAULT_ID, manifestData.vaultId);
              }
              manifestLoaded = true;
              console.log('Manifest loaded from blockchain:', manifestData.files.length, 'files');
            }
          }
        } catch (e) {
          console.error('Failed to load from blockchain:', e);
        }
      }
      
      if (!manifestLoaded && storedManifestCID) {
        try {
          const manifestData = await loadManifestFromIPFS(storedManifestCID, unlockPassword);
          if (manifestData && manifestData.files) {
            setManifest(manifestData);
            setFiles(manifestData.files);
            setVaultId(manifestData.vaultId);
            manifestLoaded = true;
            console.log('Manifest loaded from IPFS CID:', manifestData.files.length, 'files');
          }
        } catch (e) {
          console.error('Failed to load manifest from IPFS:', e);
        }
      }
      
      if (!manifestLoaded) {
        const storedFiles = localStorage.getItem(STORAGE_KEY_FILES);
        if (storedFiles) {
          try {
            setFiles(JSON.parse(storedFiles));
            console.log('Files loaded from localStorage');
          } catch (e) {
            console.error('Failed to parse stored files:', e);
          }
        }
      }
      
      if (storedVaultId) {
        setVaultId(storedVaultId);
      }
      
      setIsLocked(false);
      setShowUnlockModal(false);
    }
  };

  const handleReset = () => {
    setConfirmMessage('This will delete all your encrypted data, files, and wallet. This action cannot be undone.');
    setConfirmTitle('Reset Vault');
    setConfirmAction(() => () => {
      localStorage.removeItem(STORAGE_KEY_PASSWORD_HASH);
      localStorage.removeItem(STORAGE_KEY_FILES);
      localStorage.removeItem(STORAGE_KEY_VAULT);
      localStorage.removeItem(STORAGE_KEY_RECOVERY);
      localStorage.removeItem(STORAGE_KEY_VAULT_ID);
      localStorage.removeItem(STORAGE_KEY_MANIFEST_CID);
      localStorage.removeItem(STORAGE_KEY_ENCRYPTED_PASSWORD);
      clearStoredWallet();
      setFiles([]);
      setManifest(null);
      setVaultId(null);
      setManifestCID(null);
      setPassword(null);
      setInternalWallet(null);
      setWalletAddress(null);
      setIsSetup(true);
      setIsLocked(true);
      setConfirmMessage(null);
    });
  };
  
  const handleConfirmAction = () => {
    if (confirmAction) {
      confirmAction();
    }
    setConfirmMessage(null);
    setConfirmAction(null);
  };
  
  const handleCancelConfirm = () => {
    setConfirmMessage(null);
    setConfirmAction(null);
  };

  const handleFileUpload = async (file) => {
    try {
      const encrypted = await encryptFile(file, password);
      const storageResult = await uploadToIPFS(encrypted.data);
      
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        encryptedSize: encrypted.encryptedSize,
        timestamp: Date.now(),
        storageKey: storageResult.hash,
        ipfsHash: storageResult.hash,
        isLocal: storageResult.local,
        storageType: storageResult.local ? 'localStorage' : 'IPFS'
      };
      
      if (!storageResult.local && isContractConfigured() && internalWallet) {
        try {
          const hasGas = await hasEnoughGas();
          if (hasGas) {
            await registerFileHashWithInternalWallet(storageResult.hash);
            newFile.onChain = true;
            console.log('File registered on blockchain:', storageResult.hash);
          } else {
            setNeedsGas(true);
            console.warn('Skipping blockchain registration - insufficient ETH');
          }
        } catch (e) {
          console.error('Failed to register file on blockchain:', e);
          if (e.message?.includes('insufficient funds') || e.message?.includes('gas')) {
            setNeedsGas(true);
          }
        }
      }
      
      const updatedFiles = [newFile, ...files];
      setFiles(updatedFiles);
      
      let currentManifest = manifest;
      if (!currentManifest) {
        currentManifest = createManifest(vaultId);
        setManifest(currentManifest);
      }
      
      const updatedManifest = addFileToManifest(currentManifest, newFile);
      setManifest(updatedManifest);
      
      try {
        await syncManifestToIPFS(updatedManifest);
      } catch (e) {
        console.error('Failed to sync manifest:', e);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMessage('Failed to encrypt and upload file. Please try again.');
      setErrorTitle('Upload Error');
    }
  };

  const handleFileDownload = async (file) => {
    try {
      let encryptedData;
      
      if (file.isLocal) {
        encryptedData = loadFromLocalStorage(file.storageKey);
      } else {
        encryptedData = await downloadFromIPFS(file.ipfsHash || file.storageKey);
      }
      
      if (!encryptedData) {
        setErrorMessage('File data not found. It may have been deleted from storage.');
        setErrorTitle('Download Error');
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
      setErrorMessage('Failed to decrypt file. There may be an issue with the encryption key.');
      setErrorTitle('Download Error');
    }
  };

  const handleFileDelete = async (fileId) => {
    setConfirmMessage('Are you sure you want to delete this file? It will be removed from your vault but remain on IPFS as encrypted backup.');
    setConfirmTitle('Delete File');
    setConfirmAction(() => async () => {
      const fileToDelete = files.find(f => f.id === fileId);
      
      // Remove from localStorage if stored locally
      if (fileToDelete && fileToDelete.isLocal && fileToDelete.storageKey) {
        await deleteFromLocalStorage(fileToDelete.storageKey);
      }
      
      const updatedFiles = files.filter(f => f.id !== fileId);
      setFiles(updatedFiles);
      
      if (manifest) {
        const updatedManifest = removeFileFromManifest(manifest, fileId);
        setManifest(updatedManifest);
        
        try {
          await syncManifestToIPFS(updatedManifest);
        } catch (e) {
          console.error('Failed to sync manifest after delete:', e);
        }
      }
      setConfirmMessage(null);
      setConfirmAction(null);
    });
  };

  const handleNoteSave = async (title, content) => {
    try {
      const encrypted = await encryptText(content, password);
      const storageResult = await uploadToIPFS(new TextEncoder().encode(encrypted));
      
      const newNote = {
        id: Date.now().toString(),
        name: title + '.txt',
        type: 'text/plain',
        size: content.length,
        timestamp: Date.now(),
        storageKey: storageResult.hash,
        ipfsHash: storageResult.hash,
        isNote: true,
        storageType: storageResult.local ? 'localStorage' : 'IPFS'
      };
      
      const updatedFiles = [newNote, ...files];
      setFiles(updatedFiles);
      
      let currentManifest = manifest;
      if (!currentManifest) {
        currentManifest = createManifest(vaultId);
        setManifest(currentManifest);
      }
      
      const updatedManifest = addFileToManifest(currentManifest, newNote);
      setManifest(updatedManifest);
      
      try {
        await syncManifestToIPFS(updatedManifest);
      } catch (e) {
        console.error('Failed to sync manifest:', e);
      }
    } catch (error) {
      console.error('Save note failed:', error);
      setErrorMessage('Failed to save note. Please try again.');
      setErrorTitle('Save Error');
    }
  };

  const handleWalletConnect = async () => {
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      const balance = await getBalance();
      setWalletBalance(balance);
      
      if (!isLocked && password) {
        try {
          const onChainManifest = await getManifestFromChain(address);
          if (onChainManifest && onChainManifest.manifestCID) {
            const manifestData = await loadManifestFromIPFS(onChainManifest.manifestCID, password);
            if (manifestData && manifestData.files) {
              setManifest(manifestData);
              setFiles(manifestData.files);
              setVaultId(manifestData.vaultId);
              localStorage.setItem(STORAGE_KEY_VAULT_ID, manifestData.vaultId);
            }
          }
        } catch (e) {
          console.warn('Could not load on-chain manifest:', e.message);
        }
      }
      
      return address;
    } catch (error) {
      if (!error.message?.includes('MetaMask')) {
        console.error('Wallet connect error:', error);
      }
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
  
  const handleUseRecoveryFromSetup = () => {
    setIsSetup(false);
    setIsLocked(true);
    setShowUnlockModal(true);
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
              {syncing && <span className="text-xs text-main animate-pulse">Syncing...</span>}
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
            
            {internalWallet && !isLocked && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-background border border-border rounded-base text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span className="font-mono">{formatAddress(internalWallet.address)}</span>
                <span className="text-xs opacity-60">(Auto)</span>
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
            
            <SetupModal onComplete={handleSetupComplete} onUseRecovery={handleUseRecoveryFromSetup} />
            
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
                <div className="font-semibold mb-2">Blockchain Synced</div>
                <div className="text-sm text-muted-foreground">
                  Connect wallet to sync your file list across devices
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
                    Your files are encrypted and stored on IPFS. Unlock to access them from any device.
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
                    <div className="font-semibold mb-2">Blockchain Synced</div>
                    <div className="text-sm text-muted-foreground">
                      Connect wallet to sync your file list across devices
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
                
                {vaultId && (
                  <div className="mt-4 p-3 bg-background rounded-base border border-border">
                    <p className="text-xs text-muted-foreground">
                      Vault ID: {vaultId.slice(0, 8)}...{vaultId.slice(-4)}
                    </p>
                  </div>
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
                {walletAddress 
                  ? 'Files are encrypted, stored on IPFS, and synced to blockchain for cross-device access.'
                  : 'Connect wallet to enable cross-device sync via blockchain.'}
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
              internalWallet={internalWallet?.address}
              ipfsConnected={ipfsReady}
              encryptionReady={!!password}
              walletBalance={walletBalance}
              needsGas={needsGas}
              blockchainReady={blockchainReady}
            />
          </>
        )}
      </div>
      
      <ErrorModal 
        message={errorMessage}
        title={errorTitle}
        onClose={() => setErrorMessage(null)}
      />
      
      <ConfirmModal
        message={confirmMessage}
        title={confirmTitle}
        confirmText={confirmTitle === 'Delete File' ? 'Delete' : 'Reset'}
        danger={confirmTitle === 'Delete File' || confirmTitle === 'Reset Vault'}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirm}
      />
    </div>
  );
}

export default App;