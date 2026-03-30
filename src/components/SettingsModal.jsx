import React, { useState, useEffect } from 'react';

const SETTINGS_KEY = 'ownnet-vault-settings';
const LAST_ACTIVITY_KEY = 'ownnet-vault-last-activity';

const defaultSettings = {
  socialRecovery: {
    enabled: false,
    contacts: []
  },
  deadMansSwitch: {
    enabled: false,
    inactivityDays: 30,
    heirAddress: ''
  },
  dataConsent: {
    storeOnIPFS: true,
    syncToBlockchain: true,
    storeLocally: true
  }
};

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  onExportAll,
  onDeleteAllData,
  walletAddress 
}) {
  const [activeTab, setActiveTab] = useState('recovery');
  const [settings, setSettings] = useState(defaultSettings);
  const [newContact, setNewContact] = useState({ name: '', email: '', address: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    
    const activity = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (activity) {
      setLastActivity(new Date(parseInt(activity)));
    }
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
  };

  const handleAddContact = () => {
    if (!newContact.name || (!newContact.email && !newContact.address)) {
      return;
    }
    
    const updated = {
      ...settings,
      socialRecovery: {
        ...settings.socialRecovery,
        contacts: [...(settings.socialRecovery.contacts || []), { 
          ...newContact, 
          id: Date.now().toString(),
          addedAt: Date.now()
        }]
      }
    };
    saveSettings(updated);
    setNewContact({ name: '', email: '', address: '' });
  };

  const handleRemoveContact = (contactId) => {
    const updated = {
      ...settings,
      socialRecovery: {
        ...settings.socialRecovery,
        contacts: settings.socialRecovery.contacts.filter(c => c.id !== contactId)
      }
    };
    saveSettings(updated);
  };

  const handleToggleSocialRecovery = () => {
    const updated = {
      ...settings,
      socialRecovery: {
        ...settings.socialRecovery,
        enabled: !settings.socialRecovery.enabled
      }
    };
    saveSettings(updated);
  };

  const handleDeadMansSwitchChange = (field, value) => {
    const updated = {
      ...settings,
      deadMansSwitch: {
        ...settings.deadMansSwitch,
        [field]: value
      }
    };
    saveSettings(updated);
  };

  const handleConsentChange = (field) => {
    const updated = {
      ...settings,
      dataConsent: {
        ...settings.dataConsent,
        [field]: !settings.dataConsent[field]
      }
    };
    saveSettings(updated);
  };

  const handleExportData = async () => {
    if (onExportAll) {
      onExportAll();
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    }
  };

  const handleDeleteEverything = () => {
    if (onDeleteAllData) {
      onDeleteAllData();
    }
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-overlay backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-secondary-background rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden border border-border shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-bold">⚙️ Settings</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        
        <div className="flex border-b border-border">
          {[
            { key: 'recovery', label: 'Trusted Contacts', icon: '👥' },
            { key: 'deadmans', label: 'Emergency Access', icon: '⏰' },
            { key: 'consent', label: 'My Data', icon: '📁' },
            { key: 'delete', label: 'Delete Everything', icon: '🗑️' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-3 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-main/10 text-main border-b-2 border-main'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(85vh-140px)]">
          {activeTab === 'recovery' && (
            <div className="space-y-5">
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <h3 className="font-semibold text-lg">Trusted Contacts</h3>
                      <p className="text-sm text-muted-foreground">
                        People who can help you get back into your vault.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.socialRecovery.enabled}
                      onChange={handleToggleSocialRecovery}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-main peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-sm">
                    <strong>Why do I need this?</strong> If you forget your password and lose your backup phrase, your trusted contacts can help you recover access. They can't open your vault alone — at least 2 people must work together to verify it's really you.
                  </p>
                </div>
              </div>
                
              {settings.socialRecovery.enabled && (
                <div className="bg-background rounded-lg p-4 border border-border">
                  <h4 className="font-semibold mb-3">My Trusted Contacts</h4>
                    
                  {(settings.socialRecovery.contacts || []).length === 0 && (
                    <div className="p-4 bg-secondary-background rounded-lg border border-border text-center mb-4">
                      <p className="text-sm text-muted-foreground">No contacts added yet. Add at least 2 people you trust.</p>
                    </div>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {(settings.socialRecovery.contacts || []).map(contact => (
                      <div key={contact.id} className="flex items-center justify-between p-4 bg-secondary-background rounded-lg border border-border">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {contact.email && <span>{contact.email}</span>}
                            {contact.email && contact.address && <span> · </span>}
                            {contact.address && <span className="font-mono text-xs">{contact.address.slice(0, 10)}...{contact.address.slice(-8)}</span>}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveContact(contact.id)}
                          className="text-error hover:bg-error/10 p-2 rounded-lg transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-border">
                    <p className="text-sm font-medium">Add a Trusted Person</p>
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-3">
                      <p className="text-sm">
                        <strong>Why email?</strong> We use email to send recovery instructions to your trusted contacts. If you ever get locked out, they'll receive an email with a unique code they can share with you.
                      </p>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Their name"
                      value={newContact.name}
                      onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                    />
                    <input
                      type="email"
                      placeholder="Their email address"
                      value={newContact.email}
                      onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                    />
                    <input
                      type="text"
                      placeholder="Their wallet address (optional)"
                      value={newContact.address}
                      onChange={e => setNewContact({ ...newContact, address: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-main font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Wallet address is optional — add it if they have a crypto wallet and you want to send files directly to them.
                    </p>
                    <button
                      onClick={handleAddContact}
                      disabled={!newContact.name || (!newContact.email && !newContact.address)}
                      className="w-full px-4 py-3 bg-main text-white rounded-lg font-medium hover:bg-main-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add This Person
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'deadmans' && (
            <div className="space-y-5">
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <h3 className="font-semibold text-lg">Emergency Access</h3>
                      <p className="text-sm text-muted-foreground">
                        Let someone access your vault if something happens to you.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.deadMansSwitch.enabled}
                      onChange={() => handleDeadMansSwitchChange('enabled', !settings.deadMansSwitch.enabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-main peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                  <p className="text-sm">
                    <strong>How it works:</strong> If you don't open your vault for a set number of days, your chosen person can request access. This is useful for passing on important files to family or loved ones.
                  </p>
                </div>
                
                {settings.deadMansSwitch.enabled && (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary-background rounded-lg border border-border">
                      <label className="block text-sm font-semibold mb-2">
                        After how many days of no activity?
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="7"
                          max="365"
                          value={settings.deadMansSwitch.inactivityDays}
                          onChange={e => handleDeadMansSwitchChange('inactivityDays', parseInt(e.target.value) || 30)}
                          className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-main text-lg"
                        />
                        <span className="text-sm font-medium">days</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your chosen person can request access after <strong>{settings.deadMansSwitch.inactivityDays} days</strong> of you not logging in.
                      </p>
                    </div>
                    
                    {lastActivity && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-lg">✓</span>
                          <div>
                            <p className="text-sm font-medium">Your last login</p>
                            <p className="text-sm text-green-700">
                              {lastActivity.toLocaleDateString()} at {lastActivity.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4 bg-secondary-background rounded-lg border border-border">
                      <label className="block text-sm font-semibold mb-2">
                        Who should get access?
                      </label>
                      <input
                        type="text"
                        placeholder="Paste their wallet address here..."
                        value={settings.deadMansSwitch.heirAddress}
                        onChange={e => handleDeadMansSwitchChange('heirAddress', e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-main"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        This person will be able to request your vault files after the waiting period.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-yellow-700 mb-1">Important</h4>
                    <ul className="text-sm space-y-2">
                      <li>• The person you choose will still need your backup phrase or password to fully access your files.</li>
                      <li>• Simply opening your vault will reset the timer.</li>
                      <li>• Tell this person how to reach you — they'll get notified when the timer starts.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'consent' && (
            <div className="space-y-5">
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">Where My Data Is Stored</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You control where your files are saved. All files are encrypted before leaving your device.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-secondary-background rounded-lg border border-border">
                    <div>
                      <p className="font-medium">Secure Cloud Storage</p>
                      <p className="text-sm text-muted-foreground">Store encrypted files on secure servers</p>
                      <p className="text-xs text-green-600 mt-1 font-medium">Recommended — keeps files safe even if you lose your device</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.dataConsent.storeOnIPFS}
                        onChange={() => handleConsentChange('storeOnIPFS')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-main peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-secondary-background rounded-lg border border-border">
                    <div>
                      <p className="font-medium">Sync Across Devices</p>
                      <p className="text-sm text-muted-foreground">Access your files from any device</p>
                      <p className="text-xs text-muted-foreground mt-1">Requires a small network fee to update</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.dataConsent.syncToBlockchain}
                        onChange={() => handleConsentChange('syncToBlockchain')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-main peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-secondary-background rounded-lg border border-border">
                    <div>
                      <p className="font-medium">Save on This Device</p>
                      <p className="text-sm text-muted-foreground">Keep a copy in your browser</p>
                      <p className="text-xs text-muted-foreground mt-1">Good for offline access</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.dataConsent.storeLocally}
                        onChange={() => handleConsentChange('storeLocally')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-main peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h3 className="font-semibold text-lg">Download My Data</h3>
                    <p className="text-sm text-muted-foreground">
                      Get a copy of everything in your vault.
                    </p>
                  </div>
                </div>
                
                <div className="bg-main/5 border border-main/20 rounded-lg p-3 mb-4">
                  <p className="text-sm">
                    <strong>Included:</strong> Your file list, vault ID, wallet address, and settings. Files must be downloaded separately.
                  </p>
                </div>
                
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-main text-white rounded-lg font-medium hover:bg-main-dark transition-colors"
                >
                  <span>📥</span>
                  Download My Data
                </button>
                
                {showExportSuccess && (
                  <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                      <span>✓</span> Download started! Check your downloads folder.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'delete' && (
            <div className="space-y-5">
              <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-1">Delete Everything</h3>
                    <p className="text-sm text-red-800 font-medium">
                      This cannot be undone.
                    </p>
                  </div>
                </div>
                <p className="text-sm mt-3">
                  This will permanently erase all your files, backup codes, and settings. Once deleted, <strong>nobody can recover your data — not even us.</strong>
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-4 border border-border">
                <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <span>🗑</span> What Will Be Deleted
                </h3>
                <div className="space-y-2">
                  {[
                    { icon: '📁', text: 'All your uploaded files' },
                    { icon: '🔒', text: 'Your backup phrase (write it down first!)' },
                    { icon: '💾', text: 'Everything saved on this device' },
                    { icon: '👥', text: 'Your trusted contacts list' },
                    { icon: '⚙️', text: 'All your settings and preferences' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                  <span>⚡</span> Before You Delete
                </h3>
                <ul className="space-y-2">
                  {[
                    'Download any files you want to keep',
                    'Write down your backup phrase somewhere safe',
                    'Move important documents to another secure place'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-600 font-bold">!</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full px-4 py-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-lg border-2 border-red-600"
                >
                  <span className="text-xl">🗑️</span>
                  Delete Everything Forever
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 text-center">
                    <p className="text-lg font-bold text-red-700 mb-1">
                      This is permanent!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your files will be gone forever.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-4 py-3 bg-secondary-background border border-border rounded-lg font-medium hover:bg-background transition-colors"
                    >
                      Keep My Data
                    </button>
                    <button
                      onClick={handleDeleteEverything}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors border-2 border-red-600"
                    >
                      Delete Everything
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { SETTINGS_KEY, LAST_ACTIVITY_KEY };