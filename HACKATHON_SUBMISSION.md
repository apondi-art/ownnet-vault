# ETHOnline Hackathon Submission Guide

## 📋 Overview

**Hackathon:** ETHOnline 2024  
**Track:** Infrastructure & Digital Rights  
**Project:** OwnNet Vault  
**Live URL:** https://ownnet-vault.vercel.app/  

---

## 🎬 Video Script & Presentation Guide

### Video Structure (3-5 minutes)

**[0:00 - 0:30] Introduction & Problem Statement**
```
"Hi, I'm [Your Name] and this is OwnNet Vault.

Imagine this: You store your photos, documents, and private files online 
with services like Google Drive or Dropbox. But here's the scary part - 
THEY can read your files. THEY can sell your data to advertisers. 
THEY can hand it over to governments. And if THEY get hacked, YOUR 
files get exposed.

In 2023 alone, over 6 billion records were exposed in data breaches. 
Your personal files, passwords, and private information were never truly yours.

OwnNet Vault changes this fundamentally. Your files are encrypted BEFORE 
they leave your device. We can NEVER see your data. You truly OWN 
everything."
```

**[0:30 - 1:00] What Makes Us Different**
```
"Let me explain what makes OwnNet Vault different from existing solutions:

1. CLOUD STORAGE (Dropbox, Google Drive, iCloud):
   - THEY hold your files
   - THEY can read your data
   - THEY control your account
   - One password can lock you out
   
   OwnNet: YOU hold the keys. We can't read your data. 
   Your account can never be locked.

2. ENCRYPTED CLOUD STORAGE (Box, Tresorit):
   - Central server still exists
   - Account can still be banned
   - Files tied to their service
   - Can't work without internet
   
   OwnNet: No central server. Files on IPFS (like BitTorrent). 
   Works offline for viewing.

3. PASSWORD MANAGERS (LastPass, 1Password):
   - Only stores passwords/notes
   - Can't store files properly
   - Still centralized servers
   
   OwnNet: Stores files, notes, AND works like password manager. 
   Fully decentralized.

4. SELF-HOSTED OPTIONS:
   - Requires technical knowledge
   - Your responsibility to maintain
   
   OwnNet: No installation. Works in browser. Simple as any web app.

WHAT WE INTRODUCED THAT DOESN'T EXIST:
✓ Zero-knowledge cross-device sync (no one has done this with blockchain)
✓ Recovery phrase like crypto wallets (but for regular files)
✓ Auto-generated wallet (no MetaMask or crypto knowledge needed)
✓ Works for ANY user - not just crypto people
✓ True decentralization - if we shut down, you keep everything
```

**[1:00 - 2:00] User Journey 1: New User Creating Vault**
```
"This is Sarah. She's never used crypto or blockchain before.

[Open app landing page]

Step 1: Sarah clicks 'Get Started'
- No email required
- No account creation
- No personal information

[Setup Modal appears]

Step 2: She creates a password
- Minimum 8 characters
- Password strength indicator shows 'Strong'
- We NEVER see this password
- Keys are created in HER browser

Step 3: She receives a recovery phrase
- 12 words like 'abandon ability able about...'
- Write it down on paper
- This is her BACKUP - if she forgets password on new device
- Can access vault from ANY device with this phrase

[Show recovery phrase screen with word grid]

Step 4: She verifies she wrote it down
- We ask for 3 random words
- Prevents her from skipping backup

Step 5: Vault created!
- Her personal encryption keys generated locally
- A wallet address auto-created (she doesn't see this)
- Everything is ready

[Show empty dashboard]

Total time: 30 seconds. No email. No verification. No waiting.
```

**[2:00 - 3:30] User Journey 2: Existing User From Different Device**
```
"Now Sarah wants to access her files from her phone.

[Open app on phone/navigation]

Step 1: She sees the unlock screen
- Two options: Password or Recovery Phrase

Step 2: She chooses 'Recovery Phrase'
[Show recovery phrase input]

Step 3: She enters her 12 words
- Words must match exactly as shown
- Case-insensitive
- Space-separated

Step 4: She enters a NEW password for this device
- Creates device-specific password
- Recovery phrase derives her original wallet
- Files sync from blockchain

[Show loading/syncing animation]

Step 5: Behind the scenes MAGIC:
a) Recovery phrase creates her wallet (same address as original)
b) Blockchain returns her file manifest location
c) IPFS provides her encrypted file list
d) Her new password decrypts everything locally
e) All her files appear!

[Show dashboard with files]

Step 6: She can now:
- View files (downloaded and decrypted)
- Upload new files
- Add notes
- Everything syncs when she goes back to her laptop

What's incredible: The server NEVER saw her recovery phrase. 
The server NEVER saw her password. The server NEVER saw her files.
"
```

**[3:30 - 4:30] Complete Feature Demonstration**
```
"Let me show you EVERYTHING you can do in OwnNet Vault:

[FILE UPLOAD]
1. Upload any file type
   - Drag & drop or click to select
   - Client-side encryption happens in YOUR browser
   - Progress bar shows encryption, then upload
   - File appears in your vault

[FILE LIST]
2. View all your files
   - Filename, size, upload date
   - Click to download
   - Files are decrypted on YOUR device
   - Can delete permanently

[NOTES SYSTEM]
3. Create encrypted notes
   - Text-based notes
   - Protected like files
   - Store passwords, seeds, sensitive info
   - Completely private

[SETTINGS]
4. Account management
   - View your wallet address (for faucets)
   - Export all data
   - Reset vault (nuclear option)
   - Theme toggle (dark/light)

[STATUS BAR]
5. Connection status always visible
   - IPFS connected? (green/yellow)
   - Blockchain ready? (green/yellow)
   - Gas available? (green/red)
   - Click status for diagnostics

[CROSS-DEVICE SYNC]
6. Blockchain synchronization
   - File manifest synced on-chain
   - Access from any device with recovery phrase
   - No central database
   - Censorship-resistant
"
```

**[4:30 - 5:00] Getting ETH for Sync (IMPORTANT for Judges)**
```
"Before judges test blockchain sync, let me show you how to get test ETH.

[Show Settings page]

When you see the status bar showing 'Gas: ⚠️' in yellow or red, 
it means you need test ETH for blockchain transactions.

Here's how to get it - and it's FREE:

[Click 'Get Free Credits']

Step 1: Copy your wallet address
- Click the copy button
- Your address: 0x7F5c...

[Show modal with address]

Step 2: Go to a faucet website
- I recommend Alchemy Faucet (sepoliafaucet.com)
- It's instant and free
- No signup required for most

[Open faucet website]

Step 3: Paste your address
- Paste in the input field
- Complete the CAPTCHA
- Click 'Send Me ETH'

[Show faucet form]

Step 4: Wait 1-2 minutes
- Transaction confirms on blockchain
- You receive 0.5 ETH (fake money, for testing)

[Show transaction confirmation]

Step 5: Refresh the app
- Status changes to 'Gas: ✓'
- Sync is now enabled!

Alternative faucets:
- PoW Faucet: Mine in browser
- QuickNode: Fast and reliable
- All provide FREE test ETH

Remember: This Sepolia ETH has no real value. 
It's like Monopoly money for testing blockchain apps.

What if you don't want to use faucets?

[Show core features working without ETH]

Good news: ALL core features work WITHOUT test ETH!
- ✓ File encryption
- ✓ IPFS upload/download
- ✓ Notes
- ✓ Lock/unlock
- ⚠️ Only cross-device sync needs ETH

So judges can test 95% of features without getting ETH.
Sync is a bonus feature that requires blockchain.
"
```

