import React, { useState, useRef } from 'react';

export default function FileUpload({ onUpload, needsGas, blockchainReady }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      await onUpload(file);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const showSyncWarning = blockchainReady && needsGas;

  return (
    <div>
      <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="text-lg">📤</span>
        Upload File
      </h3>
      
      {/* Sync Warning */}
      {showSyncWarning && (
        <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            ⚠️ <strong>Note:</strong> File will be encrypted and stored safely. To sync across devices, <a href="https://sepolia-faucet.pk910.de/" target="_blank" rel="noopener noreferrer" className="underline font-medium">add test ETH</a>.
          </p>
        </div>
      )}
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          dragging 
            ? 'border-main bg-main/5' 
            : 'border-border hover:border-main/50 hover:bg-main/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-main/10 flex items-center justify-center">
          <span className="text-2xl">📤</span>
        </div>
        <p className="text-sm text-foreground font-medium mb-1">
          {file ? file.name : 'Drop file or click to upload'}
        </p>
        <p className="text-xs text-muted-foreground">
          Encrypted before upload • AES-256
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      
      {file && (
        <div className="mt-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg">📄</span>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(file.size)} • {file.type || 'Unknown'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-error transition-colors"
            >
              ✕
            </button>
          </div>
          
          <button
            onClick={handleUpload}
            className="w-full bg-main text-white px-4 py-2.5 rounded-lg font-medium hover:bg-main-dark transition-all disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Encrypting...
              </span>
            ) : (
              '🔐 Encrypt & Upload'
            )}
          </button>
          
          {showSyncWarning && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              ✓ File will be encrypted • ⚠️ Sync requires test ETH
            </p>
          )}
        </div>
      )}
    </div>
  );
}