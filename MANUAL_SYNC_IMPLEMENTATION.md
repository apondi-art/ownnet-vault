# Manual Sync Implementation Plan

## Overview
Implement manual sync with clear indicators for blockchain synchronization status.

## Why Manual Sync?

### ✅ Advantages
1. **User Control** - Users decide when to spend ETH
2. **Cost Efficiency** - Batch multiple files together
3. **Transparency** - Clear indicators of sync status
4. **Beginner Friendly** - Core features work without ETH
5. **Hackathon Friendly** - Judges can test without ETH

### ❌ Disadvantages of Auto-Sync
1. Unexpected gas costs
2. Silent failures when no ETH
3. No user control
4. Poor UX for beginners
5. Confusing for non-Web3 users

## Implementation Steps

### Step 1: Update Manifest Structure

**File: `src/utils/manifest.js`**

```javascript
// Add 'synced' field to file metadata
export function addFileToManifest(manifest, fileMetadata) {
  const updated = { ...manifest };
  updated.files.push({
    id: fileMetadata.id || Date.now().toString(),
    name: fileMetadata.name,
    type: fileMetadata.type,
    size: fileMetadata.size,
    encryptedSize: fileMetadata.encryptedSize,
    ipfsHash: fileMetadata.ipfsHash,
    storageKey: fileMetadata.storageKey,
    timestamp: Date.now(),
    storageType: fileMetadata.storageType || 'IPFS',
    synced: false  // ← NEW: Track sync status
  });
  updated.updatedAt = Date.now();
  return updated;
}

// Add function to mark file as synced
export function markFileAsSynced(manifest, fileId) {
  const updated = { ...manifest };
  const file = updated.files.find(f => f.id === fileId);
  if (file) {
    file.synced = true;
    file.syncedAt = Date.now();
  }
  updated.updatedAt = Date.now();
  return updated;
}

// Add function to get unsynced files
export function getUnsyncedFiles(manifest) {
  return manifest.files.filter(f => !f.synced);
}
```

### Step 2: Update File Upload Logic

**File: `src/App.jsx`**

```javascript
const handleFileUpload = async (file) => {
  // ... existing upload logic ...
  
  // Upload to IPFS (always happens)
  const ipfsHash = await uploadToIPFS(encryptedFile);
  
  // Add to manifest (NOT synced yet)
  const newFile = {
    id: Date.now().toString(),
    name: file.name,
    type: file.type,
    size: file.size,
    encryptedSize: encryptedFile.size,
    ipfsHash: ipfsHash,
    storageKey: storageKey,
    timestamp: Date.now(),
    storageType: 'IPFS',
    synced: false  // ← NEW: Not synced to blockchain yet
  };
  
  const updatedFiles = [...files, newFile];
  setFiles(updatedFiles);
  localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(updatedFiles));
  
  // Update manifest locally
  const currentManifest = manifest || createManifest(vaultId);
  const updatedManifest = addFileToManifest(currentManifest, newFile);
  setManifest(updatedManifest);
  
  // Save to IPFS
  const manifestCID = await syncManifestToIPFS(updatedManifest);
  
  // DO NOT auto-sync to blockchain
  // Show indicator that file is not synced
  
  setSyncStatus({
    ...syncStatus,
    hasUnsyncedFiles: true,
    unsyncedCount: getUnsyncedFiles(updatedManifest).length
  });
};
```

### Step 3: Add Sync Status to State

**File: `src/App.jsx`**

```javascript
const [syncStatus, setSyncStatus] = useState({
  hasUnsyncedFiles: false,
  unsyncedCount: 0,
  lastSyncTime: null,
  isSyncing: false,
  syncError: null
});
```

### Step 4: Create Manual Sync Function

**File: `src/App.jsx`**