**[5:00 - 5:30] Technology Deep Dive (For Technical Judges)**
```
"Here's how it works under the hood:

ARCHITECTURE:
┌─────────────────────────────────────┐
│        USER'S BROWSER (Client)       │
│  - Password entered                  │
│  - PBKDF2 derives key (150K iter)    │
│  - File encrypted with AES-256-GCM  │
│  - Recovery phrase creates wallet    │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
   ┌─────────┐         ┌──────────┐
   │  IPFS   │         │Blockchain│
   │ (Pinata)│         │ (Ethereum)│
   │         │         │           │
   │- Files  │         │- Manifest │
   │-Notes   │         │  CID      │
   │-Manifest│         │- Wallet   │
   └─────────┘         └──────────┘

KEY TECHNOLOGIES:

1. BLOCKCHAIN (Ethereum):
   - WHY: Cross-device sync without central server
   - WHAT: Stores encrypted manifest location (IPFS hash)
   - HOW: Smart contract maps wallet address to manifest CID
   - IF NOT CONNECTED: Files still work locally, sync paused

2. IPFS (Pinata):
   - WHY: Decentralized, censorship-resistant storage
   - WHAT: Stores encrypted files and manifests
   - HOW: Content-addressable storage
   - IF NOT CONNECTED: Shows cached files, new uploads queue locally

3. LOCAL STORAGE:
   - WHY: Offline functionality, fast access
   - WHAT: Cached files, file metadata, encrypted wallet
   - HOW: Browser's localStorage API
   - ALWAYS WORKS: Core features work without internet

4. ETH TOKEN:
   - WHY: Pay for blockchain transactions
   - HOW: User's auto-generated wallet needs tiny amount
   - ALTERNATIVE: Can use without ETH (sync disabled)
   - COST: ~0.001 ETH per transaction

WHAT HAPPENS WHEN THINGS FAIL:

┌──────────────────────┬────────────────────┬──────────────────┐
│ Scenario             │ What Happens       │ User Experience  │
├──────────────────────┼────────────────────┼──────────────────┤
│ No blockchain        │ Local mode         │ ✓ Works normally │
│ connection           │ Sync paused        │ ⚠ Status yellow  │
├──────────────────────┼────────────────────┼──────────────────┤
│ No IPFS connection   │ Uses cache         │ ✓ Old files work │
│                      │ Upload fails       │ ⚠ Can't upload   │
├──────────────────────┼────────────────────┼──────────────────┤
│ No internet          │ Offline mode       │ ✓ View files     │
│                      │ Queue changes      │ ⚠ Can't sync     │
├──────────────────────┼────────────────────┼──────────────────┤
│ No ETH for gas       │ Skip blockchain    │ ✓ All core works │
│                      │ Sync disabled      │ ⚠ No cross-device│
├──────────────────────┼────────────────────┼──────────────────┤
│ Server shutdown      │ Everything works   │ ✓ Files on IPFS  │
│                      │ Recovery phrase    │ ✓ Blockchain CMD │
└──────────────────────┴────────────────────┴──────────────────┘

The system is RESILIENT:
- Files > IPFS (permanently stored, content-addressed)
- Manifest > IPFS (encrypted)
- Manifest Location > Blockchain (immutable)
- Recovery > 12 words (user controlled)
"
```

**[5:30 - 6:00] Closing**
```
"OwnNet Vault represents true data ownership:

✓ You own your encryption keys
✓ You own your data (on IPFS, not our servers)
✓ You own your access (recovery phrase)
✓ You're not locked in (standard tools can access IPFS)
✓ We can't censor you
✓ We can't lock your account
✓ We can't read your files
✓ If we shut down, you keep everything

This is what the 'Own' in OwnNet means.

Try it now at ownnet-vault.vercel.app

Thank you for judging ETHOnline 2024!"
```

---

## 👥 Complete User Journey Documentation

### User Persona 1: New User (Non-Technical)

**Profile:** Has never used crypto, regular internet user

#### Journey Step by Step

**Step 1: Landing**
- Arrives at ownnet-vault.vercel.app
- Sees clean landing page
- NO login/signup confusion
- Sees "Get Started" button prominently
- NO email field visible
- NO password field visible

**Thought Process:**
- "Hmm, no signup? Interesting. Let me try."
- "This looks simple."

**Step 2: Setup - Password Creation**
- Clicks "Get Started"
- Modal appears
- Password field with strength indicator
- Confirm password field
- NO email required
- NO phone number required

**Actions:**
- Enters password: `MySecureP@ssw0rd!`
- Sees strength: "Strong" (green)
- Confirms password
- Clicks "Continue"

**Step 3: Setup - Recovery Phrase**
- Screen shows 12 random words
- Clear instruction: "Write these down"
- Warning: "⚠️ Important security message"
- Cannot skip this step
- Copy button disabled initially (forces manual writing)

**Words displayed:**
```
abandon ability able about above absent absorb abstract absurd abuse access accident
```

**User writes down on paper:**
- Sees each word clearly
- Understands this is their backup
- No confusing crypto jargon

**Step 4: Setup - Verification**
- System asks for 3 random words
- Example: "What's word #3? What's word #7? What's word #11?"
- Must type correctly
- Ensures user actually wrote it down

**Why this matters:**
- Prevents users from clicking "I wrote it down" without actually writing
- Ensures recovery is possible
- Standard practice in crypto wallets

**Step 5: Vault Created**
- Dashboard appears
- Empty state shown
- Clear interface
- Status indicators at top showing connection status

**What user sees:**
```
┌─────────────────────────────────────────┐
│ OwnNet Vault                    [Settings]│
│                                         │
│ Status: IPFS ✓ | Blockchain ✓ | Gas ⚠️   │
│                                         │
│ [Upload Files] [Notes]                  │
│                                         │
│ No files yet. Upload your first file.   │
│                                         │
│ [Drag & Drop Area]                      │
│                                         │
│ 📝 Notes (0)                            │
│                                         │
└─────────────────────────────────────────┘
```

**Step 6: Upload First File**
- Clicks upload button OR drags file
- File selection appears
- Selects file: `personal-document.pdf`
- Sees "Encrypting..." progress
- Then "Uploading to IPFS..."
- Then "Syncing to blockchain..." (if ETH available)
- File appears in list

**What happened behind scenes:**
1. File read in browser
2. AES-256-GCM encryption key derived from password
3. File encrypted with random IV
4. Encrypted file sent to IPFS (Pinata)
5. IPFS hash returned
6. Manifest updated (file list)
7. Manifest encrypted
8. Manifest uploaded to IPFS
9. Manifest CID sent to blockchain (if ETH available)

**Step 7: View File**
- Clicks on file name
- File downloads
- Browser decrypts locally
- Opens in default viewer
- User sees their PDF

**What the user understands:**
- "My file is encrypted"
- "It's stored on something called IPFS"
- "I can see it when I want"

**Step 8: Create Note**
- Clicks "Notes" tab
- Clicks "New Note"
- Types: "My Bitcoin seed phrase: orange banana cat..."
- Saves note
- Note appears in list
- Note is encrypted like files

**User retention:**
- Understands notes are private
- No one can read them
- Stored like files

**Step 9: Settings & Getting ETH for Sync**
- Clicks settings gear
- Sees:
  - Theme toggle (Dark/Light)
  - Wallet address: 0x7F5c...4e2
  - Export Data button
  - Reset Vault button (with warnings)
  - Status indicators

