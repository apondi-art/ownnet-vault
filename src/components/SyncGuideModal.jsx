import React, { useState } from 'react';

export default function SyncGuideModal({ onClose, walletAddress }) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (walletAddress) {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Copy Your Address',
      description: 'Click the button below to copy your unique address',
      action: 'copy',
    },
    {
      number: 2,
      title: 'Open Faucet',
      description: 'Click a faucet link below to get free test tokens',
      action: 'link',
    },
    {
      number: 3,
      title: 'Paste & Submit',
      description: 'Paste your address on the faucet page and submit',
      action: 'none',
    },
    {
      number: 4,
      title: 'Wait & Refresh',
      description: 'Tokens arrive in ~1 minute. Refresh this page to sync!',
      action: 'none',
    },
  ];

  const faucets = [
    { name: 'PoW Faucet', url: 'https://sepolia-faucet.pk910.de/', note: 'Mine in browser, instant' },
    { name: 'QuickNode', url: 'https://faucet.quicknode.com/ethereum/sepolia', note: '0.1 ETH free' },
  ];

  return (
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-secondary-background rounded-lg p-6 max-w-md w-full border border-border shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold">Enable Cross-Device Sync</h3>
            <p className="text-sm text-muted-foreground">Get free tokens in 2 minutes</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background text-muted-foreground">
            ✕
          </button>
        </div>

        <div className="bg-main/10 border border-main/30 rounded-lg p-3 mb-4">
          <p className="text-sm text-foreground">
            💡 <strong>What is this?</strong> Think of it like "sync credits" - a tiny amount needed to save your file list to the network so you can access it from other devices.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-4">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-main text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.number}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Copy Address Button */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-1 block">Your Unique Address:</label>
          <button
            onClick={copyAddress}
            className="w-full p-3 bg-background border border-border rounded-lg text-left hover:border-main/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <code className="text-xs font-mono text-foreground truncate">
                {walletAddress || 'Not available'}
              </code>
              <span className="text-xs text-main font-medium flex-shrink-0 ml-2">
                {copied ? '✓ Copied!' : 'Copy'}
              </span>
            </div>
          </button>
        </div>

        {/* Faucet Links */}
        <div className="mb-4">
          <label className="text-xs text-muted-foreground mb-2 block">Click a link below:</label>
          <div className="space-y-2">
            {faucets.map((faucet) => (
              <a
                key={faucet.name}
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-main/50 transition-colors"
              >
                <span className="font-medium text-sm">{faucet.name}</span>
                <span className="text-xs text-muted-foreground">{faucet.note}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Help Note */}
        <div className="bg-background border border-border rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground">
            📝 <strong>Don't worry!</strong> Your files are already encrypted and safe. This just enables syncing to other devices.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-main text-white py-2.5 rounded-lg font-medium hover:bg-main-dark transition-colors"
        >
          Done! Refresh to Check
        </button>
      </div>
    </div>
  );
}