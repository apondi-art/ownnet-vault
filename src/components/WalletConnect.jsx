import React, { useState } from 'react';

export default function WalletConnect({ onConnect, address, balance }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      await onConnect();
    } catch (err) {
      if (err.message && err.message.includes('MetaMask')) {
        setError('MetaMask not detected. Wallet is optional - features work without it.');
      } else {
        setError(err.message || 'Connection failed');
      }
    } finally {
      setConnecting(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (address) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 bg-secondary-background border border-border rounded-base px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-success"></span>
          <span className="font-mono text-xs sm:text-sm text-muted-foreground">
            {formatAddress(address)}
          </span>
        </div>
        {balance && (
          <span className="text-xs sm:text-sm text-muted-foreground">
            {parseFloat(balance).toFixed(4)} ETH
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {error && (
        <div className="flex flex-col gap-1 px-3 py-2 bg-warning/10 border border-warning/30 rounded-base text-xs text-warning max-w-xs">
          <span className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </span>
          <span className="text-xs opacity-75">
            Wallet is optional. All features work without it (except cross-device sync).
          </span>
        </div>
      )}
      <button
        onClick={handleConnect}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary-background border border-border rounded-base hover:bg-background transition-colors disabled:opacity-50 whitespace-nowrap"
        disabled={connecting}
        title="Optional: Connect wallet to sync files across devices"
      >
        {connecting ? (
          <>
            <span className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Connecting...</span>
          </>
        ) : (
          <span className="text-sm">🦊 Connect Wallet (Optional)</span>
        )}
      </button>
      <span className="text-xs text-muted-foreground opacity-60">
        For cross-device sync only
      </span>
    </div>
  );
}