**User curiosity:**
- "What's this wallet address?"
- Hovers over tooltip: "Your vault ID on blockchain. Used for sync."
- Doesn't need to understand deeply
- Just knows it's technical identifier

**Status Bar:**
- IPFS: ✓ (green) - Connected
- Blockchain: ✓ (green) - Connected
- Gas: ⚠️ (yellow) - Need test ETH

**Getting Test ETH (First Time):**
- User sees yellow/red status for gas
- Clicks status indicator
- Modal opens: "Get Free Sync Credits"

**Modal Content:**
```
┌─────────────────────────────────────────┐
│ 🎁 Get Free Test ETH for Sync           │
│                                         │
│ Your wallet address:                    │
│ 0x7F5c764C64C3e23...4e2 [Copy]          │
│                                         │
│ Blockchain sync requires a tiny amount  │
│ of test ETH. Get it FREE from faucets.  │
│                                         │
│ Recommended:                            │
│ 🔗 Alchemy (sepoliafaucet.com)          │
│    ⏱️ Instant • ✅ No signup           │
│                                         │
│ Alternative:                             │
│ 🔗 QuickNode (faucet.quicknode.com)     │
│ 🔗 PoW Faucet (sepolia-faucet.pk910.de) │
│                                         │
│ Steps:                                  │
│ 1. Copy address above                   │
│ 2. Open faucet website                  │
│ 3. Paste address & submit               │
│ 4. Wait 1-2 minutes                     │
│ 5. Refresh this page                    │
│                                         │
│ [Copy Address] [Close]                  │
└─────────────────────────────────────────┘
```

**User Action:**
- Clicks "Copy Address"
- Opens the link to faucet
- Pastes address
- Completes CAPTCHA
- Waits 1-2 minutes

**Result:**
- 0.5 ETH appears in wallet
- Status changes to: Gas: ✓ (green)
- Blockchain sync now enabled

**Alternative: Skip Getting ETH**
- User can skip this step
- All core features still work
- Only cross-device sync is disabled
- User can come back later

**User understanding:**
- "I need test ETH to sync across devices"
- "But I can still use the app without it"
- "Getting test ETH is free and easy"
- "The app tells me exactly what to do"

**Step 10: Log Out / Lock**
- Clicks "Lock Vault"
- Returns to unlock screen
- All data cleared from memory
- Keys deleted from browser
- Must enter password to unlock

**Security:**
- Locking doesn't delete files
- Just clears encryption keys from memory
- Must re-enter password to access
- Like logging out of any app

**Total Experience:**
- Time: 2-3 minutes to setup
- Complexity: Low (as easy as Dropbox)
- Crypto knowledge required: Zero
- Technical skills required: Can use web browser

---

### User Persona 2: Existing User From Different Device

**Profile:** Created vault on laptop, now accessing from phone

#### Journey Step by Step

**Step 1: Navigate to Website**
- Opens phone browser
- Goes to ownnet-vault.vercel.app
- Sees landing page
- Clicks "Get Started"

**Step 2: Unlock Options**
- Sees password screen
- But also sees: "Already have a vault? Use recovery phrase"
- Two clear options:
  1. Enter password (for THIS device if previously unlocked)
  2. Enter recovery phrase (for NEW device or forgot password)

**User chooses:** "Use recovery phrase"

**Step 3: Recovery Phrase Input**
- Large text area appears
- Clear placeholder: "word1 word2 word3 word4..."
- Helper text: "Enter all 12 words separated by spaces"
- Case-insensitive input
- Word count indicator

**User enters:**
```
abandon ability able about above absent absorb abstract absurd abuse access accident
```

**Validation:**
- System checks: Exactly 12 words?
- System checks: All words from valid word list?
- Error handling: "Word 'abiliti' not recognized"
- User corrects: "ability"
- Green checkmark appears

**Step 4: Create New Password for THIS Device**
- Why: Recovery phrase gives access to SAME wallet
  - But local encryption needs a password
- Password field appears
- Strength indicator
- Confirm password

**User enters:** `DifferentPasswordForPhone123!`

**Behind the scenes:**
1. Recovery phrase derives wallet (same address as laptop)
2. Wallet address queries blockchain
3. Blockchain returns manifest CID
4. Manifest CID fetched from IPFS
5. Manifest encrypted (needs password)
6. Password decrypts manifest
7. File list appears

**Step 5: File Sync**
- Loader shows: "Syncing from blockchain..."
- Progress: "Fetching manifest..."
- Progress: "Verifying files..."
- Dashboard appears with all files from laptop

**What user sees:**
```
personal-document.pdf    (2.3 MB)    Mar 30, 2026
family-photo.jpg          (1.1 MB)    Mar 29, 2026
seed-phrase-backup.txt    (4 KB)      Mar 28, 2026
```

**Step 6: Actions Available**
- Download files (decrypt locally)
- Upload new files (sync across devices)
- Create notes (sync across devices)
- Lock vault

**What's different from original device:**
- NOTHING is different
- Same files
- Same vault
- Same access
- Just different device

**Step 7: Upload New File on Phone**
- Uploads: `mobile-note.txt`
- Encrypts in phone browser
- Uploads to IPFS
- Updates manifest
- Syncs to blockchain

**Step 8: Return to Laptop**
- Opens laptop
- Unlocks with password (original device)
- New file appears automatically
- Sync happened via blockchain

**User understanding:**
- "My files follow me everywhere"
- "No cloud service account needed"
- "Just my recovery phrase"
- "This is amazing!"

---

## 🎯 Complete Feature List & Actions

### Core Actions (Available to All Users)

#### 1. File Management

**Upload File**
```
Action: Drag & drop or click to select file
Process:
1. File selected by user
2. Read in browser using File API
3. Encryption key derived from password (PBKDF2, 150K iterations)
4. Random IV generated (12 bytes)
5. File encrypted with AES-256-GCM
6. Encrypted blob created
7. Uploaded to IPFS via Pinata API
8. IPFS hash returned (CID)
9. File metadata added to manifest
10. Manifest encrypted
11. Manifest uploaded to IPFS
12. Manifest CID synced to blockchain (if ETH available)

User sees: Progress indicators for encryption, upload, sync
Result: File appears in list with name, size, date
```

**View Files**
```
Action: Open vault
Process:
1. File list loaded from manifest
2. Manifest already decrypted on unlock
3. File list rendered in UI

User sees: Table of files with actions
```

**Download File**
```
Action: Click file name or download icon
Process:
1. IPFS hash fetched from manifest
2. Encrypted blob downloaded from IPFS gateway
3. Blob cached in localStorage
4. Blob decrypted with user's key
5. Decrypted file presented for download

User sees: Browser download dialog
Result: Original file downloaded
```

**Delete File**
```
Action: Click delete icon, confirm
Process:
1. File removed from manifest
2. Manifest re-encrypted
3. Manifest uploaded to IPFS (new CID)
4. Blockchain updated with new manifest CID
5. Local cache cleared

Note: File still exists on IPFS (immutable), but inaccessible without new manifest
User sees: File removed from list
```

#### 2. Notes Management

**Create Note**
```
Action: Click "New Note" button
Process:
1. Large text area appears
2. User types content
3. On save, note encrypted like file
4. Uploaded to IPFS
5. Note hash added to manifest
6. Manifest synced to blockchain

User sees: Note in notes list
```

