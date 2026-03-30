import React, { useState } from 'react';
import { isContractConfigured } from '../utils/web3';

export default function StatusBar({ 
  internalWallet, 
  ipfsConnected, 
  encryptionReady, 
  walletBalance, 
  needsGas, 
  blockchainReady,
  syncStatus,
  onSyncAll
}) {
  const contractReady = isContractConfigured();
  const [showGasGuide, setShowGasGuide] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const hasGas = walletBalance && parseFloat(walletBalance) >= 0.001;
  
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  
  return (
    <>
{showGasGuide && (
        <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50 p-4" onClick={() => setShowGasGuide(false)}>
          <div className="bg-secondary-background rounded-base p-6 max-w-lg border border-border shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">⛽ Get Free Test ETH</h3>
            <p className="text-muted-foreground mb-4">
              Your vault needs a tiny amount of ETH (gas) to sync files to blockchain. This enables cross-device access.
            </p>
            
            <div className="bg-background rounded-base p-4 mb-4">
              <p className="font-semibold mb-2">Your Wallet Address:</p>
              <div className="flex items-center gap-2">
                <code className="text-xs break-all bg-secondary-background px-2 py-1 rounded flex-1">
                  {internalWallet || 'Unlock vault first'}
                </code>
                {internalWallet && (
                  <button 
                    onClick={() => copyToClipboard(internalWallet)}
                    className="px-2 py-1 bg-main text-main-foreground rounded text-xs hover:opacity-90"
                  >
                    {copied ? '✓' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm mb-4">Copy the address above and get free test ETH from any faucet:</p>
            
            <div className="space-y-2 mb-4">
              <a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer" 
                 className="block p-3 bg-main/10 border border-main/30 rounded-base hover:bg-main/20 transition-colors">
                <span className="font-semibold">PoW Faucet</span>
                <span className="text-sm text-muted-foreground ml-2">- Mine in browser, instant</span>
              </a>
              <a href="https://faucet.quicknode.com/ethereum/sepolia" target="_blank" rel="noopener noreferrer"
                 className="block p-3 bg-main/10 border border-main/30 rounded-base hover:bg-main/20 transition-colors">
                <span className="font-semibold">QuickNode Faucet</span>
                <span className="text-sm text-muted-foreground ml-2">- 0.1 ETH free</span>
              </a>
              <a href="https://www.infura.io/faucet/sepolia" target="_blank" rel="noopener noreferrer"
                 className="block p-3 bg-main/10 border border-main/30 rounded-base hover:bg-main/20 transition-colors">
                <span className="font-semibold">Infura Faucet</span>
                <span className="text-sm text-muted-foreground ml-2">- 0.5 ETH free</span>
              </a>
            </div>
            
            <div className="bg-warning/10 border border-warning/30 rounded-base p-3 text-sm">
              <p><strong>💡 Tip:</strong> You only need 0.001 ETH. Files still work without ETH - they just won't sync to blockchain until you add ETH.</p>
            </div>
            
            <button onClick={() => setShowGasGuide(false)}
                    className="mt-4 w-full bg-main text-main-foreground px-4 py-2 rounded-base font-semibold hover:opacity-90">
              Got it, I'll add ETH
            </button>
          </div>
        </div>
      )}
      
      {showWalletInfo && (
        <div className="fixed inset-0 bg-overlay flex items-center justify-center z-50 p-4" onClick={() => setShowWalletInfo(false)}>
          <div className="bg-secondary-background rounded-base p-6 max-w-md border border-border shadow-lg" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">🔑 Your Wallet</h3>
            
            <div className="bg-background rounded-base p-4 mb-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase">Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="text-sm break-all bg-secondary-background px-3 py-2 rounded flex-1">
                  {internalWallet || 'No wallet'}
                </code>
              </div>
              <button 
                onClick={() => internalWallet && copyToClipboard(internalWallet)}
                className="mt-2 w-full px-3 py-2 bg-main text-main-foreground rounded-base text-sm font-medium hover:opacity-90"
              >
                {copied ? '✓ Copied!' : '📋 Copy Address'}
              </button>
            </div>
            
            <div className="bg-background rounded-base p-4 mb-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase">Balance</p>
              <p className="text-lg font-semibold">
                {walletBalance ? `${parseFloat(walletBalance).toFixed(4)} ETH` : '0 ETH'}
              </p>
            </div>
            
            <div className="bg-main/10 border border-main/30 rounded-base p-3 mb-4 text-sm">
              <p className="font-semibold mb-1">💡 Why do I need ETH?</p>
              <p className="text-muted-foreground">
                ETH is used as "gas" to pay for blockchain transactions. You need ~0.001 ETH to sync files to blockchain for cross-device access.
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">Get Free Test ETH:</p>
              <a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer" 
                 className="block p-2 bg-background border border-border rounded-base hover:bg-secondary-background transition-colors text-sm">
                🪙 PoW Faucet - Mine in browser
              </a>
              <a href="https://faucet.quicknode.com/ethereum/sepolia" target="_blank" rel="noopener noreferrer" 
                 className="block p-2 bg-background border border-border rounded-base hover:bg-secondary-background transition-colors text-sm">
                💰 QuickNode Faucet - 0.1 ETH
              </a>
            </div>
            
            <div className="bg-secondary-background border border-border rounded-base p-3 text-xs text-muted-foreground">
              <p className="font-medium mb-1">📝 Recovery Phrase</p>
              <p>Keep your 12-word recovery phrase safe. It's the only way to recover your wallet on another device.</p>
            </div>
            
            <button onClick={() => setShowWalletInfo(false)}
                    className="mt-4 w-full bg-secondary-background border border-border px-4 py-2 rounded-base font-medium hover:bg-background transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-4 right-4 bg-secondary-background border border-border rounded-base p-4 max-w-xs shadow-lg">
        <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Vault Status</div>
        
        {blockchainReady && internalWallet && (
          <button 
            onClick={() => setShowWalletInfo(true)}
            className="w-full mb-2 p-2 bg-background border border-border rounded-base text-xs hover:bg-secondary-background transition-colors text-left"
          >
            <span className="text-muted-foreground">Wallet: </span>
            <span className="font-mono">{formatAddress(internalWallet)}</span>
            <span className="ml-2 text-main">📋</span>
          </button>
        )}
        
        <div className="flex items-center gap-2 text-sm">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${encryptionReady ? 'bg-success' : 'bg-error'}`}></span>
          <span className={encryptionReady ? '' : 'text-error'}>
            Encryption: {encryptionReady ? 'Ready ✓' : 'Not Ready'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm mt-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${contractReady ? 'bg-success' : 'bg-warning'}`}></span>
          <span className="truncate">
            {contractReady 
              ? (blockchainReady ? 'Blockchain: Active' : 'Blockchain: Ready') 
              : 'Blockchain: Not Deployed'}
          </span>
        </div>
        
        {blockchainReady && (
          <div className="flex items-center gap-2 text-sm mt-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${hasGas ? 'bg-success' : 'bg-warning'}`}></span>
            <span className={hasGas ? '' : 'text-warning'}>
              Gas: {walletBalance ? `${parseFloat(walletBalance).toFixed(4)} ETH` : 'Checking...'}
              {!hasGas && needsGas && ' (Low)'}
            </span>
          </div>
        )}
        
        {blockchainReady && syncStatus && (
          <div className="flex items-center gap-2 text-sm mt-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              syncStatus.isSyncing ? 'bg-info animate-pulse' : 
              syncStatus.hasUnsyncedFiles ? 'bg-warning' : 'bg-success'
            }`}></span>
            <span className={syncStatus.hasUnsyncedFiles ? 'text-warning' : ''}>
              {syncStatus.isSyncing 
                ? 'Syncing...' 
                : syncStatus.hasUnsyncedFiles 
                  ? `${syncStatus.unsyncedCount} unsynced` 
                  : 'All synced ✓'}
            </span>
          </div>
        )}
        
        {syncStatus && syncStatus.hasUnsyncedFiles && blockchainReady && !needsGas && onSyncAll && (
          <button 
            onClick={onSyncAll}
            disabled={syncStatus.isSyncing}
            className="mt-3 w-full text-xs bg-main/10 text-main border border-main/30 rounded-base px-3 py-2 hover:bg-main/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncStatus.isSyncing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-main border-t-transparent rounded-full animate-spin" />
                Syncing...
              </span>
            ) : (
              `⬆️ Sync ${syncStatus.unsyncedCount} file${syncStatus.unsyncedCount > 1 ? 's' : ''} to chain`
            )}
          </button>
        )}
        
        <div className="flex items-center gap-2 text-sm mt-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ipfsConnected ? 'bg-success' : 'bg-muted-foreground'}`}></span>
          <span className="truncate">Storage: {ipfsConnected ? 'IPFS' : 'Local'}</span>
        </div>
        
        {needsGas && blockchainReady && (
          <button onClick={() => setShowGasGuide(true)}
                  className="mt-3 w-full text-xs bg-warning/20 text-warning border border-warning/30 rounded-base px-3 py-2 hover:bg-warning/30 transition-colors">
            ⛽ Need Test ETH - Click for Faucets
          </button>
        )}
        
        {blockchainReady && !needsGas && (
          <div className="mt-3 pt-2 border-t border-border text-xs text-success">
            ✓ Cross-device sync active
          </div>
        )}
        
        {!contractReady && (
          <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
            <p>Add contract address to .env for blockchain sync.</p>
          </div>
        )}
      </div>
    </>
  );
}