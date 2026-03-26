import React, { useState, useRef } from 'react';

export default function FileUpload({ onUpload }) {
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

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold mb-4">📁 Upload File</h3>
      
      <div
        className={`border-2 border-dashed rounded-base p-6 sm:p-8 text-center cursor-pointer transition-all ${
          dragging 
            ? 'border-main bg-main/5' 
            : 'border-border hover:border-main/50 hover:bg-main/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-4xl mb-3">📤</div>
        <p className="text-muted-foreground">
          {file ? file.name : 'Drag and drop a file or click to select'}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
      
      {file && (
        <div className="mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 p-3 bg-background rounded-base">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatSize(file.size)} • {file.type || 'Unknown type'}
              </p>
            </div>
            <button
              onClick={() => setFile(null)}
              className="flex-shrink-0 p-2 bg-error/20 text-error rounded-base hover:bg-error/30 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <button
            onClick={handleUpload}
            className="w-full bg-main text-main-foreground px-6 py-3 rounded-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-main-foreground border-t-transparent rounded-full animate-spin" />
                Encrypting...
              </span>
            ) : '🔐 Encrypt & Upload'}
          </button>
        </div>
      )}
    </div>
  );
}