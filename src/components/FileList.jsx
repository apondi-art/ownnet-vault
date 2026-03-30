import React, { useState } from 'react';

export default function FileList({ 
  files, 
  onDownload, 
  onDelete, 
  onSyncFile,
  blockchainReady,
  needsGas 
}) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFile, setExpandedFile] = useState(null);
  const [syncingFileId, setSyncingFileId] = useState(null);

  const handleDownload = async (file) => {
    setDownloadingId(file.id);
    try {
      await onDownload(file);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSyncFile = async (file) => {
    if (!onSyncFile) return;
    setSyncingFileId(file.id);
    try {
      await onSyncFile(file.id);
    } finally {
      setSyncingFileId(null);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const formatSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type) => {
    if (!type) return '📄';
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📑';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📄';
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unsyncedFiles = files.filter(f => !f.synced);

  if (files.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-main/10 to-main/5 flex items-center justify-center">
          <span className="text-4xl">📂</span>
        </div>
        <p className="text-lg font-semibold text-foreground mb-1">No files yet</p>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a file to get started
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 text-xs rounded-full bg-success-light dark:bg-success/10 text-success font-medium">
            🔒 End-to-end encrypted
          </span>
          <span className="px-3 py-1 text-xs rounded-full bg-info/10 text-info font-medium">
            🌐 Decentralized storage
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-lg font-bold text-foreground">
          Your Files
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-main text-white">
            {files.length}
          </span>
          {unsyncedFiles.length > 0 && (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-warning-light dark:bg-warning/10 text-warning">
              ⚠️ {unsyncedFiles.length} unsynced
            </span>
          )}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all"
        />
      </div>

      {filteredFiles.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No files match "{searchTerm}"</p>
        </div>
      )}
      
      <div className="flex flex-col gap-2 max-h-[55vh] overflow-y-auto pr-1">
        {filteredFiles.map((file) => (
          <div key={file.id}>
            <div 
              className="group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-background rounded-lg border border-border hover:border-main/30 transition-all cursor-pointer"
              onClick={() => setExpandedFile(expandedFile === file.id ? null : file.id)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-secondary-background flex items-center justify-center text-xl flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">{file.name}</p>
                    {file.synced ? (
                      <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs bg-success-light dark:bg-success/10 text-success font-medium">
                        ✓ Synced
                      </span>
                    ) : (
                      <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs bg-warning-light dark:bg-warning/10 text-warning font-medium">
                        ⚠️ Local
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(file.size)} • {formatDate(file.timestamp)}
                  </p>
                </div>
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs bg-success-light dark:bg-success/10 text-success font-medium">
                  🔒
                </span>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-main text-white rounded-lg hover:bg-main-dark transition-all disabled:opacity-50 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(file);
                  }}
                  disabled={downloadingId === file.id}
                >
                  {downloadingId === file.id ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Download'
                  )}
                </button>
                
                {!file.synced && blockchainReady && !needsGas && (
                  <button
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-secondary-background border border-main text-main rounded-lg hover:bg-main hover:text-white transition-all text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSyncFile(file);
                    }}
                    disabled={syncingFileId === file.id}
                    title="Sync to blockchain for cross-device access"
                  >
                    {syncingFileId === file.id ? (
                      <span className="w-4 h-4 border-2 border-main border-t-transparent rounded-full animate-spin" />
                    ) : (
                      '⬆️ Sync'
                    )}
                  </button>
                )}
                
                <button
                  className="flex items-center justify-center px-3 py-2 bg-background border border-border rounded-lg hover:bg-error-light hover:border-error hover:text-error transition-all text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
            
            {expandedFile === file.id && (
              <div className="mt-1 p-3 bg-background rounded-lg border border-border-light ml-13">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 text-foreground">{file.type || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="ml-2 text-foreground">{formatSize(file.size)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Uploaded:</span>
                    <span className="ml-2 text-foreground">{new Date(file.timestamp).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Storage:</span>
                    <span className="ml-2 text-foreground">{file.storageType || 'IPFS'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blockchain:</span>
                    <span className="ml-2">
                      {file.synced ? (
                        <span className="text-success font-medium">✓ Synced</span>
                      ) : (
                        <span className="text-warning font-medium">⚠️ Not synced</span>
                      )}
                    </span>
                  </div>
                  {file.syncedAt && (
                    <div>
                      <span className="text-muted-foreground">Synced at:</span>
                      <span className="ml-2 text-foreground">{new Date(file.syncedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
                {!file.synced && (
                  <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground">
                    ℹ️ Core features work without blockchain. Sync enables cross-device access.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}