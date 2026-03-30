import React, { useState } from 'react';
import Logo from './Logo';
import { isContractConfigured } from '../utils/web3';

export default function Navbar({ 
  isLocked, 
  onLock, 
  internalWallet, 
  ipfsConnected, 
  encryptionReady, 
  walletBalance, 
  needsGas, 
  blockchainReady,
  onThemeToggle,
  isDark,
  onOpenSettings
}) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const contractReady = isContractConfigured();
  
  const hasGas = walletBalance && parseFloat(walletBalance) >= 0.001;
  
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const statusItems = [
    { 
      label: 'Encryption', 
      status: encryptionReady, 
      icon: '🔐',
      tooltip: 'AES-256-GCM client-side encryption'
    },
    { 
      label: 'Storage', 
      status: ipfsConnected, 
      icon: '🌐',
      tooltip: ipfsConnected ? 'Connected to IPFS' : 'Using local storage'
    },
    { 
      label: 'Sync', 
      status: blockchainReady && contractReady, 
      icon: '⛓️',
      tooltip: contractReady 
        ? (blockchainReady ? 'Cross-device sync active' : 'Ready to sync') 
        : 'Contract not configured'
    },
  ];

  const activeStatusCount = statusItems.filter(s => s.status).length;
  const overallHealth = (activeStatusCount / statusItems.length) * 100;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-secondary-background/90 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-4">
              <Logo size="small" showText={true} />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {!isLocked && (
                <button
                  onClick={onOpenSettings}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-secondary-background transition-colors"
                  title="Settings"
                >
                  ⚙️
                </button>
              )}

              <button
                onClick={() => setShowStatusModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg border border-border hover:border-main/50 transition-all"
              >
                <div className="flex items-center gap-1">
                  {statusItems.map((item, index) => (
                    <span
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        item.status ? 'bg-success' : 'bg-border'
                      }`}
                      title={item.tooltip}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {overallHealth === 100 ? 'All Good' : 'Check'}
                </span>
              </button>

              {!isLocked && (
                <button
                  onClick={onLock}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-error text-white rounded-lg hover:bg-red-600 transition-all font-medium text-sm"
                >
                  <span>🔒</span>
                  <span className="hidden sm:inline">Lock</span>
                </button>
              )}

              <button
                onClick={onThemeToggle}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-secondary-background transition-colors"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {showStatusModal && (
        <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowStatusModal(false)}>
          <div className="bg-secondary-background rounded-lg p-6 max-w-md w-full border border-border shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span>📊</span>
                Vault Status
              </h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {statusItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.tooltip}</p>
                    </div>
                  </div>
                  <span className={`w-3 h-3 rounded-full ${item.status ? 'bg-success' : 'bg-border'}`}></span>
                </div>
              ))}
            </div>

            {blockchainReady && internalWallet && (
              <div className="mt-3 p-3 bg-background rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Balance</span>
                  <span className="font-semibold text-foreground">
                    {walletBalance ? `${parseFloat(walletBalance).toFixed(4)} ETH` : '0 ETH'}
                  </span>
                </div>
                {(!hasGas && blockchainReady) && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs text-warning mb-2">⚠️ Need test ETH for blockchain sync</p>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href="https://sepolia-faucet.pk910.de/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-main/10 border border-main/30 rounded text-center text-xs hover:bg-main/20"
                      >
                        PoW Faucet
                      </a>
                      <a
                        href="https://faucet.quicknode.com/ethereum/sepolia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-main/10 border border-main/30 rounded text-center text-xs hover:bg-main/20"
                      >
                        QuickNode
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-3 p-3 bg-success-light dark:bg-success/10 rounded-lg border border-success/30">
              <p className="text-sm text-success font-medium flex items-center gap-2">
                ✓ Your files are encrypted with AES-256
              </p>
            </div>

            <button
              onClick={() => setShowStatusModal(false)}
              className="mt-4 w-full bg-main text-white px-4 py-2.5 rounded-lg font-medium hover:bg-main-dark transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}