**View/Edit Note**
```
Action: Click note in list
Process:
1. Note hash fetched from manifest
2. Encrypted note downloaded from IPFS
3. Note decrypted locally
4. Content displayed in text editor
5. On edit, re-encrypted and re-uploaded

User sees: Note content in editor
```

#### 3. Security Actions

**Lock Vault**
```
Action: Click "Lock Vault" button
Process:
1. Encryption keys cleared from memory
2. Password cleared
3. Files list cleared
4. Redirect to unlock screen

User sees: Unlock screen
Security: Keys gone from memory, must re-authenticate
```

**Use Recovery Phrase**
```
Action: Click "Use recovery phrase" link
Process:
1. Shows 12-word input field
2. User enters phrase
3. Phrase validated
4. Wallet derived from phrase (same address as original)
5. Blockchain queried for manifest CID
6. Manifest downloaded from IPFS
7. User must create NEW password for THIS device
8. Manifest decrypted with new password
9. Files restored

User sees: All files from original vault
Use case: Accessing vault from new device OR forgot password
```

**Export All Data**
```
Action: Settings > Export Data
Process:
1. Manifest data gathered
2. File metadata compiled
3. Wallet address included
4. Export date added
5. JSON file generated
6. Browser download triggered

User gets: ownnet-vault-export-2026-03-30.json
Use case: Backup for offline storage
```

**Reset Vault**
```
Action: Settings > Reset Vault (requires confirmation)
Process:
1. Warning shown: "This will delete ALL data"
2. User must confirm
3. localStorage cleared
4. Session cleared
5. Redirect to setup

Warning shown:
"⚠️ Your recovery phrase can still be used on other devices to access your old vault."
"If you want to completely revoke access, create a NEW vault with a NEW recovery phrase."

User sees: Fresh setup screen
Note: Old vault still exists on blockchain if phrase is used elsewhere
```

#### 4. Get ETH for Sync (IMPORTANT!)

**Why You Need ETH:**
```
Blockchain sync requires ETH to pay for transaction fees (gas).
- Creating vault: ~0.001 ETH
- Uploading file: ~0.0005 ETH  
- Syncing: ~0.0003 ETH

Total cost for testing: Less than 0.01 ETH
On testnet, this ETH is FREE (see below)
```

**How to Get FREE Test ETH:**

**Method 1: Built-in Get Credits Button**
```
Action: Click "Get Free Credits" or "Enable Sync"
Process:
1. App shows your wallet address: 0x7F5c...4e2
2. Copy button provided
3. Instructions shown on screen
4. Links to faucets provided

User sees:
┌─────────────────────────────────────────┐
│ 🎁 Get Free Sync Credits                │
│                                         │
│ Your wallet address:                    │
│ 0x7F5c764C64C3e23...4e2 [Copy]          │
│                                         │
│ To enable blockchain sync, get free     │
│ test ETH from one of these faucets:     │
│                                         │
│ 🔗 PoW Faucet (No signup required)      │
│ 🔗 QuickNode Faucet (Fast)              │
│ 🔗 Alchemy Faucet (Reliable)            │
│                                         │
│ Copy your address above, paste at       │
│ faucet, wait 1-2 minutes, refresh page  │
│                                         │
│ [Copied to Clipboard]                   │
└─────────────────────────────────────────┘
```

**Method 2: Manual Faucet Process**
```
Step 1: Find Your Wallet Address
- Go to Settings (gear icon)
- Look for "Wallet Address" section
- See: 0x7F5c764C64C3e23A2F3...
- Click "Copy" button

Step 2: Go to a Faucet Website
Choose one of these FREE faucets:

| Faucet | URL | Amount | Wait Time |
|--------|-----|--------|-----------|
| PoW Faucet | sepolia-faucet.pk910.de | 0.05+ ETH | 2-5 min (mine) |
| QuickNode | faucet.quicknode.com/ethereum/sepolia | 0.1 ETH | 1-2 min |
| Alchemy | sepoliafaucet.com | 0.5 ETH | Instant |
| Infura | infura.io/faucet/sepolia | 0.5 ETH | Instant |

Step 3: Paste Your Address
- Open faucet website
- Paste your wallet address
- Complete any CAPTCHA if needed
- Click "Send ETH" or similar

Step 4: Wait for ETH
- Most faucets: 1-2 minutes
- PoW faucet: 2-5 minutes (requires mining)
- Check transaction: sepolia.etherscan.io

Step 5: Verify ETH Received
- Go back to app
- Look at status bar
- Should show: "Gas: ✓" or "Balance: 0.1 ETH"
- Or refresh page
```

**Alternative: If You Already Have Wallet with ETH**
```
Step 1: Open your existing wallet (MetaMask, Coinbase, etc.)
Step 2: Switch to Sepolia testnet
Step 3: Send test ETH to your OwnNet wallet address
Step 4: Refresh page to see balance
```

**Do I Need Real ETH?**
```
NO! For testing and hackathon judging, use Sepolia testnet ETH.
It's completely FREE and has NO real value.

🔶 Sepolia = Test network for development
✓ Free ETH from faucets
✓ Same functionality as mainnet
✓ Perfect for testing
❌ Not real money
```

**What If I Don't Want to Get ETH?**
```
You can still use OwnNet Vault WITHOUT test ETH!

What STILL WORKS:
✓ File encryption
✓ File upload to IPFS
✓ File download
✓ Notes creation
✓ Local storage
✓ Lock/unlock vault
✓ All core features

What DOESN'T WORK:
✗ Cross-device sync (blockchain feature)
✗ Blockchain manifest update

This is fine for testing core features!
Sync is an optional enhancement.
```

#### 5. Settings & Customization

**Toggle Theme**
```
Action: Settings > Theme toggle
Process:
1. CSS variables updated
2. Preference saved to localStorage
3. Dark/Light mode applied globally

User sees: Immediately applied theme change
```

**View Wallet Address**
```
Action: Settings > See wallet address
Process:
1. Shows auto-generated wallet address (from setup)
2. Copy button provided
3. Used for receiving test ETH for blockchain features

User sees: 0x7F5c764C64C3e23...4e2
Use case: Get test ETH from faucet for sync
```

#### 5. Status & Diagnostics

**View Connection Status**
```
Action: Click status bar
Process:
1. Shows current status of:
   - IPFS connection (green/yellow)
   - Blockchain connection (green/yellow)
   - ETH balance for gas (green/red)
2. Provides troubleshooting steps

User sees: Status modal with details:
- IPFS: Connected ✓
- Blockchain: Connected ✓
- Gas: 0.001 ETH ✓
```

---

## 🔄 Comparison with Existing Systems

### 1. Cloud Storage (Google Drive, Dropbox, iCloud, OneDrive)

| Aspect | Traditional Cloud | OwnNet Vault |
|--------|-------------------|--------------|
| **Data Access** | ✗ Provider can read all files | ✓ Provider CANNOT read files |
| **Ownership** | ✗ Provider owns your data | ✓ User owns all data |
| **Privacy** | ✗ Files scanned for ads/targeting | ✓ Zero-knowledge encryption |
| **Account Lock** | ✗ Can be banned/deleted | ✓ No account to ban |
| **Censorship** | ✗ Files can be removed | ✓ Files on IPFS, cannot be removed |
| **Centralization** | ✗ Central server (SPOF) | ✓ Decentralized (no SPOF) |
| **Recovery** | ✗ Email/password reset by company | ✓ User-controlled recovery phrase |
| **Cost** | $/month for storage | Free (IPFS fair use) |
| **Cross-Device** | ✓ Automatic sync | ✓ Blockchain sync |
| **Offline Access** | ✗ Requires internet | ✓ Cached files accessible |

