# OwnNet Vault🔐

> A privacy-first data vault with client-side encryption and blockchain ownership verification

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

## Solution

**OwnNet Vault** is a client-side encrypted data vault where only users hold the keys to their data. All encryption happens in the browser before data is stored, meaning:

- **Zero-knowledge**: We cannot read your data
- **True ownership**: You control your encryption keys
- **Blockchain verification** (optional): Prove ownership on-chain

## Key Features

- 🔐 **Client-Side Encryption**: All data is encrypted in your browser using AES-256-GCM
- 🔑 **Password-Derived Keys**: Your password generates the encryption key
- 📁 **Secure File Storage**: Upload and encrypt any file type
- 📝 **Encrypted Notes**: Save sensitive text notes
- 🌐 **IPFS Integration**: Decentralized storage option
- ⛓️ **Blockchain Verification**: Optional ownership proof on Ethereum
- 🦊 **MetaMask Support**: Connect wallet for blockchain features
- 💾 **Local-First**: Works offline with local storage fallback

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + Vite |
| Encryption | Web Crypto API (AES-256-GCM) |
| Storage | LocalStorage / IPFS |
| Blockchain | Ethereum (Solidity) |
| Wallet | MetaMask |

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)- Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### For Blockchain Features

4. **MetaMask Browser Extension**
   - Download from: https://metamask.io/
   - Create a wallet and save your seed phrase

5. **Test ETH** (for Sepolia testnet)
   - Get free test ETH from: https://sepoliafaucet.com/

### For IPFS (Optional)

6. **Infura Account** (free tier available)
   - Sign up at: https://infura.io/
   - Create a project and get Project ID and Secret

## Installation

### Step 1: Clone or Download

```bash
cd web3/ownnet-vault
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- Vite (build tool)
- ethers.js (Ethereum library)
- ipfs-http-client (IPFS integration)

### Step 3: Verify Installation

```bash
npm list --depth=0
```

You should see the installed packages listed.

## Configuration

### Environment Variables (Optional)

Create a `. env` file in the project root:

```env
# IPFS Configuration (optional)
VITE_INFURA_PROJECT_ID=your_infura_project_id
VITE_INFURA_PROJECT_SECRET=your_infura_project_secret

# Contract Address (after deployment)
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

### Smart Contract Configuration

1. Open `src/utils/web3.js`
2. Replace `YOUR_CONTRACT_ADDRESS` with your deployed contract address (after deployment)

## Running Locally

### Development Mode

```bash
npm run dev
```

This starts the development server at `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Smart Contract Deployment

### Method 1: Using Remix IDE (Recommended for Beginners)

Remix is an online IDE that requires no installation.

#### Step-by-Step Deployment:

#### Step 1: Open Remix

1. Go to https://remix.ethereum.org/
2. Create a new file called `DataVault.sol`

#### Step 2: Copy Contract Code

1. Open `contracts/DataVault.sol` from this project
2. Copy the entire content
3. Paste into Remix's `DataVault.sol`

#### Step 3: Compile the Contract

1. Click the "Solidity Compiler" icon (left sidebar)
2. Set compiler version to `0.8.19` or higher
3. Click "Compile DataVault.sol"
4. You should see a green checkmark if successful

#### Step 4: Deploy to Testnet

1. Click the "Deploy & Run Transactions" icon
2. Set environment to "Injected Provider - MetaMask"
3. MetaMask will popup - confirm connection
4. Ensure you're on Sepolia testnet:
   - Open MetaMask
   - Click network dropdown
   - Select "Sepolia" (or add it if not visible)
5. Click "Deploy" button
6. Confirm the transaction in MetaMask
7. Wait for deployment (usually 15-30 seconds)

#### Step 5: Get Contract Address

1. After deployment, find your contract in "Deployed Contracts"
2. Click the copy icon next to the contract address
3. Save this address - you'll need it for your app

#### Step 6: Update Your App

1. Open `src/utils/web3.js`
2. Replace `YOUR_CONTRACT_ADDRESS` with your deployed address

### Method 2: Using Hardhat (Advanced)

For local development and testing:

```bash
# Install Hardhat
npm install --save-dev hardhat

# Initialize Hardhat project
npx hardhat init

