import React, { useState } from 'react';
import SyncGuideModal from './SyncGuideModal';

export default function Dashboard({ 
  files, 
  blockchainReady, 
  ipfsConnected, 
  needsGas, 
  walletAddress,
  syncStatus,
  onSyncAll
}) {
  const [showSyncGuide, setShowSyncGuide] = useState(false);
  
  const totalFiles = files.length;
  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);
  const encryptedFiles = files.filter(f => !f.isNote).length;
  const notes = files.filter(f => f.isNote).length;
  const unsyncedFiles = files.filter(f => !f.synced);
  
  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Determine sync status
  const getSyncStatus = () => {
    if (syncStatus && syncStatus.isSyncing) {
      return { status: 'syncing', label: 'Syncing...', color: 'blue', icon: '⏳' };
    }
    
    if (!blockchainReady) {
      return { status: 'not-configured', label: 'Local Only', color: 'gray', icon: '📁' };
    }
    
    if (needsGas) {
      return { status: 'needs-sync-credits', label: 'Enable Sync', color: 'amber', icon: '⚠️' };
    }
    
    if (syncStatus && syncStatus.hasUnsyncedFiles) {
      return { 
        status: 'has-unsynced', 
        label: `${syncStatus.unsyncedCount} unsynced`, 
        color: 'amber', 
        icon: '⚠️' 
      };
    }
    
    return { status: 'synced', label: 'Synced', color: 'green', icon: '✓' };
  };

  const displaySyncStatus = getSyncStatus();

  const stats = [
    {
      label: 'Files',
      value: totalFiles,
      subtext: encryptedFiles + ' files • ' + notes + ' notes',
      icon: '📁',
    },
    {
      label: 'Storage',
      value: formatSize(totalSize),
      subtext: 'Encrypted',
      icon: '💾',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sync Warning Banner */}
      {displaySyncStatus.status === 'needs-sync-credits' && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                Enable Cross-Device Sync
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your files are <strong>safe and encrypted</strong>. Add free sync credits to access them from other devices.
              </p>
              <button
                onClick={() => setShowSyncGuide(true)}
                className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Get Free Sync Credits →
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Unsynced Files Banner */}
      {displaySyncStatus.status === 'has-unsynced' && (
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⬆️</span>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                {syncStatus.unsyncedCount} File{syncStatus.unsyncedCount > 1 ? 's' : ''} Not Synced
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Core features work perfectly without sync. Sync enables cross-device access.
              </p>
              {blockchainReady && !needsGas && onSyncAll && (
                <button
                  onClick={onSyncAll}
                  disabled={syncStatus.isSyncing}
                  className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  {syncStatus.isSyncing ? 'Syncing...' : `Sync ${syncStatus.unsyncedCount} File${syncStatus.unsyncedCount > 1 ? 's' : ''} to Chain`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sync Status Card */}
      <div className="flex items-center justify-between p-4 bg-secondary-background rounded-lg border border-border">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
            displaySyncStatus.color === 'green' ? 'bg-success-light dark:bg-success/20' :
            displaySyncStatus.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30' :
            displaySyncStatus.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
            'bg-gray-100 dark:bg-gray-800'
          }`}>
            {displaySyncStatus.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Sync Status</span>
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                displaySyncStatus.color === 'green' ? 'bg-success-light dark:bg-success/20 text-success' :
                displaySyncStatus.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                displaySyncStatus.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
              }`}>
                {displaySyncStatus.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {displaySyncStatus.status === 'synced' && 'Files accessible from any device'}
              {displaySyncStatus.status === 'has-unsynced' && 'Sync files for cross-device access'}
              {displaySyncStatus.status === 'syncing' && 'Updating blockchain manifest...'}
              {displaySyncStatus.status === 'needs-sync-credits' && 'Add credits to sync across devices'}
              {displaySyncStatus.status === 'not-configured' && 'Files stored locally only'}
            </p>
          </div>
        </div>
        {displaySyncStatus.status !== 'synced' && displaySyncStatus.status !== 'syncing' && (
          <button
            onClick={() => setShowSyncGuide(true)}
            className="text-sm text-main hover:underline font-medium"
          >
            Learn More
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-secondary-background rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-main/10 flex items-center justify-center text-xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Security Info */}
      <div className="bg-secondary-background rounded-lg border border-border p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg">
            <span className="text-sm">🔐</span>
            <span className="text-xs text-muted-foreground">AES-256 Encrypted</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg">
            <span className="text-sm">🌐</span>
            <span className="text-xs text-muted-foreground">{ipfsConnected ? 'IPFS Storage' : 'Local Storage'}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-lg">
            <span className="text-sm">🔑</span>
            <span className="text-xs text-muted-foreground">You own the keys</span>
          </div>
        </div>
      </div>

      {/* Sync Guide Modal */}
      {showSyncGuide && (
        <SyncGuideModal
          onClose={() => setShowSyncGuide(false)}
          walletAddress={walletAddress}
        />
      )}
    </div>
  );
}