# OwnNet Vault 🔐

> **🏆 ETHOnline 2024 - Infrastructure & Digital Rights Track**
> 
> A privacy-first data vault with client-side encryption and blockchain-verified cross-device sync

---

## 🎯 Hackathon Submission

### Track Alignment: Infrastructure & Digital Rights

| Criteria | How We Meet It |
|----------|----------------|
| **Decentralised Infrastructure** | ✅ IPFS storage (no central server), blockchain sync |
| **Data Ownership** | ✅ User owns all keys, client-side encryption |
| **Privacy-Preserving** | ✅ AES-256-GCM encryption before data leaves device |
| **Censorship Resistance** | ✅ Files stored on IPFS, accessible anywhere |
| **No Central Server** | ✅ All encryption/decryption in browser |

### Matches Example Project Ideas

| Example from Brief | Our Implementation |
|-------------------|-------------------|
| *"Password managers with social recovery and no central server"* | ✅ Recovery phrase for vault access, no server |
| *"File storage apps with client-side encryption"* | ✅ AES-256-GCM encryption before upload |
| *"Personal data vaults with granular consent"* | ✅ User controls all data, truly owns keys |

---

### 🚀 Live Demo

**Deployed:** https://ownnet-vault.vercel.app/

**Demo Video:** [Record a 3-min walkthrough and add link here]

---

## ⚡ Key Innovations

1. **Zero-Knowledge Architecture** - Server never sees user data or keys
2. **No Crypto Knowledge Required** - Works for non-Web3 users seamlessly
3. **Auto-Generated Wallet** - No MetaMask setup needed
4. **Cross-Device Sync** - Via blockchain without central server
5. **Military-Grade Encryption** - AES-256-GCM in browser

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Password   │───▶│   PBKDF2     │───▶│  AES-256     │      │
│  │   (User)     │    │  150K iter   │    │  Encrypt Key │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                   │              │
│                                                   ▼              │
│                              ┌──────────────────────────┐        │
│                              │   Encrypted Files        │        │
│                              │   + Encrypted Manifest   │        │
│                              └──────────────────────────┘        │
└───────────────────────────────────────────┬─────────────────────┘
                                            │
                        ┌───────────────────┴───────────────────┐
                        │                                       │
                        ▼                                       ▼
               ┌─────────────────┐                    ┌──────────────────┐
               │    IPFS/Pinata  │                    │   Blockchain     │
               │   (Decentralized│                    │   (Ethereum)     │
               │    Storage)      │                    │                  │
               │                  │                    │ Manifest CID     │
               │ ✓ No central     │                    │ stored on-chain  │
               │   server        │                    │                  │
               │ ✓ Censorship    │                    │ ✓ Cross-device   │
               │   resistant     │                    │   sync          │
               │ ✓ Permanent     │                    │ ✓ User owns     │
               └─────────────────┘                    └──────────────────┘
```

### Privacy Flow

```
Upload:  File → Encrypt (AES-256) → IPFS → Encrypt Manifest → Blockchain
Download: Blockchain → IPFS → Decrypt Manifest → Show Files
Recovery: 12-word phrase → Derive Key → Access anywhere
```

---

## 🔐 Security

| Attack Vector | Protection |
|---------------|------------|
| Server breach | ✅ Server never sees data (encrypted in browser) |
| Password leak | ✅ Only SHA-256 hash stored, keys derived locally |
| Interception | ✅ TLS + client-side encryption before upload |
| Key theft | ✅ Keys exist only in browser memory |
| Social engineering | ✅ No central authority to trick |

---

## Overview

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
4. Compile with Solidity 0.8.24
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

---

## Testing Smart Contract in Remix

### Prerequisites

- [ ] MetaMask installed and unlocked
- [ ] Sepolia testnet selected in MetaMask
- [ ] Test ETH in wallet (0.05+ ETH recommended)
- [ ] Contract deployed on Sepolia

### Get Test ETH

Use any of these free faucets:

| Faucet | URL | Amount | Requirements |
|--------|-----|--------|--------------|
| **PoW Faucet** | https://sepolia-faucet.pk910.de/ | 0.05+ ETH | None (mine in browser) |
| **QuickNode** | https://faucet.quicknode.com/ethereum/sepolia | 0.1 ETH | None |
| **Alchemy** | https://sepoliafaucet.com/ | 0.5 ETH | Free account |
| **Infura** | https://www.infura.io/faucet/sepolia | 0.5 ETH | Free account |

### Adding Sepolia Network to MetaMask

If Sepolia is not visible:

1. Open MetaMask
2. Go to **Settings** → **Advanced**
3. Enable **"Show test networks"**
4. Go back to main screen
5. Click network dropdown
6. Select **"Sepolia"** under "Test Networks"

Or add manually:

| Field | Value |
|-------|-------|
| Network Name | Sepolia |
| RPC URL | https://rpc.sepolia.org |
| Chain ID | 11155111 |
| Currency Symbol | SepoliaETH |
| Block Explorer | https://sepolia.etherscan.io |

### Step 1: Open Remix IDE

1. Go to: **https://remix.ethereum.org/**
2. Create new file: Click "File Explorers" → "Create New File"
3. Name it: `DataVault.sol`
4. Copy contract code from `contracts/DataVault.sol`
5. Paste into Remix editor

### Step 2: Compile Contract

1. Click **"Solidity Compiler"** (S icon) on left sidebar
2. Select compiler version: **0.8.24**
3. Click **"Compile DataVault.sol"**
4. Wait for green checkmark ✓

```
Expected Output:
✓ Compilation successful
```

### Step 3: Deploy Contract

1. Click **"Deploy & Run Transactions"** (Ethereum icon) on left sidebar
2. Set **Environment**: **"Injected Provider - MetaMask"**
3. MetaMask popup → Click **"Connect"**
4. Verify **Network**: Shows `Sepolia (11155111)`
5. Verify **Account**: Shows your wallet address
6. Verify **Contract**: Shows `DataVault`
7. Click **"Deploy"**
8. MetaMask popup → Click **"Confirm"**
9. Wait for deployment (15-30 seconds)

```
Expected Output:
✓ Transaction confirmed
✓ Deployed Contracts section appears
✓ DataVault contract visible
```

### Step 4: Find Your Contract Address

In Remix bottom panel:

```
Deployed Contracts
▼ DataVault
  at 0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99
  📋 (copy icon)
