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
      <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
        <span className="text-lg">📝</span>
        Secure Note
      </h3>
      
      <div className="space-y-3">
        <input
          type="text"
          className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all text-sm"
          placeholder="Note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <textarea
          className="w-full min-h-[120px] px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all text-sm"
          placeholder="Write your note... Encrypted before saving."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {note.length} chars • AES-256
          </span>
          
          <button
            onClick={handleSave}
            className="bg-main text-white px-4 py-2 rounded-lg font-medium hover:bg-main-dark transition-all disabled:opacity-50 text-sm"
            disabled={!note.trim() || saving}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              '💾 Save Note'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}