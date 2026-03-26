import React, { useState } from 'react';

export default function FileList({ files, onDownload, onDelete }) {
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (file) => {
    setDownloadingId(file.id);
    try {
      await onDownload(file);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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

  if (files.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📭</div>
        <p className="text-lg font-medium mb-2">No files yet</p>
        <p className="text-muted-foreground">
          Upload a file to get started
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold mb-4">
        📚 Your Files
        <span className="text-sm text-muted-foreground ml-2 font-normal">
          ({files.length})
        </span>
      </h3>
      
      <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
        {files.map((file) => (
          <div 
            key={file.id} 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-background rounded-base border border-border hover:border-main/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg">{getFileIcon(file.type)}</span>
                <span className="font-medium break-all">{file.name}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-success/20 text-success">
                  🔐 Encrypted
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatSize(file.size)} • {formatDate(file.timestamp)}
                {file.ipfsHash && (
                  <span className="ml-2 text-main">
                    • IPFS: {file.ipfsHash.slice(0, 8)}...
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-secondary-background border border-border rounded-base hover:bg-background transition-colors disabled:opacity-50"
                onClick={() => handleDownload(file)}
                disabled={downloadingId === file.id}
                title="Download & Decrypt"
              >
                {downloadingId === file.id ? (
                  <span className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>⬇️ Download</>
                )}
              </button>
              
              <button
                className="flex items-center justify-center px-4 py-2 bg-secondary-background border border-border rounded-base hover:bg-error hover:border-error text-error hover:text-white transition-colors"
                onClick={() => onDelete(file.id)}
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}