**What OwnNet DOESN'T have:**
- Collaboration features (real-time editing)
- File versioning (planned)
- File sharing (planned)

**What OwnNet DOES have that they DON'T:**
- True privacy (zero-knowledge)
- User ownership (can't be locked out)
- Censorship resistance
- Server can't access data
- Works without login/signup
- Recovery phrase backup

### 2. Encrypted Cloud Storage (Box, Tresorit, SpiderOak)

| Aspect | Encrypted Cloud | OwnNet Vault |
|--------|-----------------|--------------|
| **Encryption** | ✓ Client-side encryption | ✓ Client-side encryption |
| **Data Storage** | ✗ Central server | ✓ IPFS (decentralized) |
| **Account Lock** | ✗ Can still be banned | ✓ No account to ban |
| **Recovery** | ✗ Company can reset password | ✓ Recovery phrase (user-controlled) |
| **Centralization** | ✗ Single server or region | ✓ Global IPFS network |
| **Cost** | $10-15/month | Free (ETH for sync) |
| **Cross-Device** | ✓ Via their servers | ✓ Via blockchain |
| **If Company Shuts Down** | ✗ Your data is gone | ✓ Your data remains on IPFS |

**What OwnNet DOESN'T have:**
- Enterprise features
- Team collaboration
- Admin console

**What OwnNet DOES have that they DON'T:**
- Decentralized storage (no SPOF)
- Blockchain-based sync
- Recovery phrase (no company needed)
- Zero infrastructure dependency
- Survives company shutdown

### 3. Password Managers (LastPass, 1Password, Bitwarden)

| Aspect | Password Manager | OwnNet Vault |
|--------|------------------|--------------|
| **Primary Use** | Passwords/notes | Files, notes, passwords |
| **File Storage** | ✗ Limited or none | ✓ Full file support |
| **Encryption** | ✓ AES-256 | ✓ AES-256-GCM |
| **Storage Location** | ✗ Central server | ✓ IPFS (decentralized) |
| **Recovery** | ⚠️ Company can help reset | ✓ Recovery phrase only |
| **Cost** | $3-8/month | Free |
| **Data Types** | Passwords, notes, cards | Any file type |

**What OwnNet DOESN'T have:**
- Browser autofill
- Password generation
- Secure sharing (planned)

**What OwnNet DOES have that they DON'T:**
- File storage
- Decentralized storage
- No central server (survives shutdown)
- Blockchain sync (no company servers)

### 4. Self-Hosted Solutions (Nextcloud, ownCloud, Paperless-ng)

| Aspect | Self-Hosted | OwnNet Vault |
|--------|-------------|--------------|
| **Setup** | ✗ Requires tech skills | ✓ Works in browser instantly |
| **Maintenance** | ✗ User must maintain server | ✓ Zero maintenance |
| **Cost** | ✗ Server costs | ✓ Free |
| **Privacy** | ⚠️ User must configure encryption | ✓ Encryption by default |
| **Cross-Device** | ✗ Requires server to be online | ✓ Always available (IPFS + blockchain) |
| **Recovery** | ✗ User's responsibility | ✓ Recovery phrase |
| **Censorship Resistance** | ✗ Server can be shut down | ✓ IPFS cannot be shut down |

**What OwnNet DOESN'T have:**
- Self-hosting option (yet)
- Custom server control

**What OwnNet DOES have that they DON'T:**
- Zero setup
- Zero maintenance
- Works anywhere
- Censorship resistance
- Blockchain sync

### 5. Crypto Wallets (MetaMask, Coinbase Wallet)

| Aspect | Crypto Wallet | OwnNet Vault |
|--------|---------------|--------------|
| **File Storage** | ✗ No | ✓ Yes |
| **Recovery Phrase** | ✓ Seed phrase | ✓ Seed phrase |
| **Web3 Integration** | ✓ DApps | ✓ Auto-generated wallet |
| **Crypto Knowledge** | ✗ Required | ✓ NOT required |
| **User Experience** | ⚠️ Tech-savvy users | ✓ All users |

**What OwnNet DOES have in common:**
- Recovery phrase (same security model)
- Wallet for blockchain transactions

**What OwnNet DOES that they DON'T:**
- File storage
- Note storage
- Full encryption
- Zero-knowledge vault

---

## 🆕 What Makes OwnNet Unique (NOT in Existing Systems)

### 1. Zero-Knowledge Cross-Device Sync

**Traditional Approach:**
```
Device 1 → Upload to server → Server syncs → Device 2 downloads
Problem: Server sees all data
```

**OwnNet Approach:**
```
Device 1:
1. Encrypt file locally
2. Upload to IPFS
3. Update encrypted manifest
4. Write manifest CID to blockchain

Device 2:
1. Recovery phrase recreates wallet
2. Query blockchain for manifest CID
3. Download encrypted manifest from IPFS
4. Decrypt manifest
5. Files appear

Server NEVER sees:
- Password
- Recovery phrase
- Decryption keys
- File contents
- Manifest contents
```

**No one has done this with blockchain for regular file storage.**

### 2. Recovery Phrase for Regular Files

**Traditional Approach:**
- Password managers: Company can reset password
- Cloud storage: Company can reset password
- Self-hosted: You lose access if server dies

**OwnNet Approach:**
- Recovery phrase = full access from ANY device
- Works like crypto wallet, but for FILES
- Company cannot help you (good thing: means company cannot access your data)
- If you lose both password AND recovery phrase, data is gone (true ownership)

**This doesn't exist in mainstream products.**

### 3. Auto-Generated Wallet (No MetaMask Required)

**Traditional Crypto Approach:**
- User must install MetaMask
- User must understand seed phrases
- User must have ETH for gas
- User must understand blockchain

**OwnNet Approach:**
- User creates password (like any app)
- User gets recovery phrase (like backup codes)
- Wallet generated automatically
- User doesn't even know there's a wallet
- ETH only needed for cross-device sync (optional)

**This makes Web3 accessible to non-crypto users.**

### 4. True Decentralization Without Complexity

**Traditional Decentralized Apps:**
- Require MetaMask
- Require crypto knowledge
- Require ETH before you can do anything
- Confusing for regular users

**OwnNet Approach:**
- Works in any browser
- No MetaMask needed
- Core features work WITHOUT blockchain
- Blockchain is OPTIONAL enhancement
- User experience is like any web app

**This bridges Web2 UX with Web3 benefits.**

### 5. Server Can't Lock You Out

**Traditional Cloud:**
- Account banned → all files gone
- Forgot password → company can reset
- Account deleted → files deleted
- Platform changes → you must accept

**OwnNet Approach:**
- No account to ban
- Password stored as hash (we can't reset it)
- Recovery phrase is your backup
- Files on IPFS (we can't delete them)
- Manifest on blockchain (immutable)
- We shut down → you keep everything

**Unlike any mainstream cloud service.**

### 6. Works Offline

**Traditional Cloud:**
- No internet → no access to files
- Server down → no access

**OwnNet Approach:**
- Files cached locally
- View cached files offline
- Queue uploads for when online
- Manifest updates when connected
- Core functionality works offline

**Exceptional resilience.**

---

## 🏗️ Technology Stack Explained (For Non-Technical Users)

### How This All Works Together

Think of OwnNet Vault like a secure safety deposit box, but digital:

**Your Password = Your Key**
- Like a physical key to a safety deposit box
- Created in YOUR browser, never sent to us
- We never see it, never store it
- If you lose it, you need your backup (recovery phrase)

**Recovery Phrase = Spare Key**
- Like a spare key kept in a safe place
- 12 random words
- Use it to access your vault from ANY device
- We can't help if you lose both (that's good - means we can't access your data)

**AES-256-GCM Encryption = Unbreakable Lock**
- Military-grade encryption
- Your file is scrambled before it leaves your device
- We can't read it even if we tried
- Only your password can unscramble it

### Technology 1: Local Storage (Browser)

**What it is:** Your browser's built-in storage (like cookies but bigger)

**What we store:**
- File cache (so you can view offline)
- File metadata (names, sizes)
- Encrypted wallet info

**Why we use it:**
```javascript
// Works without internet
// Fast access (no download needed)
// Private (only in your browser)

// Example:
const cachedFiles = localStorage.getItem('ownnet-files');
// Instantly shows your files
```

**What happens if it fails:**
- You can still access vault
- Just slower (must re-download from IPFS)
- No data lost

**Benefits:**
- ✓ Instant access
- ✓ Works offline
- ✓ No server needed
- ✓ Private (only in your browser)

**Limitations:**
- ✗ Only stores so much (browser limit)
- ✗ Cleared if you clear browser data

### Technology 2: IPFS (Decentralized File Storage)

**What it is:** Think of it like BitTorrent meets Dropbox

**Traditional Cloud:**
```
Your File → Amazon/Google Server → You download from them
Problem: They can see your file, delete your file, go offline
```

**IPFS:**
```
Your File → Encrypted → Split across many computers → You download from nearest computer

Benefits:
- No central server (cannot be shut down)
- Content-addressed (file identified by content, not location)
- Globally distributed (fast everywhere)
- Permanent (files cannot be deleted)
```

**How it works:**
```
1. Your file (encrypted): "my-secret.pdf"
2. Gets a unique address: QmXyz...abc123
3. Stored on multiple computers worldwide
4. You request QmXyz...abc123
5. Nearest computer sends it to you
6. Browser decrypts it
```

**Why we use IPFS:**
```javascript
// Upload encrypted file
const ipfsHash = await uploadToIPFS(encryptedFile);
// Returns: QmXyz...abc123

// This hash is permanent
// Even if we shut down, file still exists at QmXyz...abc123
```

**What happens if IPFS fails:**
- Gateway issues: Try alternative gateway
- Pinata down: Files still exist on IPFS network
- Complete internet down: Use cached files

**Benefits:**
- ✓ Censorship-resistant (cannot be removed)
- ✓ Decentralized (no single point of failure)
- ✓ Permanent (files don't disappear)
- ✓ Fast (download from nearest node)

**How it helps user:**
- Files always available
- No company can delete your files
- Works even if we shut down

### Technology 3: Blockchain (Ethereum)

**What it is:** A global, permanent record book

**Simple analogy:**
```
Think of blockchain like a shared Google Doc:
- Everyone can see it
- No one can erase anything
- Entries are permanent
- Entries are verified

But:
- It's not owned by Google
- It's owned by everyone
- It can't be shut down
```

**Why we use blockchain:**
```
Problem: How do you sync files across devices WITHOUT a central server?

Traditional solution: Dropbox's servers
Our solution: Ethereum blockchain

Here's how:
```

**When you create a vault:**
```
1. You create password
2. System creates wallet for you (like a unique ID)
3. Wallet address: 0x7F5c...4e2
4. You upload file → IPFS hash: QmXyz...abc123
5. We create manifest (list of your files): { files: [...] }
6. Manifest encrypted → uploaded to IPFS → hash: QmManifest...456
7. Blockchain entry: "Wallet 0x7F5c...4e2 has manifest QmManifest...456"
```

**When you access from new device:**
```
1. You enter recovery phrase
2. System recreates wallet: 0x7F5c...4e2
3. Query blockchain: "What manifest for wallet 0x7F5c...4e2?"
4. Blockchain responds: "QmManifest...456"
5. Download QmManifest...456 from IPFS
6. Decrypt with your password
7. See your files!
```

**What data is on blockchain:**
```
Only this:
{
  walletAddress: 0x7F5c...4e2,
  manifestHash: QmManifest...456,
  timestamp: 1711000000000
}

NOT on blockchain:
- Your password
- Your files
- Your file contents
- Your recovery phrase
- Any personal data
```

**What happens if blockchain fails:**
```
Connection issues:
- Local files still work
- New uploads queue locally
- Sync paused (yellow status indicator)
- All core features still usable

No ETH for gas:
- Files still work
- Upload still works
- Sync disabled (red status indicator)
- Can test app without ETH
```

**Why this matters:**
```
✓ No central server to hack
✓ No central server to shut down
✓ No central server to censor
✓ Your file list is permanent
✓ Works from any device
✓ You own your data (not us)
```

### Technology 4: ETH Token (Ethereum's Currency)

**What it is:** Small amount of digital currency needed to use blockchain

**Why needed:**
```
Writing to blockchain costs "gas"
Gas is paid in ETH
- Creating vault: ~0.001 ETH
- Uploading file: ~0.0005 ETH  
- Syncing: ~0.0003 ETH

Total for basic use: ~0.01 ETH ($3-5 on Sepolia testnet, but FREE testnet ETH)
```

**Where to get ETH:**

**Testnet (FREE - For Testing/Judging):**
```
Step 1: Get your wallet address
- In the app, click Settings (gear icon)
- Find "Wallet Address" section
- Click "Copy" button
- Your address: 0x7F5c764C64C3e23A2F3...

Step 2: Choose a faucet website

Option A: Alchemy Faucet (RECOMMENDED - Instant)
- URL: https://sepoliafaucet.com
- Requirements: Free Alchemy account (1 minute signup)
- Amount: 0.5 ETH
- Speed: Instant
- Reliability: ★★★★★

Option B: QuickNode Faucet (FAST - No Signup)
- URL: https://faucet.quicknode.com/ethereum/sepolia
- Requirements: None
- Amount: 0.1 ETH
- Speed: 1-2 minutes
- Reliability: ★★★★☆

Option C: PoW Faucet (FREE - No Signup Required)
- URL: https://sepolia-faucet.pk910.de/
- Requirements: Mine in browser (2-5 minutes)
- Amount: 0.05+ ETH (depends on mining time)
- Speed: 2-5 minutes
- Reliability: ★★★☆☆

Option D: Infura Faucet (FAST - Account Required)
- URL: https://www.infura.io/faucet/sepolia
- Requirements: Free Infura account
- Amount: 0.5 ETH
- Speed: Instant
- Reliability: ★★★★★

Step 3: Paste your address
- Open faucet website
- Paste your wallet address in the input field
- Complete any CAPTCHA if required
- Click "Send ETH" or "Request ETH"

Step 4: Wait for confirmation
- Most faucets: 1-2 minutes
- PoW faucet: 2-5 minutes (browser mining)
- Check transaction: https://sepolia.etherscan.io/

Step 5: Verify ETH received
- Go back to OwnNet Vault
- Look at status bar at top
- Should show: "Gas: ✓" or "Balance: 0.5 ETH"
- Or refresh page to update
```

**Using Alchemy Faucet (Detailed Walkthrough):**
```
1. Visit: https://sepoliafaucet.com
2. Click "Login" or "Sign Up" (free account)
3. Enter email and create password
4. Verify email (check inbox)
5. Return to faucet page
6. Paste your wallet address: 0x7F5c...
7. Click "Send Me ETH"
8. See confirmation: "Transaction sent!"
9. Wait ~30 seconds
10. Check balance in app
```

**Using QuickNode Faucet (No Account):**
```
1. Visit: https://faucet.quicknode.com/ethereum/sepolia
2. No signup required!
3. Paste wallet address: 0x7F5c...
4. Complete simple CAPTCHA (select images)
5. Click "Send Me ETH"
6. Wait 1-2 minutes
7. Check balancence in app
```

**What if I already have a wallet with test ETH?**
```
If you use MetaMask or another wallet with Sepolia ETH:

Step 1: Open your wallet
Step 2: Select "Sepolia Test Network"
Step 3: Send test ETH to your OwnNet address
Step 4: Paste your OwnNet address (from Settings)
Step 5: Confirm transaction
Step 6: Refresh OwnNet Vault page
```

**DON'T use real Ethereum mainnet!**
```
⚠️ WARNING: 
- Mainnet ETH costs REAL MONEY
- Sepolia testnet ETH is FREE and has NO VALUE
- For testing/hackathon judging, ALWAYS use Sepolia
- Mainnet is for production apps only

How to ensure you're on Sepolia:
- MetaMask: Network should show "Sepolia"
- Balance should be 0 on mainnet
- Transactions on sepolia.etherscan.io
```

**What if user doesn't want to get ETH?**
```
All core features work WITHOUT test ETH:

✓ File encryption
✓ File upload to IPFS  
✓ File download
✓ Notes creation
✓ Local storage
✓ Lock/unlock vault
✓ Export data
✓ Settings customization

What DOESN'T work:
✗ Cross-device sync (blockchain feature)
✗ Manifest update on blockchain

This is FINE for most testing!
Sync is an optional enhancement.
Core privacy and security features work perfectly.
```

**Cost breakdown (for transparency):**
```
On Sepolia Testnet:
- Vault creation: ~0.0008 ETH (~$0.002)
- File upload: ~0.0003 ETH (~$0.001)
- File delete: ~0.0002 ETH (~$0.0005)
- Sync update: ~0.0001 ETH (~$0.0002)

Total for testing: < 0.01 ETH
FREE from faucets!

On Mainnet (NOT FOR TESTING):
- Same operations would cost $1-5 each
- NOT recommended for hackathon
- NOT needed for judging
```

**Troubleshooting ETH Issues:**

| Problem | Solution |
|---------|----------|
| Faucet says "try again later" | Wait 24 hours or try different faucet |
| No transaction in wallet | Check sepolia.etherscan.io for your address |
| Balance shows 0 | Wait 2-3 minutes, refresh page |
| MetaMask not showing Sepolia | Enable test networks in settings |
| "Insufficient funds" error | Get more ETH from faucet |
| Transaction pending | Wait for network confirmation (1-2 min) |
| Wrong network error | Switch MetaMask to Sepolia testnet |

**Adding Sepolia Network to MetaMask:**
```
If Sepolia doesn't appear in your wallet:

Method 1: Auto-add via Chainlist
1. Visit: chainlist.org
2. Search for "Sepolia"
3. Click "Connect Wallet"
4. Click "Add to MetaMask"

Method 2: Manual addition
1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter:
   - Network Name: Sepolia
   - RPC URL: https://rpc.sepolia.org
   - Chain ID: 11155111
   - Currency Symbol: SepoliaETH
   - Block Explorer: https://sepolia.etherscan.io
5. Click "Save"
```

---

## ⚡ Failure Scenarios & User Experience

### Scenario: No Blockchain Connection

**What happens:**
```
1. User tries to upload file
2. App detects blockchain unavailable
3. Shows status: "Blockchain: Disconnected ⚠️"
4. File encrypts normally
5. File uploads to IPFS (works)
6. Manifest updates locally
7. Warning: "File saved locally. Sync when blockchain available."
```

**User experience:**
- Sees yellow status indicator
- File uploads successfully
- Gets clear message about sync status
- Can continue using app normally
- File appears in list

**What works:**
- ✓ File upload
- ✓ File download
- ✓ Notes
- ✓ Lock/unlock
- ✓ All encryption

**What doesn't work:**
- ✗ Cross-device sync
- ✗ Blockchain manifest

**How to fix:**
- Wait for blockchain to reconnect
- Or refresh page
- Or check internet connection

### Scenario: No IPFS Connection

**What happens:**
```
1. User tries to upload file
2. File encrypts normally (local)
3. IPFS upload fails
4. Error: "Storage service unavailable"
5. Suggestion: "File saved locally. Will upload when connected."
```

**User experience:**
- Sees error message
- File saved in localStorage (encrypted)
- Upload queued for retry
- Can view cached files

**What works:**
- ✓ View cached files
- ✓ Create notes (local)
- ✓ Lock/unlock

**What doesn't work:**
- ✗ New file uploads (to IPFS)
- ✗ Cross-device access to new files

**How to fix:**
- Wait for IPFS to reconnect
- Or use alternative gateway
- Or check Pinata status

### Scenario: No Internet Connection

**What happens:**
```
1. User opens app
2. Files load from localStorage
3. Status shows: "Offline mode"
4. Cached files viewable
5. New files queued locally
6. Sync will happen when online
```

**User experience:**
- Opens app as normal
- Sees cached files
- Can view downloaded files
- Cannot upload new files (no internet)
- Cannot sync
- Clear offline indicator

**What works:**
- ✓ View cached files
- ✓ Create notes (saved locally)
- ✓ Lock vault
- ✓ Use settings

**What doesn't work:**
- ✗ Upload files
- ✗ Download new files
- ✗ Sync

**How to fix:**
- Connect to internet
- Files will sync automatically
- No user action needed

### Scenario: No ETH for Gas

**What happens:**
```
1. User creates vault
2. All core features work
3. User tries to sync
4. Status shows: "Need ETH for sync"
5. Button: "Get Free ETH" → instructions
```

**User experience:**
- Uses app normally
- Files work great
- Encryption works
- Upload works
- Just can't sync across devices yet

**What works:**
- ✓ Everything except sync

**What doesn't work:**
- ✗ Cross-device sync

**How to fix:**
- Click "Get Free ETH"
- Copy wallet address
- Go to faucet
- Get free test ETH
- Refresh page
- Sync enabled

---

## 📊 Summary Table: What Works When

| Feature | Online + ETH | Online, No ETH | Offline | Blockchain Down | IPFS Down |
|---------|--------------|----------------|---------|------------------|-----------|
| **File Upload** | ✓ Upload + Sync | ✓ Upload local | ✗ Queue locally | ✓ Upload | ✓ Upload & cache |
| **File Download** | ✓ Download | ✓ Download | ✓ Cached only | ✓ Download | ✓ Cached |
| **File View** | ✓ All files | ✓ All files | ✓ Cached | ✓ All files | ✓ Cached |
| **Notes** | ✓ Create + Sync | ✓ Create | ✓ Create local | ✓ Create | ✓ Create |
| **Encryption** | ✓ Full | ✓ Full | ✓ Full | ✓ Full | ✓ Full |
| **Cross-Device Sync** | ✓ Sync | ✗ No sync | ✗ No sync | ✗ No sync | ✗ No sync |
| **Lock Vault** | ✓ Lock | ✓ Lock | ✓ Lock | ✓ Lock | ✓ Lock |
| **Recovery Phrase** | ✓ Works | ✓ Works | ✗ Needs online | ✓ Works | ✓ Works |
| **Export Data** | ✓ Export | ✓ Export | ✓ Export | ✓ Export | ✓ Export |

---

## ✅ Pre-Submission Checklist

### Required Items

| Item | Status | Notes |
|------|--------|-------|
| Live Demo | ✅ Done | https://ownnet-vault.vercel.app/ |
| Demo Video | ❌ TODO | Use script above to record |
| GitHub Repository | ✅ Done | Already pushed |
| README | ✅ Done | With hackathon section |
| Smart Contract | ✅ Deployed | On Sepolia testnet |
| Comparison Docs | ✅ Done | In this file |
| User Journeys | ✅ Done | In this file |
| Tech Explanation | ✅ Done | In this file |
| Failure Scenarios | ✅ Done | In this file |

---

## 🎥 Recording Tips for Video

### Pre-Recording Setup (IMPORTANT!)

**1. Get Test ETH Ready**
```
□ Visit https://sepoliafaucet.com
□ Create free Alchemy account (1 minute)
□ Copy your wallet address from app settings
□ Request 0.5 ETH (instant)
□ Verify it appears in app status bar
□ You should see: "Gas: ✓" (green)

This is CRITICAL for demo!
Without test ETH, you can't show blockchain sync.
```

**2. Prepare Test Data**
```
□ Create some sample files:
  - A PDF document
  - An image (photo)
  - A text file
  
□ Create a test note:
  - Sample password list
  - Sample seed phrase backup
  
□ Upload these BEFORE recording
□ Verify they appear in dashboard
□ Download one to show decryption works
```

**3. Browser Setup**
```
□ Use Chrome or Firefox (not Safari)
□ Clear cache and cookies (fresh start)
□ Close unnecessary tabs
□ Disable browser extensions that might interfere
□ Set resolution to 1080p (1920x1080)
□ Use incognito mode for clean demo
```

**4. Recording Equipment**
```
□ Microphone: Built-in laptop mic is OK, external is better
□ Camera: Optional, but adds credibility
□ Screen recording: Loom (easiest) or OBS (free, more control)
□ Internet: Stable connection (ethernet preferred over WiFi)
□ Quiet environment: No background noise
```

### What to Show in Demo (Step-by-Step)

**Opening (30 seconds):**
```
1. Open app at ownnet-vault.vercel.app
2. Show clean landing page
3. Hover over features if needed
4. Click "Get Started"
```

**Creating Vault (45 seconds):**
```
1. Enter password (type slowly, clearly)
2. Show password strength indicator
3. Show 12-word recovery phrase
4. ALWAYS mention: "Write this down on paper"
5. Verify 3 words
6. Show dashboard
```

**Uploading File (45 seconds):**
```
1. Click Upload Files
2. Select a file from your prepared files
3. Show "Encrypting..." progress
4. Show "Uploading to IPFS..." progress
5. Show "Syncing to blockchain..." (if ETH available)
6. File appears in list
```

**Viewing File (15 seconds):**
```
1. Click on uploaded file
2. Show download
3. Open file to show it works
4. Mention: "Decrypted locally in your browser"
```

**Creating Note (20 seconds):**
```
1. Click Notes tab
2. Click New Note
3. Type a sample note
4. Save note
5. Show it in list
```

**Getting ETH for Sync (60 seconds) - CRITICAL!**
```
1. Click Settings (gear icon)
2. Show wallet address
3. Click "Copy" button
4. Open faucet tab (already have this open)
5. Paste address
6. Submit request
7. Show confirmation
8. Switch back to app
9. Show status: "Gas: ✓" (green)
10. Mention: "Now blockchain sync works"

IF you already have test ETH:
1. Show how status already shows "Gas: ✓"
2. Explain: "I already got free test ETH from faucet"
3. Show the faucet in a separate tab for reference
```

**Cross-Device Sync Proof (30 seconds):**
```
IDEAL: Show on phone too
1. Open app on phone (or different browser)
2. Clock "Use Recovery Phrase"
3. Enter recovery phrase
4. Show files syncing
5. Files appear!

IF you can't show cross-device:
1. Explain: "Your recovery phrase recreates your vault on any device"
2. "Blockchain syncs your file list"
3. "Files download and decrypt automatically"
```

**What Makes Us Different (45 seconds):**
```
While showing features, narrate:
"Our server can NEVER see your files"
"Files are encrypted BEFORE upload"
"Recovery phrase works like crypto wallet backup"
"Works offline too"
"Even if we shut down, you keep everything"
```

**Closing (15 seconds):**
```
"OwnNet Vault - Your data, your control"
"Try it now at ownnet-vault.vercel.app"
"Thank you!"
```

### Key Points to Emphasize

**MUST SHOW:**
1. ✓ File encryption in progress
2. ✓ Files appearing in dashboard
3. ✓ Download and view file
4. ✓ Recovery phrase generation
5. ✓ Getting test ETH (or explaining it)
6. ✓ Status indicators showing connections

**MUST SAY:**
1. "Client-side encryption - we never see your data"
2. "Recovery phrase for cross-device access"
3. "Files on IPFS, not our servers"
4. "Blockchain sync is optional"
5. "Works without blockchain for core features"
6. "Free test ETH for testing"

### Common Recording Mistakes to Avoid

**DON'T:**
- ✗ Rush through steps (speak slowly)
- ✗ Mumble or speak too quietly
- ✗ Skip showing ETH acquisition
- ✗ Forget to verify status indicators
- ✗ Show empty vault (have files ready)
- ✗ Skip showing recovery phrase
- ✗ Upload at the last minute (files still uploading)
- ✗ Record with messy desktop background
- ✗ Use complicated crypto jargon

**DO:**
- ✓ Speak clearly and confidently
- ✓ Show each step deliberately
- ✓ Pause at key features
- ✓ Mention privacy/security repeatedly
- ✓ Explain WHY each feature matters
- ✓ Show working demo (not broken features)
- ✓ Have backup plan if something fails
- ✓ Test your recording software first
- ✓ Record in a quiet environment
- ✓ Smile and be enthusiastic

### Recording Quality Checklist

- [ ] 1080p minimum resolution
- [ ] Clear audio (no background noise)
- [ ] Good lighting (if showing face)
- [ ] Smooth mouse movements
- [ ] Readable text (not too small)
- [ ] No personal information visible
- [ ] Demo works end-to-end
- [ ] Status indicators showing green
- [ ] Files already uploaded
- [ ] Test ETH already obtained
- [ ] Recovery phrase ready to show

### After Recording

**1. Review Your Video**
```
□ Watch the entire video
□ Check audio quality
□ Verify all captions are readable
□ Ensure key points are mentioned
□ Keep it under 6 minutes
```

**2. Upload**
```
□ YouTube: Set to "Unlisted" (not private)
□ Loom: Copy public link
□ Test the link works (open in incognito)
```

**3. Add to Submission**
```
□ Copy video URL
□ Paste in ETHOnline submission form
□ Preview to ensure it plays
```

---

## 📞 Need Help?

If you're stuck during submission:

1. Check the ETHOnline Discord for announcements
2. Review tracks and requirements at ethonline.org
3. Make sure all links are publicly accessible
4. Test your demo before final submission
5. Have backup screenshots ready

---

**Good luck! You've built something great! 🚀**