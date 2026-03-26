import React, { useState } from 'react';

export default function NoteEditor({ onSave }) {
  const [note, setNote] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!note.trim()) return;
    
    setSaving(true);
    try {
      await onSave(title || 'Untitled Note', note);
      setNote('');
      setTitle('');
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold mb-4">📝 Secure Note</h3>
      
      <input
        type="text"
        className="w-full px-4 py-3 bg-background border border-border rounded-base text-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent mb-3"
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      <textarea
        className="w-full min-h-[150px] sm:min-h-[200px] px-4 py-3 bg-background border border-border rounded-base text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
        placeholder="Write your secret note here... Everything is encrypted locally before saving."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <p className="text-sm text-muted-foreground order-2 sm:order-1">
          {note.length} characters
        </p>
        
        <button
          onClick={handleSave}
          className="w-full sm:w-auto bg-main text-main-foreground px-6 py-3 rounded-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 order-1 sm:order-2"
          disabled={!note.trim() || saving}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-main-foreground border-t-transparent rounded-full animate-spin" />
              Encrypting...
            </span>
          ) : '💾 Save Encrypted Note'}
        </button>
      </div>
    </div>
  );
}