import React, { useState, useEffect, useRef } from 'react';
import SetupModal from './components/SetupModal';
import VaultUnlockModal from './components/VaultUnlockModal';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import NoteEditor from './components/NoteEditor';
import WalletConnect from './components/WalletConnect';
import ErrorModal from './components/ErrorModal';
import ConfirmModal from './components/ConfirmModal';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SettingsModal from './components/SettingsModal';
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
  getUnsyncedFiles,
  getSyncedFiles,
  markFileAsSynced,
  markAllFilesAsSynced
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
const LAST_ACTIVITY_KEY = 'ownnet-vault-last-activity';

function App() {
  const { isDark, toggle: toggleTheme } = useTheme();
  const [isSetup, setIsSetup] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
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
  const [showSettings, setShowSettings] = useState(false);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [syncStatus, setSyncStatus] = useState({
    hasUnsyncedFiles: false,
    unsyncedCount: 0,
    lastSyncTime: null,
    isSyncing: false,
    syncError: null
  });
  
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
    
    const unsyncedFiles = files.filter(f => !f.synced);
    setSyncStatus(prev => ({
      ...prev,
      hasUnsyncedFiles: unsyncedFiles.length > 0,
      unsyncedCount: unsyncedFiles.length
    }));
  }, [files]);
  
  useEffect(() => {
    if (!isLocked && password) {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    }
  }, [isLocked, password]);
  
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
    
    let wallet;
    try {
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
          
          // Check if this wallet already has a vault on-chain
          const existingVault = await hasVaultWithInternalWallet(wallet.address);
          if (existingVault) {
            setConfirmMessage('This recovery phrase is linked to an existing vault on the blockchain.\n\nIf you continue:\n• A NEW empty vault will be created\n• The old vault will remain on the blockchain\n• Both vaults will share the same recovery phrase\n\nFor better security, consider generating a NEW recovery phrase for a fresh start.\n\nDo you want to continue with this recovery phrase?');
            setConfirmTitle('Existing Vault Detected');
            setConfirmAction(() => async () => {
              setConfirmMessage(null);
              setConfirmTitle(null);
              await createNewVault(masterPassword, passwordHash);
            });
            setupInProgress.current = false;
            return;
          }
        } catch (e) {
          console.warn('Could not initialize blockchain:', e.message);
          setBlockchainReady(false);
        }
      }
    } catch (e) {
      console.error('Failed to create internal wallet:', e);
      setupInProgress.current = false;
      return;
    }
    
    await createNewVault(masterPassword, passwordHash);
  };
  
  const createNewVault = async (masterPassword, passwordHash) => {
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
    setConfirmMessage('This will delete all your local data, files, and wallet.\n\n⚠️ SECURITY WARNING: Your recovery phrase can still be used on other browsers/devices to access your old vault. If you want to completely revoke access:\n• Anyone with your old recovery phrase can still restore your vault\n• Create a NEW vault with a NEW recovery phrase if you want to revoke old access\n• This action cannot be undone');
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
  
  const handleExportAllData = async () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      vaultId: vaultId,
      walletAddress: internalWallet?.address,
      files: files,
      manifestCID: manifestCID,
      settings: localStorage.getItem('ownnet-vault-settings'),
      lastActivity: localStorage.getItem(LAST_ACTIVITY_KEY)
    };
    
    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ownnet-vault-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleDeleteAllData = () => {
    setConfirmMessage('This will permanently delete ALL your data from this device, IPFS references, and clear all blockchain records. This action cannot be undone.');
    setConfirmTitle('Delete All Data');
    setConfirmAction(() => async () => {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ownnet-vault')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
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
      setShowSettings(false);
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
        storageType: storageResult.local ? 'localStorage' : 'IPFS',
        synced: false
      };
      
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
      
      const unsyncedFiles = getUnsyncedFiles(updatedManifest);
      setSyncStatus({
        ...syncStatus,
        hasUnsyncedFiles: unsyncedFiles.length > 0,
        unsyncedCount: unsyncedFiles.length
      });
      
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMessage('Failed to encrypt and upload file. Please try again.');
setErrorTitle('Upload Error');
    }
  };
  
  const handleSyncToBlockchain = async () => {
    if (!blockchainReady || needsGas) {
      setErrorMessage('Blockchain sync requires ETH. Go to Settings and click "Get Free ETH" to get test ETH from a faucet.');
      setErrorTitle('Sync Requires ETH');
      return;
    }
    
    const unsyncedFiles = files.filter(f => !f.synced);
    
    if (unsyncedFiles.length === 0) {
      setErrorMessage('All files are already synchronized to the blockchain.');
      setErrorTitle('Already Synced');
      return;
    }
    
    setSyncStatus({ ...syncStatus, isSyncing: true, syncError: null });
    
    try {
      const currentManifest = manifest || createManifest(vaultId);
      const manifestCID = await syncManifestToIPFS(currentManifest);
      
      if (!manifestCID) {
        throw new Error('Failed to upload manifest to IPFS');
      }
      
      await updateManifestWithInternalWallet(manifestCID);
      
      const updatedManifest = markAllFilesAsSynced(currentManifest);
      setManifest(updatedManifest);
      
      const updatedFiles = files.map(f => ({ ...f, synced: true }));
      setFiles(updatedFiles);
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(updatedFiles));
      
      setSyncStatus({
        hasUnsyncedFiles: false,
        unsyncedCount: 0,
        lastSyncTime: Date.now(),
        isSyncing: false,
        syncError: null
      });
      
      console.log(`Successfully synced ${unsyncedFiles.length} file(s) to blockchain`);
      
    } catch (error) {
      console.error('Blockchain sync failed:', error);
      setSyncStatus({
        ...syncStatus,
        isSyncing: false,
        syncError: error.message
      });
      
      if (error.message?.includes('insufficient funds') || error.message?.includes('gas')) {
        setNeedsGas(true);
        setErrorMessage('Insufficient ETH for blockchain sync. Get free test ETH from a faucet in Settings.');
      } else {
        setErrorMessage(`Failed to sync to blockchain: ${error.message}`);
      }
      setErrorTitle('Sync Failed');
    }
  };
  
  const handleSyncSingleFile = async (fileId) => {
    if (!blockchainReady || needsGas) {
      setErrorMessage('Blockchain sync requires ETH. Go to Settings and click "Get Free ETH" to get test ETH from a faucet.');
      setErrorTitle('Sync Requires ETH');
      return;
    }
    
    const fileToSync = files.find(f => f.id === fileId);
    if (!fileToSync || fileToSync.synced) {
      return;
    }
    
    setSyncStatus({ ...syncStatus, isSyncing: true, syncError: null });
    
    try {
      const currentManifest = manifest || createManifest(vaultId);
      const manifestCID = await syncManifestToIPFS(currentManifest);
      
      if (!manifestCID) {
        throw new Error('Failed to upload manifest to IPFS');
      }
      
      await updateManifestWithInternalWallet(manifestCID);
      
      const updatedManifest = markFileAsSynced(currentManifest, fileId);
      setManifest(updatedManifest);
      
      const updatedFiles = files.map(f => 
        f.id === fileId ? { ...f, synced: true, syncedAt: Date.now() } : f
      );
      setFiles(updatedFiles);
      localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(updatedFiles));
      
      const remainingUnsynced = updatedFiles.filter(f => !f.synced).length;
      setSyncStatus({
        ...syncStatus,
        hasUnsyncedFiles: remainingUnsynced > 0,
        unsyncedCount: remainingUnsynced,
        isSyncing: false
      });
      
      console.log(`Successfully synced file to blockchain: ${fileToSync.name}`);
      
    } catch (error) {
      console.error('File sync failed:', error);
      setSyncStatus({
        ...syncStatus,
        isSyncing: false,
        syncError: error.message
      });
      
      if (error.message?.includes('insufficient funds') || error.message?.includes('gas')) {
        setNeedsGas(true);
        setErrorMessage('Insufficient ETH for blockchain sync. Get free test ETH from a faucet in Settings.');
      } else {
        setErrorMessage(`Failed to sync file: ${error.message}`);
      }
      setErrorTitle('Sync Failed');
    }
  };
  
  const checkUnsyncedFiles = () => {
    const unsynced = files.filter(f => !f.synced);
    const unsyncedManifestFiles = manifest ? getUnsyncedFiles(manifest) : [];
    
    setSyncStatus(prev => ({
      ...prev,
      hasUnsyncedFiles: unsynced.length > 0 || unsyncedManifestFiles.length > 0,
      unsyncedCount: Math.max(unsynced.length, unsyncedManifestFiles.length)
    }));
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
          <div className="w-16 h-16 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isLocked={isLocked}
        onLock={handleLock}
        internalWallet={internalWallet?.address}
        ipfsConnected={ipfsReady}
        encryptionReady={!!password}
        walletBalance={walletBalance}
        needsGas={needsGas}
        blockchainReady={blockchainReady}
        onThemeToggle={toggleTheme}
        isDark={isDark}
        onOpenSettings={() => setShowSettings(true)}
      />
      
      {isSetup ? (
        showSetupModal ? (
          <SetupModal 
            onComplete={handleSetupComplete} 
            onUseRecovery={handleUseRecoveryFromSetup}
            onCancel={() => setShowSetupModal(false)}
          />
        ) : (
          <HeroSection onGetStarted={() => setShowSetupModal(true)} />
        )
      ) : isLocked ? (
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-main/20 to-teal-500/20 flex items-center justify-center">
              <span className="text-3xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Enter your password to unlock your vault</p>
          </div>
          <VaultUnlockModal 
            onUnlock={handleUnlock} 
            onReset={handleReset} 
            onCancel={null}
          />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Dashboard
            files={files}
            walletAddress={internalWallet?.address}
            blockchainReady={blockchainReady}
            ipfsConnected={ipfsReady}
            needsGas={needsGas}
            syncStatus={syncStatus}
            onSyncAll={handleSyncToBlockchain}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            <div className="lg:col-span-4 bg-secondary-background rounded-lg p-6 border border-border">
              <div className="flex gap-2 mb-5">
                <button
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-all font-medium ${
                    activeTab === 'files' 
                      ? 'bg-main text-white border-transparent' 
                      : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-main/50'
                  }`}
                  onClick={() => setActiveTab('files')}
                >
                  📁 Files
                </button>
                <button
                  className={`flex-1 px-4 py-2.5 rounded-lg border transition-all font-medium ${
                    activeTab === 'notes' 
                      ? 'bg-main text-white border-transparent' 
                      : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-main/50'
                  }`}
                  onClick={() => setActiveTab('notes')}
                >
                  📝 Notes
                </button>
              </div>
              
              {activeTab === 'files' && (
                <FileUpload 
                  onUpload={handleFileUpload}
                  needsGas={needsGas}
                  blockchainReady={blockchainReady}
                />
              )}
              
              {activeTab === 'notes' && (
                <NoteEditor onSave={handleNoteSave} />
              )}
            </div>
            
            <div className="lg:col-span-8 bg-secondary-background rounded-lg p-6 border border-border">
              <FileList
                files={files}
                onDownload={handleFileDownload}
                onDelete={handleFileDelete}
                onSyncFile={handleSyncSingleFile}
                blockchainReady={blockchainReady}
                needsGas={needsGas}
              />
            </div>
          </div>
        </div>
      )}
      
      {showResetConfirm && (
        <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary-background rounded-lg p-6 max-w-md w-full border border-border shadow-xl">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <span>⚠️</span> Create New Vault
            </h3>
            <p className="text-muted-foreground mb-4">
              This will permanently delete your current vault and all encrypted files. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg font-medium hover:bg-secondary-background transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  handleReset();
                }}
                className="flex-1 px-4 py-2 bg-error text-white rounded-lg font-medium hover:bg-red-600 transition-all"
              >
                Delete & Create New
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ErrorModal 
        message={errorMessage}
        title={errorTitle}
        onClose={() => setErrorMessage(null)}
      />
      
      <ConfirmModal
        message={confirmMessage}
        title={confirmTitle}
        confirmText={confirmTitle === 'Delete File' ? 'Delete' : confirmTitle === 'Delete All Data' ? 'Delete Forever' : confirmTitle === 'Existing Vault Detected' ? 'Continue Anyway' : 'Reset'}
        danger={confirmTitle === 'Delete File' || confirmTitle === 'Reset Vault' || confirmTitle === 'Delete All Data'}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirm}
      />
      
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onExportAll={handleExportAllData}
        onDeleteAllData={handleDeleteAllData}
        walletAddress={internalWallet?.address}
      />
    </div>
  );
}

export default App;