```javascript
const handleSyncFiles = async () => {
  // Check if ETH is available
  if (!blockchainReady || needsGas) {
    setErrorMessage('Need ETH for blockchain synchronization. Click "Get Free ETH" in settings.');
    setErrorTitle('Sync Requires ETH');
    return;
  }
  
  // Get unsynced files
  const unsyncedFiles = files.filter(f => !f.synced);
  
  if (unsyncedFiles.length === 0) {
    setErrorMessage('No files to synchronize. All files are already synced.');
    setErrorTitle('Already Synced');
    return;
  }
  
  setSyncStatus({ ...syncStatus, isSyncing: true });
  
  try {
    // Sync manifest to blockchain
    const currentManifest = manifest || createManifest(vaultId);
    
    // Upload manifest to IPFS
    const manifestCID = await syncManifestToIPFS(currentManifest);
    
    // Update blockchain
    await updateManifestWithInternalWallet(manifestCID);
    
    // Mark all files as synced
    const updatedFiles = files.map(f => ({ ...f, synced: true }));
    setFiles(updatedFiles);
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(updatedFiles));
    
    // Update sync status
    setSyncStatus({
      hasUnsyncedFiles: false,
      unsyncedCount: 0,
      lastSyncTime: Date.now(),
      isSyncing: false,
      syncError: null
    });
    
    console.log(`Synced ${unsyncedFiles.length} files to blockchain`);
  } catch (error) {
    console.error('Sync failed:', error);
    setSyncStatus({
      ...syncStatus,
      isSyncing: false,
      syncError: error.message
    });
    setErrorMessage('Failed to sync to blockchain. Please try again.');
    setErrorTitle('Sync Failed');
  }
};

// Sync single file
const handleSyncSingleFile = async (fileId) => {
  // Check if ETH is available
  if (!blockchainReady || needsGas) {
    setErrorMessage('Need ETH for blockchain synchronization. Click "Get Free ETH" in settings.');
    setErrorTitle('Sync Requires ETH');
    return;
  }
  
  setSyncStatus({ ...syncStatus, isSyncing: true });
  
  try {
    // Sync manifest to blockchain
    const currentManifest = manifest || createManifest(vaultId);
    const manifestCID = await syncManifestToIPFS(currentManifest);
    await updateManifestWithInternalWallet(manifestCID);
    
    // Mark file as synced
    const updatedFiles = files.map(f => 
      f.id === fileId ? { ...f, synced: true, syncedAt: Date.now() } : f
    );
    setFiles(updatedFiles);
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(updatedFiles));
    
    // Update manifest
    const updatedManifest = markFileAsSynced(currentManifest, fileId);
    setManifest(updatedManifest);
    
    // Update sync status
    const remainingUnsynced = updatedFiles.filter(f => !f.synced).length;
    setSyncStatus({
      ...syncStatus,
      hasUnsyncedFiles: remainingUnsynced > 0,
      unsyncedCount: remainingUnsynced,
      isSyncing: false
    });
  } catch (error) {
    console.error('Sync failed:', error);
    setSyncStatus({
      ...syncStatus,
      isSyncing: false,
      syncError: error.message
    });
  }
};
```

### Step 5: Update File List Component

**File: `src/components/FileList.jsx`**

```jsx
// Add sync status indicator
{files.map(file => (
  <div key={file.id} className="file-item">
    <div className="file-info">
      <span className="file-name">{file.name}</span>
      <span className="file-size">{formatFileSize(file.size)}</span>
      
      {/* Sync status indicator */}
      {file.synced ? (
        <span className="sync-status synced">
          ✓ Synced to blockchain
        </span>
      ) : (
        <span className="sync-status unsynced">
          ⚠️ Not synced
        </span>
      )}
    </div>
    
    <div className="file-actions">
      <button onClick={() => handleDownload(file.id)}>
        Download
      </button>
      
      {!file.synced && blockchainReady && !needsGas && (
        <button 
          onClick={() => handleSyncSingleFile(file.id)}
          className="sync-button"
        >
          Sync to Chain
        </button>
      )}
      
      <button onClick={() => handleDelete(file.id)}>
        Delete
      </button>
    </div>
  </div>
))}
```

### Step 6: Add Sync Status Bar

**File: `src/components/StatusBar.jsx`**

```jsx
<div className="status-bar">
  {/* Existing status indicators */}
  <div className="status-item">
    <span className="status-label">IPFS:</span>
    {ipfsConnected ? (
      <span className="status-value connected">✓ Connected</span>
    ) : (
      <span className="status-value disconnected">✗ Disconnected</span>
    )}
  </div>
  
  <div className="status-item">
    <span className="status-label">Blockchain:</span>
    {blockchainReady ? (
      <span className="status-value connected">✓ Ready</span>
    ) : (
      <span className="status-value disconnected">✗ Not Ready</span>
    )}
  </div>
  
  <div className="status-item">
    <span className="status-label">ETH:</span>
    {needsGas ? (
      <span className="status-value warning">⚠️ Need ETH</span>
    ) : (
      <span className="status-value connected">✓ Available</span>
    )}
  </div>
  
  {/* NEW: Sync status */}
  <div className="status-item">
    <span className="status-label">Sync:</span>
    {syncStatus.isSyncing ? (
      <span className="status-value syncing">⏳ Syncing...</span>
    ) : syncStatus.hasUnsyncedFiles ? (
      <span className="status-value warning">
        ⚠️ {syncStatus.unsyncedCount} unsynced
      </span>
    ) : (
      <span className="status-value connected">✓ All synced</span>
    )}
  </div>
  
  {/* Bulk sync button */}
  {syncStatus.hasUnsyncedFiles && blockchainReady && !needsGas && (
    <button 
      className="sync-all-button"
      onClick={handleSyncFiles}
      disabled={syncStatus.isSyncing}
    >
      Sync All ({syncStatus.unsyncedCount} files)
    </button>
  )}
</div>
```

### Step 7: Add Bulk Sync Modal

**File: `src/components/SyncModal.jsx`** (New file)

