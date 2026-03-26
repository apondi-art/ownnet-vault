import React from 'react';
import { isContractConfigured } from '../utils/web3';

export default function StatusBar({ internalWallet, ipfsConnected, encryptionReady }) {
  const contractReady = isContractConfigured();
  
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
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${contractReady ? 'bg-success' : 'bg-warning'}`}></span>
        <span className="truncate">
          {contractReady 
            ? (internalWallet ? 'Blockchain: Enabled (Auto)' : 'Blockchain: Ready (Contract Deployed)') 
            : 'Blockchain: Not Deployed'}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-sm mt-2">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${ipfsConnected ? 'bg-success' : 'bg-muted-foreground'}`}></span>
        <span className="truncate">Storage: {ipfsConnected ? 'IPFS' : 'Local'}</span>
      </div>
      
      {contractReady && !internalWallet && encryptionReady && (
        <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
          <p>Unlock vault to enable blockchain sync.</p>
        </div>
      )}
      
      {internalWallet && (
        <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
          <p>Blockchain sync active.</p>
          <p className="mt-1">Files synced across devices.</p>
        </div>
      )}
    </div>
  );
}