# OwnNet Vault - User Manual

> A privacy-first data vault with client-side encryption and blockchain-verified cross-device sync

---

## Table of Contents

1. [What is OwnNet Vault?](#what-is-ownnet-vault)
2. [Quick Start](#quick-start)
3. [Detailed Usage Guide](#detailed-usage-guide)
4. [MetaMask Integration](#metamask-integration)
5. [Cross-Device Sync](#cross-device-sync)
6. [Security Information](#security-information)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## What is OwnNet Vault?

OwnNet Vault is a **secure file storage application** where only **YOU** can access your data, with **automatic blockchain sync** for cross-device access.

### Key Features

| Feature | Description |
|---------|-------------|
| **Client-Side Encryption** | Files are encrypted in your browser BEFORE being saved |
| **Password-Protected** | Only your password can decrypt your data |
| **IPFS Storage** | Files stored on decentralized IPFS (not local browser) |
| **Auto Blockchain Sync** | Wallet auto-created for cross-device sync (no MetaMask needed) |
| **Recovery Phrase** | 12-word backup to restore access from any device |
| **Cross-Device Access** | Access your files from any device with password/phrase |

### In One Sentence

**Your files are encrypted, stored on IPFS, and syncable across devices automatically - no crypto knowledge required.**

---

## How Cross-Device Sync Works (Simplified)

```
┌─────────────────────────────────────────────────────────────────┐
│                    NO METAMASK NEEDED                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  WHEN YOU CREATE A VAULT:                                       │
│  ─────────────────────────                                       │
│  1. You enter password                                          │
│  2. App AUTOMATICALLY creates a wallet for you                  │
│  3. Wallet is encrypted with your password                      │
│  4. You don't see, manage, or worry about it                    │
│                                                                 │
│  WHEN YOU LOGIN FROM ANOTHER DEVICE:                           │
│  ─────────────────────────────────────                          │
│  1. Enter your password OR recovery phrase                     │
│  2. App restores your wallet automatically                       │
│  3. Files sync from blockchain                                  │
│  4. Everything just works!                                      │
│                                                                 │
│  WHAT YOU SEE:                                                  │
│  ─────────────                                                  │
│  ✓ Password prompt                                              │
│  ✓ Recovery phrase backup                                       │
│  ✓ Your files                                                   │
│                                                                 │
│  WHAT YOU DON'T SEE (HIDDEN):                                   │
│  ────────────────────────────────                                │
│  • Private keys                                                  │
│  • Wallet addresses                                             │
│  • Blockchain transactions                                      │
│  • Crypto terminology                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js 18+ (for running locally)
- MetaMask extension (optional, for cross-device sync)

### Installation

```bash
# 1. Navigate to project directory
cd web3/ownnet-vault

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and add your Pinata JWT

# 4. Start development server
npm run dev

# 5. Open browser to http://localhost:3000
```

### First Time Setup (2 minutes)

1. Open the app in your browser
2. Enter a **strong password** (12+ characters recommended)
3. **Write down your 12-word recovery phrase**
4. Verify your recovery phrase
5. You're ready to use the vault!

---

## Detailed Usage Guide

### Step 1: Creating Your Vault

When you first open OwnNet Vault, you'll see a setup screen.

```
┌─────────────────────────────────────────────────────────────┐
│              Create Your Vault Password                      │
│                                                             │
│  Master Password: [____________________________]            │
│  Strength: ████████████░░░░ strong                         │
│                                                             │
│  Confirm Password: [____________________________]          │
│                                                             │
│  [              Continue            ]                        │
│                                                             │
│  ⚠️ This password encrypts all your data.                  │
│     Keep it safe - we cannot recover it!                    │
└─────────────────────────────────────────────────────────────┘
```

**Password Requirements:**
- Minimum 8 characters (12+ recommended)
- Mix of uppercase and lowercase
- Include numbers and special characters
- **Write it down securely!**

---

### Step 2: Recovery Phrase Setup

After setting your password, you'll receive a 12-word recovery phrase.

```
┌─────────────────────────────────────────────────────────────┐
│                   Recovery Phrase                           │
│                                                             │
│  Write down these 12 words. You'll need them if you        │
│  forget your password or want to access from another       │
│  device.                                                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. apple    2. banana   3. cherry   4. date        │   │
│  │ 5. elder    6. fig      7. grape    8. honey        │   │
│  │ 9. ice      10. juice   11. kiwi    12. lemon      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [📋 Copy to Clipboard]                                      │
│                                                             │
│  ⚠️ IMPORTANT: Store this phrase safely!                    │
│     If you lose both your password AND this phrase,        │
│     your data cannot be recovered.                          │
│                                                             │
│  [         I've Written It Down          ]                   │
└─────────────────────────────────────────────────────────────┘
```

**Why Recovery Phrase?**
- Access your files from any device
- Restore access if you forget your password
- One of two backup methods (password + phrase)

---

### Step 3: Unlocking Your Vault

When returning to the app:

```
┌─────────────────────────────────────────────────────────────┐
│                    🔐 Vault is Locked                        │
│                                                             │
│  Your files are encrypted and secure. Unlock to access them.│
│                                                             │
│  Master Password: [____________________________]            │
│                                                             │
│  [          🔓 Unlock Vault           ]                      │
│                                                             │
│  ───────────────── or ─────────────────                     │
│                                                             │
│  Use recovery phrase instead                                │
│                                                             │
│  Don't have a vault? Create new vault (deletes all data)   │
└─────────────────────────────────────────────────────────────┘
```

**Two Ways to Unlock:**
1. **Password** - For quick access on thesame device
2. **Recovery Phrase** - For cross-device access or password recovery

---

### Step 4: Uploading Files

```
┌─────────────────────────────────────────────────────────────┐
│  [📁 Files]  [📝 Notes]                                      │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                         │ │
│  │        📤 Drag & drop or click to upload               │ │
│  │                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  Selected: my_document.pdf (1.2 MB)                        │
│                                                             │
│  [         🔐 Encrypt & Upload to IPFS         ]            │
│                                                             │
│  Status: Uploading to IPFS... ████████░░ 80%               │
└─────────────────────────────────────────────────────────────┘
```

**What Happens:**

```
┌────────────────────────────────────────────────────────────────┐
│ YOUR FILE (my_document.pdf)                                    │
│         ↓                                                      │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │   BROWSER (Your Computer)                                  │ │
│ │                                                            │ │
│ │   1. Password → PBKDF2 → AES-256 Key                      │ │
│ │   2. Generate random IV                                    │ │
│ │   3. Encrypt file content                                  │ │
│ │   4. Upload encrypted data to IPFS                         │ │
│ │                                                            │ │
│ └────────────────────────────────────────────────────────────┘ │
│         ↓                                                      │
│ IPFS HASH (QmX4F...)                                          │
│         ↓                                                      │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │   MANIFEST UPDATE                                          │ │
│ │                                                            │ │
│ │   1. Add file metadata to manifest                         │ │
│ │   2. Encrypt manifest                                      │ │
│ │   3. Upload manifest to IPFS                               │ │
│ │   4. If wallet connected: sync CID to blockchain           │ │
│ │                                                            │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

### Step 5: Viewing Your Files

```
┌─────────────────────────────────────────────────────────────┐
│  📚 Your Files (3)                      Vault ID: abc12345  │
│                                                             │
│  📄 my_document.pdf  [🌐 IPFS] [🔐 Encrypted]              │
│     1.2 MB • Jan 15, 2025 10:30 AM                         │
│     [⬇️ Download] [🗑️ Delete]                               │
│                                                             │
│  📝 notes.txt  [🌐 IPFS] [🔐 Encrypted]                     │
│     512 B • Jan 14, 2025 3:45 PM                            │
│     [⬇️ Download] [🗑️ Delete]                               │
│                                                             │
│  🖼️ photo.png  [🌐 IPFS] [🔐 Encrypted]                     │
│     2.5 MB • Jan 12, 2025 9:15 AM                           │
│     [⬇️ Download] [🗑️ Delete]                               │
│                                                             │
│  Status:                                                    │
│  ✓ Encryption: Ready                                         │
│  ○ Wallet: Not Connected                                     │
│  ✓ Storage: IPFS (Pinata)                                    │
└─────────────────────────────────────────────────────────────┘
```

**File Status Indicators:**

| Indicator | Meaning |
|-----------|---------|
| 🌐 IPFS | File stored on IPFS (accessible anywhere) |
| 🔐 Encrypted | File is encrypted with your password |
| ✓ Syncing... | Manifest is being synced to IPFS |
| 📱 Wallet | Wallet connected (enables cross-device sync) |

---

### Step 6: Connecting Wallet (For Cross-Device Sync)

```
┌─────────────────────────────────────────────────────────────┐
│  🔐 OwnNet Vault                    [🌙] [🦊 Connect Wallet] │
└─────────────────────────────────────────────────────────────┘

↓ After clicking "Connect Wallet"

┌─────────────────────────────────────────────────────────────┐
│  MetaMask                                                   │
│                                                             │
│  Connect to OwnNet Vault?                                   │
│                                                             │
│  This site is requesting access to:                        │
│  • View your wallet address                                 │
│  • Request transaction signatures                          │
│                                                             │
│  [Cancel]                          [Connect]                 │
└─────────────────────────────────────────────────────────────┘

↓ After connecting

┌─────────────────────────────────────────────────────────────┐
│  🔐 OwnNet Vault        [🌙] [0x1234...5678] 1.5 ETH         │
│                              Connected!                      │
│                                                             │
│  Status:                                                    │
│  ✓ Encryption: Ready                                        │
│  ✓ Wallet: 0x1234...5678                                     │
│  ✓ Storage: IPFS (Pinata)                                    │
│                                                             │
│  💡 Connect wallet on any device to sync your files!        │
└─────────────────────────────────────────────────────────────┘
```

---

### Step 7: Accessing Files on Another Device

```
┌─────────────────────────────────────────────────────────────┐
│              🔐 Vault is Locked                              │
│                                                             │
│  Option 1: Use Password                                     │
│  ─────────────────────                                      │
│  This only works if you've used this device before.         │
│  Password verification is stored in localStorage.           │
│                                                             │
│  Option 2: Use Recovery Phrase (Recommended)                │
│  ─────────────────────────────────                            │
│  Works from any device! Enter your 12-word phrase.         │
│                                                             │
│  Option 3: Connect Wallet + Recovery Phrase                 │
│  ─────────────────────────────────                            │
│  Most secure method:                                        │
│  1. Connect wallet to fetch manifest CID from blockchain    │
│  2. Download manifest from IPFS                             │
│  3. Decrypt with recovery phrase                            │
│  4. Access all your files!                                  │
│                                                             │
│  Master Password: [____________________________]            │
│                                                             │
│  [          🔓 Unlock Vault           ]                      │
│                                                             │
│  [ Use recovery phrase instead ]                             │
└─────────────────────────────────────────────────────────────┘
```

---

## MetaMask Integration

### Do You Need It?

| Use Case | MetaMask Required? |
|----------|---------------------|
| Store encrypted files on IPFS | ❌ NO |
| Download your files | ❌ NO |
| Create encrypted notes | ❌ NO |
| **Cross-device sync** | ✅ YES (recommended) |
| **Prove ownership on blockchain** | ✅ YES |

### Why Connect Wallet?

Connecting MetaMask enables:

1. **Cross-Device Access**
   - Your file list is stored on blockchain
   - Access from any device with wallet + password/phrase
   - No need to manually transfer files

2. **Ownership Proof**
   - Every file hash recorded on-chain
   - Immutable timestamp proof
   - Legal/copyright applications

### What Gets Stored on Blockchain?

```
On Blockchain (PUBLIC):
├── Your wallet address
├── Manifest CID (encrypted file list pointer)
└── Timestamp

NOT on Blockchain (PRIVATE):
├── Your file content
├── Your password
├── Your encryption key
├── Decrypted manifest
└── Any readable data
```

---

## Cross-Device Sync

### How It Works

```
DEVICE1 (Home Computer):
┌─────────────────────────────────────────────────────────┐
│ 1. Create vault with password + recovery phrase         │
│ 2. Upload file → Encrypted → IPFS                        │
│ 3. Manifest auto-updated with file metadata             │
│ 4. Encrypted manifest uploaded to IPFS                   │
│ 5. Manifest CID stored on blockchain (if wallet linked) │
│ 6. Vault ID stored in localStorage                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────┬────────────────────┬────────────────────┐
│   IPFS (Pinata)     │   Blockchain      │   localStorage    │
│   - File data       │   - Manifest CID  │   - Vault ID      │
│   - Manifest data   │   - Address link   │   - Password hash │
└────────────────────┴────────────────────┴────────────────────┘
                            │
                            ▼
DEVICE 2 (Work Computer):
┌─────────────────────────────────────────────────────────┐
│ Method 1: Recovery Phrase Only                          │
│ ────────────────────────────                             │
│ 1. Enter recovery phrase                                │
│ 2. Download manifest from localStorage backup           │
│ 3. Decrypt manifest                                      │
│ 4. Download files from IPFS using manifest              │
│ 5. Decrypt files with password derived from phrase      │
│                                                          │
│ Method 2: Wallet + Recovery Phrase (Recommended)        │
│ ──────────────────────────────────────────               │
│ 1. Connect MetaMask wallet                              │
│ 2. Smart contract returns your manifest CID             │
│ 3. Download manifest from IPFS                          │
│ 4. Enter recovery phrase to decrypt manifest           │
│ 5. Download files from IPFS using manifest              │
│ 6. Decrypt files with password                          │
└─────────────────────────────────────────────────────────┘
```

---

## Security Information

### Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Layer 1: Password                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ • User provides password                                  │  │
│  │ • SHA-256 hash stored for verification                   │  │
│  │ • Password NEVER sent anywhere                           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                          ↓                                      │
│  Layer 2: Key Derivation (PBKDF2)                              │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ • Password → PBKDF2 (150,000 iterations)                 │  │
│  │ • Salt: 'ownnet-vault-salt-v2'                           │  │
│  │ • Output: AES-256 encryption key                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                          ↓                                      │
│  Layer 3: Encryption (AES-256-GCM)                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ • Random IV (initialization vector) generated            │  │
│  │ • File content encrypted with AES-256-GCM                │  │
│  │ • IV + Encrypted data combined                            │  │
│  │ • Upload to IPFS                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
│                          ↓                                      │
│  Layer 4: Manifest Encryption                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ • File metadata stored in encrypted manifest             │  │
│  │ • Manifest encrypted with same key                       │  │
│  │ • Manifest CID on blockchain (with wallet)               │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Technical Details

| Component | Algorithm | Details |
|-----------|-----------|---------|
| Password Hash | SHA-256 | One-way hash for verification |
| Key Derivation | PBKDF2-SHA256 | 150,000 iterations with salt |
| Encryption | AES-256-GCM | Authenticated encryption |
| IV Size | 96 bits | Random for each file |
| Key Size | 256 bits | Derived from password |

---

## Troubleshooting

### Common Issues

#### "Incorrect password" but I'm sure it's right

```
Possible causes:
1. Caps Lock is on
2. Password has special characters you forgot
3. Using different device (try recovery phrase)

Solutions:
• Try again carefully
• Use recovery phrase instead
• If truly lost, create new vault (deletes all data)
```

#### Files not syncing across devices

```
Check:
1. Is MetaMask connected on both devices?
2. Are you using the same wallet address?
3. Is Pinata configured correctly?

Solution:
• Connect wallet on both devices
• Use recovery phrase to unlock on new device
• Files should sync automatically
```

#### "Failed to upload to IPFS"

```
Possible causes:
1. Pinata JWT not configured
2. Pinata API rate limit reached
3. File too large

Solutions:
• Check . env file has VITE_PINATA_JWT
• Check Pinata dashboard for usage
• Try smaller file
```

#### "Manifest sync failed"

```
This means your file list couldn't be synced to blockchain.

Check:
1. Is wallet connected?
2. Do you have ETH for gas?
3. Are you on Sepolia testnet?

Solutions:
• Files still work locally
• Manifest synced when wallet available
• Get test ETH from faucet
```

---

## FAQ

### General Questions

**Q: Where are my files stored?**

A: Your files are stored on **IPFS** (InterPlanetary File System) via Pinata. This is decentralized storage, meaning they're not on any single server and can be accessed from anywhere.

**Q: Can you see my files?**

A: **No.** Files are encrypted in your browser before upload. Without your password, the data is unreadable gibberish even if someone accesses IPFS.

**Q: What happens if I forget my password?**

A: Use your **12-word recovery phrase** to regain access. If you lose BOTH your password AND recovery phrase, your data is permanently lost.

**Q: Can I use this on multiple devices?**

A: **Yes!** Connect your MetaMask wallet on each device to sync your file list automatically. Or use your recovery phrase to access from any device.

### IPFS Questions

**Q: What is IPFS?**

A: IPFS (InterPlanetary File System) is a decentralized storage network. Files are stored across many computers worldwide, making them censorship-resistant and highly available.

**Q: What happens if Pinata shuts down?**

A: Your files remain on IPFS. You could use any IPFS gateway to access them using the CID (content identifier). The blockchain record of your manifest CID ensures you can always find it.

**Q: Is there a storage limit?**

A: Pinata free tier offers 1GB. Upgraded plans offer more storage.

### Blockchain Questions

**Q: Do I need MetaMask?**

A: **No.** Basic file storage works without MetaMask. However, connecting MetaMask enables cross-device sync.

**Q: What gets recorded on blockchain?**

A: Only your **manifest CID** (a hash pointing to your encrypted file list). The actual content of your files and your password are NEVER on blockchain.

**Q: Does it cost money?**

A: On Sepolia testnet, you can get free test ETH. On mainnet, each manifest update costs gas fees.

---

## Support

If you encounter any issues:

1. **Check browser console** (F12 → Console) for error messages
2. **Ensure Pinata JWT is configured** in `.env`
3. **Try recovery phrase** if password doesn't work
4. **Connect wallet** for cross-device sync issues

---

**Built with ❤️ for a user-owned internet.**