```jsx
import React from 'react';

export default function SyncModal({ 
  files, 
  onSyncAll, 
  onSyncSelected, 
  onCancel,
  isSyncing 
}) {
  const unsyncedFiles = files.filter(f => !f.synced);
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Sync Files to Blockchain</h2>
        
        <div className="sync-info">
          <p>
            Syncing stores your file list on the blockchain for cross-device access.
          </p>
          <p>
            <strong>Files to sync:</strong> {unsyncedFiles.length}
          </p>
          <p>
            <strong>Estimated gas:</strong> ~0.002 ETH
          </p>
          <p>
            <strong>What happens:</strong>
          </p>
          <ul>
            <li>Manifest uploaded to IPFS</li>
            <li>Manifest CID stored on blockchain</li>
            <li>Accessible from any device</li>
          </ul>
        </div>
        
        <div className="file-list">
          {unsyncedFiles.map(file => (
            <div key={file.id} className="file-item">
              <input type="checkbox" id={`file-${file.id}`} />
              <label htmlFor={`file-${file.id}`}>
                {file.name} ({formatFileSize(file.size)})
              </label>
            </div>
          ))}
        </div>
        
        <div className="modal-actions">
          <button 
            className="sync-button"
            onClick={onSyncAll}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing...' : 'Sync All Files'}
          </button>
          
          <button 
            className="secondary-button"
            onClick={onCancel}
            disabled={isSyncing}
          >
            Cancel
          </button>
        </div>
        
        <div className="sync-note">
          <p>
            <strong>Note:</strong> Core features work without blockchain sync.
            Syncing enables cross-device access.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Step 8: Update CSS Styles

**File: `src/index.css`**

```css
/* Sync status indicators */
.sync-status {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
}

.sync-status.synced {
  background-color: var(--success-light);
  color: var(--success);
  border: 1px solid var(--success);
}

.sync-status.unsynced {
  background-color: var(--warning-light);
  color: var(--warning);
  border: 1px solid var(--warning);
}

/* Sync buttons */
.sync-button {
  background: linear-gradient(135deg, var(--main), var(--main-light));
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.sync-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
}

.sync-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sync-all-button {
  background-color: var(--main);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
}

/* Status bar enhancements */
.status-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background-color: var(--secondary-background);
  border-bottom: 1px solid var(--border);
}

.status-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-label {
  font-size: 12px;
  color: var(--muted-foreground);
}

.status-value {
  font-size: 12px;
  font-weight: 500;
}

.status-value.connected {
  color: var(--success);
}

.status-value.disconnected {
  color: var(--error);
}

.status-value.warning {
  color: var(--warning);
}

.status-value.syncing {
  color: var(--main);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Dark mode support */
.dark .sync-status.synced {
  background-color: rgba(5, 150, 105, 0.1);
  border: 1px solid var(--success);
}

.dark .sync-status.unsynced {
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid var(--warning);
}
```

## User Flow Diagram

```
User uploads file
    ↓
File encrypted locally
    ↓
File uploaded to IPFS (always, automatic)
    ↓
File metadata saved to manifest
    ↓
Manifest uploaded to IPFS
    ↓
File appears in list with "⚠️ Not synced" badge
    ↓
User decides: Sync now? Sync later?
    ↓
Clicks "Sync to Chain"
    ↓
System checks: ETH available?
    ├─ NO → Show "Get ETH" prompt
    │         ↓
    │       User gets ETH
    │         ↓
    │       Returns to sync
    │
    └─ YES → Upload manifest to IPFS
               ↓
             Update blockchain
               ↓
             Mark files as synced
               ↓
             Show "✓ Synced" badge
```

## Benefits Summary

| Feature | Auto Sync | Manual Sync |
|---------|-----------|--------------|
| User Control | ✗ No | ✓ Yes |
| Cost Transparency | ✗ Hidden | ✓ Clear |
| Batch Efficiency | ✗ No | ✓ Yes |
| Beginner Friendly | ✗ No (needs ETH) | ✓ Yes (works without) |
| Hackathon Ready | ✗ No (judges need ETH) | ✓ Yes (test without ETH) |
| Error Handling | ✗ Silent failures | ✓ Clear messages |
| Gas Optimization | ✗ Multiple transactions | ✓ Single batch transaction |

## Conclusion

**Recommended: Implement Manual Sync**

This approach offers:
- ✅ Better user experience
- ✅ Clear visibility of sync status
- ✅ Cost transparency
- ✅ Beginner-friendly (core features work)
- ✅ Perfect for hackathon judging
- ✅ User control over when to spend ETH
- ✅ Efficient batch syncing

## Next Steps

1. Update manifest structure to include `synced` field
2. Modify file upload logic to NOT auto-sync
3. Add sync status to component state
4. Create manual sync functions
5. Update FileList component with indicators
6. Add sync status bar
7. Create SyncModal component
8. Add CSS styles
9. Test thoroughly
10. Update documentation