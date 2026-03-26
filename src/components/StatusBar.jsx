import React from 'react';

export default function StatusBar({ walletConnected, ipfsConnected, encryptionReady }) {
  return (
    <div className="fixed bottom-4 right-4 bg-secondary-background border border-border rounded-base p-4 max-w-xs shadow-lg">
      <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Vault Status</div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${encryptionReady ? 'bg-success' : 'bg-error'}`}></span>
        <span className={encryptionReady ? '' : 'text-error'}>
          Encryption: {encryptionReady ? 'Ready ✓' : 'Not Ready'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm mt-2">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${walletConnected ? 'bg-success' : 'bg-muted-foreground'}`}></span>
        <span className="truncate">Wallet: {walletConnected ? 'Connected' : 'Not Connected'}</span>
      </div>
      <div className="flex items-center gap-2 text-sm mt-2">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ipfsConnected ? 'bg-success' : 'bg-muted-foreground'}`}></span>
        <span className="truncate">Storage: {ipfsConnected ? 'IPFS' : 'Local'}</span>
      </div>
    </div>
  );
}