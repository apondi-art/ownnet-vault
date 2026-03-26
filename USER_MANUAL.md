# OwnNet Vault - User Manual

> A privacy-first data vault with client-side encryption and optional blockchain verification

---

## Table of Contents

1. [What is OwnNet Vault?](#what-is-ownnet-vault)
2. [Quick Start](#quick-start)
3. [Detailed Usage Guide](#detailed-usage-guide)
4. [MetaMask Integration (Optional)](#metamask-integration-optional)
5. [Security Information](#security-information)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## What is OwnNet Vault?

OwnNet Vault is a **secure file storage application** where only **YOU** can access your data.

### Key Features

| Feature | Description |
|---------|-------------|
| **Client-Side Encryption** | Your files are encrypted in your browser BEFORE being saved |
| **Password-Protected** | Only your password can decrypt your data |
| **Local Storage** | Files are stored in your browser (no server needed) |
| **Optional Blockchain** | Prove file ownership on Ethereum (requires MetaMask) |
| **Works Offline** | No internet connection required for basic usage |

### In One Sentence

**It's like a password-protected folder in your browser where files are scrambled so no one (not even us) can read them.**

---

## Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js 18+ (for running locally)
- MetaMask extension (optional, for blockchain features)

### Installation

```bash
# 1. Navigate to project directory
cd web3/ownnet-vault

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:3000
```

### First Time Setup (30 seconds)

1. Open the app in your browser
2. Enter a **strong password** (8+ characters, mixed case, numbers, symbols)
3. Click **"Create Vault"**
4. You're ready to use the vault!

---

## Detailed Usage Guide

### Step 1: Creating Your Vault

When you first open OwnNet Vault, you'll see a setup screen.

```
┌─────────────────────────────────────────────────────┐
│           Create Your Vault Password                │
│                                                     │
│  Master Password: [________________]               │
│  Strength: ████████░░░░░░ medium                   │
│                                                     │
│  Confirm Password: [________________]              │
│                                                     │
│  [        Create Vault        ]                    │
│                                                     │
│  ⚠️ This password encrypts all your data.          │
│     We cannot recover it if lost!                  │
└─────────────────────────────────────────────────────┘
```

**Password Requirements:**
- Minimum 8 characters
- Mix of uppercase and lowercase recommended
- Include numbers and special characters for better security
- **NEVER forget this password** - there is no recovery!

**What Happens:**
1. Your password is converted to an AES-256 encryption key
2. A hash of your password is stored (for verification only)
3. The vault unlocks and you can upload files

---

### Step 2: Unlocking Your Vault (Returning Users)

If you've already created a vault, you'll see the unlock screen.

```
┌─────────────────────────────────────────────────────┐
│            🔐 Unlock Your Vault                     │
│                                                     │
│  Master Password: [________________]               │
│                                                     │
│  [        Unlock Vault        ]                    │
│                                                     │
│  [ Create New Vault (Warning: deletes all data) ]  │
└─────────────────────────────────────────────────────┘
```

**What Happens:**
1. Enter your password
2. System compares with stored password hash
3. If correct, vault unlocks
4. If incorrect, you get an error message

---

### Step 3: Uploading Files

Once unlocked, you'll see the main vault interface.

```
┌─────────────────────────────────────────────────────┐
│  [📁 Files]  [📝 Notes]                            │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │                                               │ │
│  │        📤 Drag & drop or click               │ │
│  │           to upload a file                    │ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Selected: my_document.pdf (1.2 MB)               │
│  [    🔐 Encrypt & Upload    ]                    │
└─────────────────────────────────────────────────────┘
```

**How Encryption Works:**

```
┌────────────────────────────────────────────────────────┐
│ YOUR FILE(my_document.pdf)                             │
│          ↓                                              │
│ ┌────────────────────────────────────────────┐        │
│ │   BROWSER (Your Computer)                   │        │
│ │                                             │        │
│ │   1. Password → PBKDF2 → AES-256 Key      │        │
│ │   2. Generate random IV                    │        │
│ │   3. Encrypt file with AES-256-GCM        │        │
│ │   4. Combine IV + Encrypted Data          │        │
│ │                                             │        │
│ └────────────────────────────────────────────┘        │
│          ↓                                              │
│ ENCRYPTED FILE (unreadable gibberish)                  │
│          ↓                                              │
│ ┌────────────────────────────────────────────┐        │
│ │ localStorage (Your Browser)                 │        │
│ │                                             │        │
│ │   Encrypted file stored here               │        │
│ │   Only YOU can decrypt with password        │        │
│ │                                             │        │
│ └────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

**Steps:**
1. Click the upload zone or drag & drop a file
2. File preview appears with size and type
3. Click **"🔐 Encrypt & Upload"**
4. File is encrypted and stored in your browser
5. File appears in the list below

---

### Step 4: Viewing Your Files

```
┌─────────────────────────────────────────────────────┐
│  📚 Your Files (3)                                  │
│                                                     │
│  📄 my_document.pdf  [🔐 Encrypted]                │
│     1.2 MB • Jan 15, 2025 10:30 AM                 │
│     [⬇️ Download] [🗑️ Delete]                      │
│                                                     │
│  📝 notes.txt  [🔐 Encrypted]                      │
│     512 B • Jan 14, 2025 3:45 PM                   │
│     [⬇️ Download] [🗑️ Delete]                      │
│                                                     │
│  🖼️ photo.png  [🔐 Encrypted]                      │
│     2.5 MB • Jan 12, 2025 9:15 AM                  │
│     [⬇️ Download] [🗑️ Delete]                      │
└─────────────────────────────────────────────────────┘
```

**File Actions:**
| Button | Action |
|--------|--------|
| **⬇️ Download** | Decrypts and downloads the original file |
| **🗑️ Delete** | Permanently removes the file (asks for confirmation) |

---

### Step 5: Creating Encrypted Notes

Switch to the **Notes** tab to create text notes.

```
┌─────────────────────────────────────────────────────┐
│  [📁 Files]  [📝 Notes]  ←─ Click Notes tab         │
│                                                     │
│  Note Title: [________________________]            │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │                                               │ │
│  │  Write your secret note here...               │ │
│  │  Everything is encrypted locally              │ │
│  │  before saving.                               │ │
│  │                                               │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  85 characters                          [💾 Save]  │
└─────────────────────────────────────────────────────┘
```

**Steps:**
1. Enter a title (optional)
2. Write your note in the text area
3. Click **"💾 Save Encrypted Note"**
4. Note is encrypted and appears in your Files list

---

### Step 6: Locking Your Vault

For security, you can lock your vault when stepping away.

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     [📁 Files]  [📝 Notes]                          │
│                                                     │
│     ... your files ...                              │
│                                                     │
│                                                     │
│          [ 🔒 Lock Vault ]                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**What Happens:**
1. Password is cleared from memory
2. You're returned to the unlock screen
3. Must re-enter password to access files again

---

### Theme Toggle

Click the 🌙/☀️ button in the header to switch between light and dark mode.

```
┌─────────────────────────────────────────────────────┐
│  🔐 OwnNet Vault                    [🌙] [🦊 Connect]│
└─────────────────────────────────────────────────────┘
```

---

## MetaMask Integration (Optional)

### What is MetaMask?

MetaMask is a browser extension that lets you interact with Ethereum blockchain. It's **completely optional** for OwnNet Vault.

### Do You Need It?

| Use Case | MetaMask Required? |
|----------|---------------------|
| Store encrypted files locally | ❌ NO |
| Download your files | ❌ NO |
| Create encrypted notes | ❌ NO |
| Prove file ownership on blockchain | ✅ YES |
| Get immutable timestamp proof | ✅ YES |

### Why Use MetaMask?

If you connect MetaMask, every file you upload gets recorded on the blockchain with:
- Your wallet address
- The file's encrypted hash
- A timestamp

This creates **undeniable proof** that you owned this file at a specific time.

**Use Cases:**
- Patent filings
- Copyright proof
- Legal disputes
- Audit trails
- Intellectual property protection

### How to Connect MetaMask

#### 1. Install MetaMask Extension

```
1. Go to https://metamask.io/
2. Click "Download"
3. Install for your browser (Chrome, Firefox, Edge, Brave)
4. Create a new wallet or import existing one
5. Save your seed phrase securely!
```

#### 2. Get Test ETH (Sepolia Testnet)

OwnNet Vault uses Sepolia testnet (free ETH for testing).

```
1. Open MetaMask
2. Click network dropdown
3. Select "Sepolia" (or add it if not visible)
4. Go to https://sepoliafaucet.com/
5. Enter your wallet address
6. Receive free test ETH
```

#### 3. Deploy Smart Contract (One-time setup)

```bash
# Using Remix IDE (easiest method)

1. Go to https://remix.ethereum.org/
2. Create new file: DataVault.sol
3. Copy content from contracts/DataVault.sol
4. Compile with Solidity 0.8.19+
5. Deploy to Sepolia via MetaMask
6. Copy contract address
7. Update CONTRACT_ADDRESS in src/utils/web3.js
```

#### 4. Connect in App

```
┌─────────────────────────────────────────────────────┐
│  🔐 OwnNet Vault                    [🌙] [🦊 Connect]│
│                                          ↑         │
│                                   Click this button │
└─────────────────────────────────────────────────────┘

↓ MetaMask popup appears

┌─────────────────────────────────────────────────────┐
│  MetaMask                                           │
│                                                     │
│  Connect to OwnNet Vault?                           │
│                                                     │
│  This site is requesting access to:                │
│  • View your wallet address                        │
│  • Request transaction signatures                 │
│                                                     │
│  [Cancel]  [Connect]                               │
└─────────────────────────────────────────────────────┘

↓ After connecting

┌─────────────────────────────────────────────────────┐
│  🔐 OwnNet Vault        [🌙] [0x1234...5678] 1.5 ETH│
│                              ↑ Connected!           │
└─────────────────────────────────────────────────────┘
```

### What Gets Recorded on Blockchain?

When you upload a file with MetaMask connected:

```javascript
// Smart Contract Function (DataVault.sol)
function addFile(string memory _ipfsHash) external {
    userFiles[msg.sender].push(FileRecord({
        ipfsHash: _ipfsHash,    // Your file's encrypted hash
        timestamp: block.timestamp, // When you uploaded
        exists: true
    }));
}
```

**On Blockchain:**
```
┌──────────────────────────────────────────────────────┐
│ Transaction Record                                    │
│                                                       │
│ • From: 0xYourWalletAddress                          │
│ • File Hash: QmX4F... (encrypted file identifier)    │
│ • Timestamp: 1673849234 (Unix time)                  │
│ • Block Number: 12345678                             │
│                                                       │
│ This is PERMANENT and PUBLIC (but only the hash,    │
│ not your actual file content)                        │
└──────────────────────────────────────────────────────┘
```

### Security Note for MetaMask

⚠️ **What IS public:**
- Your wallet address
- The encrypted file hash
- The timestamp

⚠️ **What stays PRIVATE:**
- Your file content (encrypted)
- Your encryption password
- The actual file data

---

## Security Information

### How Security Works

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Layer 1: Password                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • User provides password                              │   │
│  │ • Password NEVER stored (only hash for verification)│   │
│  │ • Password NEVER sent to server                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  Layer 2: Key Derivation (PBKDF2)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Password → PBKDF2 (100,000 iterations)            │   │
│  │ • Salt added (ownnet-vault-salt)                    │   │
│  │ • Output: AES-256 encryption key                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  Layer 3: Encryption (AES-256-GCM)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • Random IV (initialization vector) generated      │   │
│  │ • File content encrypted with AES-256-GCM          │   │
│  │ • IV + Encrypted data combined                      │   │
│  │ • Result stored in localStorage                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technical Details

| Component | Algorithm | Details |
|-----------|-----------|---------|
| Key Derivation | PBKDF2-SHA256 |100,000 iterations with salt |
| Encryption | AES-256-GCM | Authenticated encryption |
| IV Size | 96 bits | Random for each file |
| Key Size | 256 bits | Derived from password |

### Password Storage

```
⚠️ IMPORTANT SECURITY NOTES:

┌─────────────────────────────────────────────────────────────┐
│ What's stored: base64(password)                            │
│ Why: Only for verification that you know the password     │
│ Security: LOW - base64 is NOT encryption                  │
│                                                             │
│ For production use:                                        │
│ • Should use proper password hashing (bcrypt, argon2)    │
│ • Or use key derivation directly without storing          │
└─────────────────────────────────────────────────────────────┘
```

### Data Storage

```
Where your files are stored:

┌─────────────────────────────────────────────────────────────┐
│ localStorage (Browser Storage)                              │
│                                                             │
│ • Key: "ownnet-vault-password"                             │
│   Value: base64 encoded password (for verification)        │
│                                                             │
│ • Key: "ownnet-vault-files"                                │
│   Value: JSON array of file metadata                       │
│                                                             │
│ • Key: "file-{timestamp}"                                   │
│   Value: Encrypted file data (base64)                      │
│                                                             │
│ • Key: "vault-{timestamp}"                                  │
│   Value: Encrypted notes (base64)                          │
└─────────────────────────────────────────────────────────────┘

⚠️ Clearing browser data = ALL FILES LOST
⚠️ Different browser = FILES NOT ACCESSIBLE
```

### What We Can and Cannot Do

| Can Do | Cannot Do |
|--------|-----------|
| Store your encrypted files | Read your files |
| Verify you know the password | Recover your password |
| Provide blockchain timestamp | Decrypt your data |
| Save data to browser | Access your data on different devices |

---

## Troubleshooting

### Common Issues

#### "Incorrect password" but I'm sure it's right

```
Possible causes:
1. Caps Lock is on
2. Password has special characters you forgot
3. Browser data was cleared
4. Using different browser

Solution:
• Try again carefully
• If data was cleared, you'll need to create a new vault
```

#### "Failed to encrypt and upload file"

```
Possible causes:
1. File is too large (browser storage limit)
2. Browser storage is full
3. JavaScript error

Solution:
• Try a smaller file
• Clear old files to free space
• Check browser console for errors (F12 → Console)
```

#### "Please install MetaMask"

```
You see this when trying to use blockchain features without MetaMask.

Solutions:
1. Install MetaMask extension: https://metamask.io/
2. Or skip blockchain features (not required for basic usage)
```

#### Files disappeared after browser update

```
Possible causes:
1. Browser cleared localStorage
2. You're in incognito/private mode
3. Different browser profile

Solutions:
• Regular backups recommended
• Export important files periodically
• Consider IPFS storage for persistence
```

#### "Create New Vault" warning

```
⚠️ WARNING:

Clicking "Create New Vault" when you already have data:

• ALL existing files will be DELETED
• Password will be reset
• This action is IRREVERSIBLE

Only use this if:
• You forgot your password
• You want to start fresh
• You've backed up your files elsewhere
```

---

## FAQ

### General Questions

**Q: Is my data saved on a server somewhere?**

A: **No.** All data is stored in your browser's localStorage. Nothing is sent to any server (except optional blockchain transactions).

**Q: Can you see my files?**

A: **No.** Files are encrypted in your browser before storage. Without your password, the data is unreadable.

**Q: What happens if I forget my password?**

A: **Your data is permanently lost.** There is no password recovery mechanism. This is a security feature - even we cannot access your data.

**Q: Can I use this on multiple devices?**

A: **No.** Each browser/device has its own separate storage. Files are not synced across devices.

**Q: Is it safe for sensitive data?**

A: This is a **demo/educational project**. While the encryption is strong, the implementation is not audited for production use. For truly sensitive data, use established tools like Veracrypt, 1Password, or Bitwarden.

### Blockchain Questions

**Q: Do I need MetaMask?**

A: **No.** MetaMask is completely optional. The basic vault features work without it.

**Q: What's the difference between local and blockchain storage?**

A:
- **Local:** Files stored in browser, accessible only from that browser
- **Blockchain:** File hash recorded on Ethereum, proves you owned the file at a specific time

**Q: Does blockchain store my files?**

A: **No.** Only the encrypted file hash is stored on blockchain. Your actual files remain in your browser.

**Q: Are blockchain transactions free?**

A: **No.** Each blockchain transaction costs ETH (gas fees). For Sepolia testnet, you can get free test ETH from faucets.

**Q: Can anyone see my files on blockchain?**

A: They can see:
- Your wallet address
- The file hash
- The timestamp

They CANNOT see:
- Your file content
- Your encryption password
- Any readable data

### Technical Questions

**Q: What encryption algorithm is used?**

A: AES-256-GCM with PBKDF2 key derivation (100,000 iterations).

**Q: Where is the encryption key stored?**

A: It isn't stored anywhere. The key is derived from your password each time you unlock the vault.

**Q: CanI export my encrypted files?**

A: Not currently implemented. You would need to manually export from localStorage.

**Q: Is there a file size limit?**

A: Limited by browser localStorage (typically 5-10 MB total). Large files are not recommended.

---

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

### Project Structure

```
ownnet-vault/
├── contracts/
│   └── DataVault.sol      # Smart contract
├── src/
│   ├── components/        # React components
│   │   ├── FileList.jsx
│   │   ├── FileUpload.jsx
│   │   ├── NoteEditor.jsx
│   │   ├── SetupModal.jsx
│   │   ├── StatusBar.jsx
│   │   ├── VaultUnlockModal.jsx
│   │   └── WalletConnect.jsx
│   ├── hooks/
│   │   └── useTheme.js    # Theme toggle hook
│   ├── utils/
│   │   ├── encryption.js  # Web Crypto API functions
│   │   ├── ipfs.js        # Storage functions
│   │   └── web3.js        # Blockchain functions
│   ├── App.jsx            # Main application
│   ├── main.jsx           # Entry point
│   └── index.css          # Tailwind styles
├── public/
│   └── vault.svg          # App icon
├── tests/                 # Unit tests
├── package.json
├── vite.config.js
└── README.md
```

---

## Support

Ifyou encounter any issues:

1. **Check browser console** (F12 → Console) for error messages
2. **Try clearing browser cache** and localStorage
3. **Ensure you're using a modern browser** (Chrome, Firefox, Edge, Safari)
4. **For blockchain issues:** Verify MetaMask is installed and unlocked

---

## License

MIT License - See LICENSE file for details.

---

**Built with ❤️ for a user-owned internet.**