```

1. Click the copy icon 📋 next to the address
2. Save this address for your `.env` file

### Step 5: Copy Contract Address to .env

```bash
# Edit your .env file
VITE_CONTRACT_ADDRESS=0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99
```

### Step 6: Test Contract Functions

#### Test 1: Check Contract Owner

```
Function: owner()
Input: (none)
Click: "call"

Expected Output:
address: 0xYourWalletAddress
```

#### Test 2: Check if Contract is Paused

```
Function: paused()
Input: (none)
Click: "call"

Expected Output:
bool: false
```

#### Test 3: Check if Vault Exists

```
Function: hasVault(address)
Input: 0xYourWalletAddress  (your MetaMask address)
Click: "call"

Expected Output:
bool: false  (no vault created yet)
```

#### Test 4: Create Vault (Costs Gas!)

```
Function: updateManifest(string)
Input: QmTest123456  (test IPFS CID)
Click: "transact"  (NOT "call")
MetaMask: Confirm transaction
Wait: 15-30 seconds

Expected Output:
✓ Transaction confirmed
✓ Event: ManifestUpdated emitted
```

#### Test 5: Verify Vault Created

```
Function: hasVault(address)
Input: 0xYourWalletAddress
Click: "call"

Expected Output:
bool: true  (vault now exists!)
```

#### Test 6: Get Manifest CID

```
Function: getManifestCID(address)
Input: 0xYourWalletAddress
Click: "call"

Expected Output:
manifestCID: "QmTest123456"
lastUpdated: <timestamp>
```

#### Test 7: Add File

```
Function: addFile(string)
Input: QmFileHash123456789
Click: "transact"  (NOT "call")
MetaMask: Confirm transaction

Expected Output:
✓ Transaction confirmed
✓ Event: FileAdded emitted
```

#### Test 8: Get File Count

```
Function: getFileCount()
Input: (none)
Click: "call"

Expected Output:
uint256: 1  (one file added)
```

#### Test 9: Get User Files

```
Function: getUserFiles()
Input: (none)
Click: "call"

Expected Output:
Array of file records
```

### Common Testing Errors & Solutions

#### Error: "invalid address"

```
Error: Error encoding arguments: TypeError: invalid address
```

**Solution:** Enter your wallet address, not the contract address.

| Wrong | Correct |
|-------|---------|
| `0x9D7f74d0...` (contract) | `0x5B38Da6...` (your wallet) |

#### Error: "Cannot start session"

```
Error: Cannot start session for 0x... (address is a contract)
```

**Solution:** Don't use "At Address" field. Use "Deployed Contracts" section instead.

#### Error: "Insufficient funds"

```
Error: Insufficient funds for gas
```

**Solution:** Get more test ETH from faucet (see Prerequisites).

#### Error: "Wrong network"

```
Error: Please switch to Sepolia network
```

**Solution:** 
1. Open MetaMask
2. Click network dropdown
3. Select **"Sepolia"**

### Testing Checklist

Complete all tests in order:

- [ ] `owner()` returns your address
- [ ] `paused()` returns `false`
- [ ] `hasVault(address)` returns `false`
- [ ] `updateManifest(string)` transaction succeeds
- [ ] `hasVault(address)` returns `true`
- [ ] `getManifestCID(address)` returns CID
- [ ] `addFile(string)` transaction succeeds
- [ ] `getFileCount()` returns `1`
- [ ] `getUserFiles()` returns file array

### Gas Costs (Estimated)

| Function | Gas | Cost (Sepolia) |
|----------|-----|----------------|
| `Deploy` | ~1,200,000 | ~0.01 ETH |
| `updateManifest()` | ~80,000 | ~0.001 ETH |
| `addFile()` | ~80,000 | ~0.001 ETH |
| `hasVault()` | ~3,000 | Free (view) |
| `getManifestCID()` | ~3,000 | Free (view) |
| `getFileCount()` | ~3,000 | Free (view) |

### Viewing on Etherscan

After deployment, verify your contract:

1. Go to: **https://sepolia.etherscan.io/**
2. Paste your contract address
3. You should see:
   - Contract creation transaction
   - All function calls
   - Events emitted
   - Transaction history

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Remix not loading | Clear browser cache, try incognito mode |
| MetaMask not detected | Install/enable MetaMask extension |
| Transaction pending | Wait 30 seconds, check Sepolia network status |
| Contract not visible | Make sure deployed on Sepolia, not Mainnet |
| Function call fails | Check input format (address vs string) |

### Next Steps After Testing

1. Copy contract address to `.env`
2. Run app locally: `npm run dev`
3. Test file upload in app
4. Verify IPFS upload
5. Deploy to Vercel

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