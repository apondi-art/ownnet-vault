import React, { useState } from 'react';

export default function WalletConnect({ onConnect, address, balance }) {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await onConnect();
    } catch (error) {
      console.error('Connection error:', error);
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
    <button
      onClick={handleConnect}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary-background border border-border rounded-base hover:bg-background transition-colors disabled:opacity-50 whitespace-nowrap"
      disabled={connecting}
    >
      {connecting ? (
        <>
          <span className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Connecting...</span>
        </>
      ) : (
        <span className="text-sm">🦊 Connect Wallet</span>
      )}
    </button>
  );
}