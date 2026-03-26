# OwnNet Vault🔐

> A privacy-first data vault with client-side encryption and blockchain-verified cross-device sync

## Overview

[Problem Statement](#problem-statement)
- [Solution](#solution)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Security](#security)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

## Problem Statement

Today, users rely on centralized platforms that can access and control their personal data:

- Companies can read, analyze, and sell user data
- Data breaches expose sensitive information
- Accounts can be banned or locked without warning
- Users have no real ownership of their digital assets
- Data is locked to a single device

## Solution

**OwnNet Vault** is a client-side encrypted data vault where only users hold the keys to their data:

- **Zero-knowledge**: We cannot read your data
- **True ownership**: You control your encryption keys
- **Cross-device sync**: Access your files from any device via blockchain
- **Decentralized storage**: Files stored on IPFS, not centralized servers

## Key Features

- 🔐 **Client-Side Encryption**: All data is encrypted in your browser using AES-256-GCM
- 🔑 **Password-Derived Keys**: Your password generates the encryption key
- 📁 **Secure File Storage**: Upload and encrypt any file type
- 📝 **Encrypted Notes**: Save sensitive text notes
- 🌐 **IPFS Storage**: Files stored on decentralized IPFS via Pinata
- 📋 **Manifest System**: Encrypted file list synced across devices
- ⛓️ **Auto Blockchain Sync**: Wallet created automatically (no MetaMask needed)
- 🔒 **Recovery Phrase**: 12-word backup for cross-device access
- 🚫 **No MetaMask Required**: Works for non-crypto users

## How Cross-Device Sync Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEVICE 1                                  │
│  ┌──────────┐    ┌───────────┐    ┌──────────────────────┐      │
│  │  Upload  │───▶│ Encrypt   │───▶│ Upload to IPFS       │      │
│  │  File    │    │ (AES-256) │    │                      │      │
│  └──────────┘    └───────────┘    └──────────────────────┘      │
│                                            │                      │
│                                            ▼                      │
│                               ┌─────────────────────┐              │
│                               │ Encrypted Manifest  │              │
│                               │ (File List)         │              │
│                               └─────────────────────┘              │
│                                            │                      │
│                                            ▼                      │
│                      ┌──────────────────────────────────────┐    │
│                      │ Blockchain (Auto-created wallet)     │    │
│                      │ Address: 0x... (Hidden from user)    │    │
│                      │ Manifest CID stored here            │    │
│                      └──────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                             │
                    ┌────────────────────────┴────────────────────────┐
                    │                                                 │
                    ▼                                                 ▼
            ┌───────────────┐                                ┌───────────────┐
            │   IPFS (Pinata)│                                │  Any Device   │
            │   - Files      │                                │               │
            │   - Manifest   │                                │  Login with   │
            └───────────────┘                                │  Password OR  │
                                                               │  Recovery     │
                                                               │  Phrase       │
                                                               └───────────────┘
                                                                        │
                                                                        ▼
                                                            ┌───────────────────────┐
                                                            │ All files restored!   │
                                                            │ - Auto wallet restore │
                                                            │ - Manifest synced     │
                                                            │ - Files decrypted     │
                                                            └───────────────────────┘
```

### Non-Crypto User Experience

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER EXPERIENCE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SIGNUP:                                                        │
│  ─────────────────────────────────────                          │
│  1. Enter password ✓                                           │
│  2. Write down recovery phrase ✓                               │
│  3. Done! Upload files                                          │
│                                                                 │
│  LOGIN (SAME DEVICE):                                           │
│  ─────────────────────────                                        │
│  1. Enter password ✓                                           │
│  2. Files automatically restored ✓                             │
│                                                                 │
│  LOGIN (NEW DEVICE):                                            │
│  ─────────────────────────                                       │
│  1. Enter recovery phrase ✓                                     │
│  2. Wallet auto-restored ✓                                      │
│  3. Files synced from blockchain ✓                              │
│  4. All files available! ✓                                     │
│                                                                 │
│  WHAT USER SEES:   Password prompt, files                       │
│  WHAT USER DOESN'T SEE: Wallet, keys, blockchain, crypto       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + Vite |
| Encryption | Web Crypto API (AES-256-GCM) |
| Storage | IPFS (Pinata) + localStorage |
| Manifest | Encrypted JSON on IPFS |
| Blockchain | Ethereum (Solidity) |
| Wallet | MetaMask |

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git**
   - Download from: https://git-scm.org/

### For Production Features

4. **Pinata Account** (free tier available)
   - Sign up at: https://app.pinata.cloud/
   - Create API key for IPFS storage

5. **MetaMask Browser Extension** (for cross-device sync)
   - Download from: https://metamask.io/

6. **Test ETH** (for Sepolia testnet)
   - Get free test ETH from: https://sepoliafaucet.com/

## Installation

### Step 1: Clone or Navigate

```bash
cd web3/ownnet-vault
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Required for IPFS storage
VITE_PINATA_JWT=your_pinata_jwt_token_here

# Optional: Custom Pinata gateway
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Optional: Smart contract address (for blockchain sync)
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Smart Contract Deployment

### Using Remix IDE (Recommended)

1. Open https://remix.ethereum.org/
2. Create new file: `DataVault.sol`
3. Copy content from `contracts/DataVault.sol`
4. Compile with Solidity 0.8.19+
5. Deploy to Sepolia testnet:
   - Environment: Injected Provider - MetaMask
   - Ensure MetaMask connected to Sepolia
   - Click Deploy
   - Confirm transaction
6. Copy deployed contract address
7. Add to `.env`: `VITE_CONTRACT_ADDRESS=0x...`

### Smart Contract Functions

| Function | Description |
|----------|-------------|
| `updateManifest(cid)` | Store manifest CID on blockchain |
| `getManifestCID(address)` | Retrieve user's manifest CID |
| `hasVault(address)` | Check if user has a vault |
| `addFile(hash)` | Register file hash |
| `getUserFiles()` | Get all user files |

## Project Structure

```
ownnet-vault/
├── contracts/
│   └── DataVault.sol           # Smart contract with manifest support
├── public/
│   └── vault.svg               # App icon
├── src/
│   ├── components/
│   │   ├── FileList.jsx        # File list display
│   │   ├── FileUpload.jsx      # File upload interface
│   │   ├── NoteEditor.jsx      # Note creation
│   │   ├── SetupModal.jsx      # Initial setup
│   │   ├── StatusBar.jsx       # Status indicators
│   │   ├── VaultUnlockModal.jsx # Unlock screen
│   │   └── WalletConnect.jsx   # Wallet connection
│   ├── utils/
│   │   ├── encryption.js       # Web Crypto API utilities
│   │   ├── ipfs.js             # Pinata IPFS integration
│   │   ├── manifest.js         # Manifest creation/management
│   │   └── web3.js             # Ethereum interaction
│   ├── App.jsx                 # Main application
│   ├── index.css               # Styles
│   └── main.jsx                # Entry point
├── .env.example                # Environment template
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── DEPLOYMENT.md               # Deployment guide
├── USER_MANUAL.md              # User documentation
└── README.md                   # This file
```

## How It Works

### Architecture Flow

```
User Input
    ↓
Client-Side Encryption (Browser)
    ↓
Encrypted Data
    ↓
    ┌─────────────────┬─────────────────────────────┐
    │                 │                              │
    │ localStorage    │         IPFS (Pinata)        │
    │ (Metadata)     │   - Encrypted Files          │
    │                 │   - Encrypted Manifest       │
    │                 │                              │
    └─────────────────┴─────────────────────────────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   Blockchain (Optional)│
            │   - Manifest CID      │
            │   - Cross-device sync │
            └───────────────────────┘
```

### Encryption Process

1. **User creates password**
   - Password goes through PBKDF2 (150,000 iterations)
   - Generates AES-256 encryption key

2. **User uploads file**
   - Data encrypted with AES-256-GCM
   - Random IV generated
   - Uploaded to IPFS (via Pinata)

3. **Manifest update**
   - File metadata added to manifest
   - Manifest encrypted with same password
   - Manifest uploaded to IPFS
   - Manifest CID linked to wallet on blockchain

4. **Cross-device access**
   - User connects wallet on new device
   - Smart contract returns manifest CID
   - Manifest downloaded from IPFS
   - Decrypted with password
   - Files displayed

### Key Security Points

- We NEVER store your password (only SHA-256 hash for verification)
- We NEVER see your data (encryption happens in browser)
- Keys derived locally from password
- Manifest is encrypted before upload to IPFS
- Only user with password can decrypt

## Security

### Encryption Details

| Component | Algorithm |
|-----------|-----------|
| Key Derivation | PBKDF2-SHA256 (150,000 iterations) |
| Encryption | AES-256-GCM |
| Password Hash | SHA-256 |
| IV Size | 96 bits (random) |
| Key Size | 256 bits |

### Security Best Practices

1. **Strong Password**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Use a password manager

2. **Backup Recovery Phrase**
   - Write down your 12-word recovery phrase
   - Store it securely offline
   - We CANNOT recover your data without it

3. **Keep Seed Phrase Safe**
   - If using MetaMask, backup your seed phrase
   - Never share it with anyone

### Known Limitations

- Data lost if password AND recovery phrase forgotten
- IPFS storage requires Pinata (free tier: 1GB)
- Blockchain transactions cost gas fees

## Future Improvements

### Planned Features

- [ ] File sharing with time-limited access
- [ ] Biometric unlock
- [ ] Mobile app
- [ ] Social recovery (multi-sig)
- [ ] Decentralized identity integration

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details.

---

## Quick Start Summary

```bash
# 1. Navigate toproject
cd web3/ownnet-vault

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your Pinata JWT

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000

# 6. (Optional) Deploy smart contract via Remix
# 7. (Optional) Add contract address to .env
```

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Ensure Pinata JWT is configured
3. Ensure MetaMask is installed and unlocked (for blockchain features)
4. Verify you're on Sepolia testnet (for blockchain features)
5. Try clearing browser cache

---

Built with ❤️ for a user-owned internet.