# Create deployment script in scripts/deploy.js
# Run deployment
npx hardhat run scripts/deploy.js --network sepolia
```

### Network Configuration

#### Sepolia Testnet Details:

| Parameter | Value |
|-----------|-------|
| Network Name | Sepolia |
| Chain ID | 11155111 |
| RPC URL | https://sepolia.infura.io/v3/YOUR_INFURA_KEY |
| Explorer | https://sepolia.etherscan.io/ |

#### Adding Sepolia to MetaMask:

1. Open MetaMask
2. Click network dropdown
3. Click "Add Network"
4. Enter the details above
5. Click "Save"

## Testing

### Run Tests

```bash
npm run test
```

### Manual Testing Checklist

#### Basic Functionality:

- [ ] Vault setup with new password
- [ ] Password strength indicator works
- [ ] Vault unlock with correct password
- [ ] Vault unlock fails with wrong password
- [ ] Lock vault functionality

#### File Operations:

- [ ] Upload file (encrypted)
- [ ] Download file (decrypted correctly)
- [ ] Delete file
- [ ] Multiple file uploads

#### Note Operations:

- [ ] Create encrypted note
- [ ] Save note
- [ ] Note appears in file list

#### Wallet Connection:

- [ ] Connect MetaMask
- [ ] Display wallet address
- [ ] Display ETH balance
- [ ] Disconnect wallet

#### Smart Contract (if deployed):

- [ ] File hash registration on blockchain
- [ ] View user's registered files
- [ ] Transaction confirmation

## Project Structure

```
ownnet-vault/
├── contracts/
│ └── DataVault.sol# Smart contract
├── public/
│   └── vault.svg# App icon
├── src/
│   ├── components/
│   │ ├── FileList.jsx# File list display
│   │   ├── FileUpload.jsx# File upload interface
│   │   ├── NoteEditor.jsx# Note creation
│   │   ├── SetupModal.jsx# Initial setup
│   │   ├── StatusBar.jsx# Status indicators
│   │   ├── VaultUnlockModal.jsx# Unlock screen
│   │   └── WalletConnect.jsx# Wallet connection
│   ├── utils/
│   │   ├── encryption.js# Web Crypto API utilities
│   │   ├── ipfs.js# IPFS integration
│   │   └── web3.js# Ethereum interaction
│   ├── App.jsx# Main application
│   ├── index.css# Styles
│   └── main.jsx# Entry point
├── index.html# HTML template
├── package.json# Dependencies
├── vite.config.js# Vite configuration
└── README.md# This file
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
┌─────────────────┬─────────────────┐
│| |
│ Local Storage | IPFS (Optional) |
│| |
└─────────────────┴─────────────────┘
↓
┌──────────────────────────────────┐
│ Blockchain (Optional) |
│ - File hash |
│ - Ownership proof |
│ - Timestamp|
└──────────────────────────────────┘
```

### Encryption Process

1. **User creates password**
   - Password goes through PBKDF2 (100,000 iterations)
   - Generates AES-256 encryption key

2. **User uploads file/note**
   - Data is encrypted with AES-256-GCM
   - Random IV (initialization vector) generated
   - IV + encrypted data combined

3. **Storage**
   - Encrypted data saved locally or to IPFS
   - Original data NEVER leaves browser unencrypted

4. **Decryption**
   - User enters password
   - Key regenerated from password
   - Encrypted data decrypted locally

### Key Security Points

- We NEVER store your password
- We NEVER see your data
- Keys are derived locally
- All crypto happens in browser

## Security

### Encryption Details

| Component | Algorithm |
|-----------|-----------|
| Key Derivation | PBKDF2-SHA256 (100,000 iterations) |
| Encryption | AES-256-GCM |
| IV Size | 96 bits (random) |
| Key Size | 256 bits |

### Security Best Practices

1. **Strong Password**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Use a password manager

2. **Backup Your Password**
   - We CANNOT recover your data without the password
   - Store it securely offline

3. **Keep Seed Phrase Safe**
   - If using MetaMask, backup your seed phrase
   - Never share it with anyone

### Known Limitations

- Brute force attacks possible with weak passwords
- Data lost if password forgotten
- Local storage can be cleared by browser

## Future Improvements

### Planned Features

- [ ] Social recovery (multi-sig)
- [ ] File sharing with time-limited access
- [ ] Biometric unlock
- [ ] Mobile app
- [ ] E2EE sync across devices
- [ ] Dead man's switch
- [ ] Decentralized identity integration

### Contributing

We welcome contributions! Please follow these steps:

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
# 1. Navigate to project
cd web3/ownnet-vault

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000

# 5. (Optional) Deploy smart contract via Remix
# 6. (Optional) Update CONTRACT_ADDRESS in src/utils/web3.js
```

## Support

If you encounter any issues:

1. Check the browser console for errors
2. Ensure MetaMask is installed and unlocked
3. Verify you're on Sepolia testnet (for blockchain features)
4. Try clearing browser cache and local storage

## Hackathon Submission

This project was built for the **Infrastructure & Digital Rights** track, focusing on:

- Data ownership
- Privacy-preserving technologies
- Censorship-resistant storage
- User-controlled encryption

### Demo Video

[Link to demo video showing:
1. Setting up vault
2. Encrypting a file
3. Downloading and decrypting
4. Optional blockchain verification]

### Pitch

**Problem**: Users don't control their data on centralized platforms.

**Solution**: Client-side encrypted vault where only users hold the keys.

**Impact**: Restores privacy, prevents data exploitation, empowers users with true ownership.

---

Built with ❤️ for a user-owned internet.