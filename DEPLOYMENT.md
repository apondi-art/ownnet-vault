# Deployment Guide

This guide walks you through deploying OwnNet Vault to production with full cross-device sync support.

## Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask wallet with test ETH
- GitHub account
- Vercel account (free)
- Pinata account (free tier available)

---

## Step 1: Configure IPFS Storage (Pinata)

### Why Pinata?

localStorage is limited and data is lost when browser is cleared. Pinata provides:
- Decentralized IPFS storage
- File persistence (pinning)
- Larger storage capacity
- Data survives across devices/sessions

### Pinata Plans

| Plan | Storage | Price | Best For |
|------|---------|-------|----------|
| **Free** | 1 GB | $0/month | Development, Testing, Personal Projects |
| Starter | 100 GB | $20/month | Production, Small Teams |
| Professional | 500 GB | $100/month | Large Scale, Enterprise |

**Recommendation:** Start with **Free Plan**. Upgrade when you reach 1 GB or launch to production.

### Create Pinata Account

1. Go to https://app.pinata.cloud/
2. Click **"Sign Up"**
3. Enter your email and create a password
4. Verify your email
5. Free plan is automatically activated

### Create API Key

1. Click your **profile icon** (top right)
2. Select **"API Keys"** from the menu
3. Click **"New Key"** button
4. Configure the key:

```
Key Name: [ownnet-vault]

Permissions:
  ● Custom (Limited Access)    ← SELECT THIS

  If Custom selected, check these:
  ☑ pinFileToIPFS      Upload files to IPFS (REQUIRED)
  ☑ pinJSONToIPFS      Upload JSON/manifest to IPFS (REQUIRED)
  ☐ unpin              Delete files (OPTIONAL - only if you want file deletion)

Usage Limits:
  ● Limited            ← SELECT THIS for security
      Max uses: 10000  (requests per key)
```

5. Click **"Create Key"**

### ⚠️ Important: Copy Your JWT

After creating the key, you'll see three values:

```
┌─────────────────────────────────────────────────────────────────┐
│  API KEY CREATED                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  API Key:              pinata_api_xxxxx                        │
│  API Secret:           pinata_secret_xxxxx                     │
│  JWT:                  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
│                                                                 │
│  ⚠️ Copy the JWT - this is what you need!                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Field | Use For | Your App Need It? |
|-------|---------|-------------------|
| API Key | SDK (Node.js) | ❌ No |
| API Secret | SDK (Node.js) | ❌ No |
| **JWT** | REST API, Browser | ✅ **USE THIS** |

**Copy the JWT (starts with `eyJ...`) - you won't see it again!**

### Verify Your JWT Works

```bash
# Test your JWT (replace YOUR_JWT)
curl -X GET "https://api.pinata.cloud/data/testAuthentication" \
  -H "Authorization: Bearer YOUR_JWT"

# Expected response:
# {"message":"Congratulations! You are winning! Pinata API Test Successful"}
```

### Configure Environment

Create `.env` file in your project root:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# =================================================================
# REQUIRED for IPFS storage
# =================================================================
# Get from: https://app.pinata.cloud/ → API Keys → Create New Key
# Copy the JWT (starts with eyJ...)
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# =================================================================
# OPTIONAL - Custom IPFS gateway (defaults to Pinata gateway)
# =================================================================
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

# =================================================================
# OPTIONAL - Smart contract for cross-device sync
# =================================================================
# Leave empty until you deploy the contract
# Deploy contract using Remix: https://remix.ethereum.org/
# After deploying, add the contract address here:
VITE_CONTRACT_ADDRESS=
```

---

## Recommended Setup Order

```
┌─────────────────────────────────────────────────────────────────┐
│                     SETUP ORDER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: Pinata (REQUIRED)                                      │
│  ─────────────────────                                          │
│  1. Add VITE_PINATA_JWT to .env                                 │
│  2. npm run dev                                                 │
│  3. Test: Upload file → Check status shows "IPFS"              │
│  4. Test: Download file                                         │
│                                                                 │
│  ✓ App is now working!                                          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  STEP 2: Contract (OPTIONAL - for cross-device sync)            │
│  ─────────────────────────────────────────────────────────      │
│  1. Get test ETH from https://sepoliafaucet.com/               │
│  2. Deploy contract via Remix                                   │
│  3. Add VITE_CONTRACT_ADDRESS to .env                           │
│  4. Restart: npm run dev                                        │
│  5. Test: Connect wallet → Upload → Check blockchain sync       │
│                                                                 │
│  ✓ Cross-device sync is now working!                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Step 2: Deploy Smart Contract (OPTIONAL)

### ⚠️ Contract is Optional

Your app works **without** deploying the contract:

| Setup | What Works | What Doesn't Work |
|-------|------------|-------------------|
| **Pinata only** | Files on IPFS, encryption, download | No cross-device sync via blockchain |
| **Pinata + Contract** | Everything + cross-device sync | None |

**Recommendation:** Start with Pinata. Deploy contract later if you need cross-device sync.

### Why Deploy Contract?

The smart contract enables cross-device sync by storing your manifest CID on-chain:

```
WITH CONTRACT:                    WITHOUT CONTRACT:
┌─────────────────────┐           ┌─────────────────────┐
│ Device 1            │           │ Device 1            │
│ Upload file         │           │ Upload file         │
│ Manifest CID syncs  │           │ Manifest saved      │
│ to blockchain       │           │ locally only        │
└─────────────────────┘           └─────────────────────┘
         │                                  │
         ▼                                  ▼
┌─────────────────────┐           ┌─────────────────────┐
│ Device 2            │           │ Device 2            │
│ Connect wallet      │           │ No access to files  │
│ Fetch CID from      │           │ (manifest not      │
│ blockchain          │           │  synced)            │
│ Download files ✓    │           │                     │
└─────────────────────┘           └─────────────────────┘
```

### If You Want Cross-Device Sync, Deploy Contract

#### Step 1: Get Test ETH

You need Sepolia test ETH to deploy the contract (it's free).

```
┌─────────────────────────────────────────────────────────────────┐
│  GET TEST ETH                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Open MetaMask                                               │
│  2. Click network dropdown (top right)                          │
│  3. Select "Sepolia" (or click "Add Network" if not there)     │
│                                                                 │
│  If Sepolia not visible:                                        │
│  ───────────────────────                                        │
│  4. Click "Add Network"                                         │
│  5. Enter manually:                                             │
│     Network Name: Sepolia                                       │
│     RPC URL: https://rpc.sepolia.org                           │
│     Chain ID: 11155111                                         │
│     Currency: SepoliaETH                                        │
│     Explorer: https://sepolia.etherscan.io                     │
│                                                                 │
│  Get Test ETH:                                                  │
│  ────────────────                                               │
│  1. Copy your wallet address                                    │
│  2. Go to https://sepoliafaucet.com/                            │
│  3. Paste your address                                          │
│  4. Click "Request ETH"                                         │
│  5. Wait 1-2 minutes for ETH to arrive                         │
│                                                                 │
│  You need ~0.01 ETH to deploy the contract                      │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 2: Open Remix IDE

Go to: https://remix.ethereum.org/

#### Step 3: Create Contract File

```
┌─────────────────────────────────────────────────────────────────┐
│  REMIX IDE - CREATE FILE                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Click "File Explorers" (folder icon, left sidebar)        │
│  2. Click "Create New File" icon                               │
│  3. Name it: DataVault.sol                                      │
│  4. Press Enter                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 4: Copy Contract Code

Open `contracts/DataVault.sol` from your project and copy the entire content.

Or copy from here:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DataVault {
    struct FileRecord {
        string ipfsHash;
        uint256 timestamp;
        bool exists;
    }
    
    struct UserVault {
        string manifestCID;
        uint256 lastUpdated;
        bool exists;
    }
    
    mapping(address => FileRecord[]) private userFiles;
    mapping(address => mapping(string => bool)) private fileOwnership;
    mapping(address => UserVault) private userVaults;
    
    event FileAdded(address indexed user, string ipfsHash, uint256 timestamp);
    event FileDeleted(address indexed user, uint256 index);
    event ManifestUpdated(address indexed user, string manifestCID, uint256 timestamp);
    
    function updateManifest(string memory _manifestCID) external {
        require(bytes(_manifestCID).length > 0, "Manifest CID cannot be empty");
        
        userVaults[msg.sender] = UserVault({
            manifestCID: _manifestCID,
            lastUpdated: block.timestamp,
            exists: true
        });
        
        emit ManifestUpdated(msg.sender, _manifestCID, block.timestamp);
    }
    
    function getManifestCID(address _user) external view returns (string memory, uint256) {
        require(userVaults[_user].exists, "Vault not found");
        return (userVaults[_user].manifestCID, userVaults[_user].lastUpdated);
    }
    
    function hasVault(address _user) external view returns (bool) {
        return userVaults[_user].exists;
    }
    
    function addFile(string memory _ipfsHash) external {
        require(bytes(_ipfsHash).length > 0, "Hash cannot be empty");
        require(!fileOwnership[msg.sender][_ipfsHash], "File already registered");
        
        FileRecord memory newFile = FileRecord({
            ipfsHash: _ipfsHash,
            timestamp: block.timestamp,
            exists: true
        });
        
        userFiles[msg.sender].push(newFile);
        fileOwnership[msg.sender][_ipfsHash] = true;
        
        emit FileAdded(msg.sender, _ipfsHash, block.timestamp);
    }
    
    function getUserFiles() external view returns (FileRecord[] memory) {
        return userFiles[msg.sender];
    }
    
    function getFileCount() external view returns (uint256) {
        return userFiles[msg.sender].length;
    }
    
    function deleteFile(uint256 _index) external {
        require(_index < userFiles[msg.sender].length, "Index out of bounds");
        
        string memory hashToDelete = userFiles[msg.sender][_index].ipfsHash;
        fileOwnership[msg.sender][hashToDelete] = false;
        
        userFiles[msg.sender][_index] = userFiles[msg.sender][userFiles[msg.sender].length - 1];
        userFiles[msg.sender].pop();
        
        emit FileDeleted(msg.sender, _index);
    }
    
    function verifyOwnership(string memory _ipfsHash) external view returns (bool) {
        return fileOwnership[msg.sender][_ipfsHash];
    }
    
    function getFileInfo(string memory _ipfsHash) external view returns (uint256, bool) {
        FileRecord[] storage files = userFiles[msg.sender];
        
        for (uint256 i = 0; i < files.length; i++) {
            if (keccak256(bytes(files[i].ipfsHash)) == keccak256(bytes(_ipfsHash))) {
                return (files[i].timestamp, files[i].exists);
            }
        }
        
        return (0, false);
    }
}
```

Paste this code into Remix's `DataVault.sol` file.

#### Step 5: Compile the Contract

```
┌─────────────────────────────────────────────────────────────────┐
│  COMPILE CONTRACT                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Click "Solidity Compiler" (S icon, left sidebar)          │
│  2. Set compiler version: 0.8.19                               │
│  3. Click "Compile DataVault.sol"                              │
│  4. Wait for green checkmark ✓                                 │
│                                                                 │
│  If compilation fails:                                          │
│  ─────────────────────                                          │
│  - Make sure you copied the ENTIRE contract                    │
│  - Check compiler version is 0.8.19 or higher                  │
│  - Look for red error messages in output panel                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 6: Deploy the Contract

```
┌─────────────────────────────────────────────────────────────────┐
│  DEPLOY TO SEPOLIA                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Click "Deploy & Run Transactions" (Ethereum logo, left)    │
│  2. Set Environment: "Injected Provider - MetaMask"             │
│  3. MetaMask popup appears → Click "Connect"                    │
│  4. Verify Network shows "Sepolia (11155111)"                   │
│  5. Verify Account shows your wallet address                    │
│  6. Contract should show "DataVault"                            │
│  7. Click "Deploy" button                                       │
│  8. MetaMask popup → Click "Confirm"                           │
│  9. Wait 15-30 seconds for deployment                          │
│                                                                 │
│  MetaMask popup:                                                │
│  ─────────────────                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Confirm Transaction                                      │   │
│  │                                                          │   │
│  │ You're interacting with:                                │   │
│  │ DataVault                                                │   │
│  │                                                          │   │
│  │ Gas fee: ~0.001 ETH                                     │   │
│  │                                                          │   │
│  │ [Cancel]  [Confirm]  ← Click Confirm                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Success:                                                       │
│  ─────────                                                      │
│  ✓ "Deployed Contracts" appears at bottom                      │
│  ✓ Transaction mined message                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 7: Copy Contract Address

```
┌─────────────────────────────────────────────────────────────────┐
│  GET CONTRACT ADDRESS                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Look at bottom of Remix (Deployed Contracts section)       │
│  2. You'll see: DataVault at 0xAbC123...789Def                │
│  3. Click the copy icon next to the address                    │
│  4. Address looks like: 0x1234567890abcdef...                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Deployed Contracts                                       │   │
│  │ ────────────────────────────────────────────────────────│   │
│  │ DataVault at 0xAbC123456789...Def      [📋 Copy]       │   │
│  │                                             ↑          │   │
│  │                                      Click this         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Save this address! You'll need it for your .env file.         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Step 8: Add to Your .env File

```bash
# Open your .env file
nano .env
```

Add the contract address:

```env
# Pinata JWT (required for IPFS)
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Contract address (for cross-device sync)
VITE_CONTRACT_ADDRESS=0xAbC123456789...Def
```

#### Step 9: Restart Your App

```bash
# Stop the server (Ctrl+C in terminal)
npm run dev
```

#### Step 10: Verify on Etherscan

1. Go to https://sepolia.etherscan.io/
2. Paste your contract address
3. You should see your contract and its details
4. You can see all transactions to your contract

### Smart Contract Functions

| Function | Description | Gas Cost |
|----------|-------------|----------|
| `updateManifest(cid)` | Store manifest CID for user | ~0.001 ETH |
| `getManifestCID(address)` | Retrieve manifest CID | Free (view) |
| `hasVault(address)` | Check if user has vault | Free (view) |
| `addFile(hash)` | Register file hash | ~0.001 ETH |
| `getUserFiles()` | Get user's files | Free (view) |

---

## Step 3: Build Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates an optimized build in `dist/`.

---

## Step 4: Deploy to Vercel

### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Production deployment
vercel --prod
```

### Option B: GitHub Integration

1. Push code to GitHub
2. Go to https://vercel.com/
3. Import your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click Deploy

---

## Step 5: Configure Environment Variables (Vercel)

In Vercel dashboard:

1. Go to Settings > Environment Variables
2. Add:

| Variable | Required? | Description |
|----------|-----------|-------------|
| `VITE_PINATA_JWT` | ✅ **Required** | Pinata JWT token (from API Keys) |
| `VITE_PINATA_GATEWAY` | ⚠️ Optional | Custom IPFS gateway URL |
| `VITE_CONTRACT_ADDRESS` | ⚠️ Optional | Smart contract address (deploy later) |

**Minimum required:** Just `VITE_PINATA_JWT`

---

## Step 6: Test Deployment

### Basic Functionality (Pinata Only - No Contract Required)

- [ ] Create vault with password
- [ ] Write down recovery phrase
- [ ] Upload file
- [ ] Verify file shows "IPFS" storage indicator
- [ ] Download file
- [ ] Lock vault
- [ ] Unlock with password

### Cross-Device Sync (Requires Contract)

> ⚠️ Only test after deploying smart contract

- [ ] Connect MetaMask on Device 1
- [ ] Upload files
- [ ] Open app on Device 2 (or clear localStorage)
- [ ] Connect same MetaMask wallet
- [ ] Enter recovery phrase
- [ ] Verify files appear
- [ ] Download file on Device 2

### Blockchain Sync (Requires Contract)

- [ ] Upload file
- [ ] Check browser console for "Manifest CID synced to blockchain"
- [ ] Verify on Sepolia Etherscan (transaction should show)
- [ ] View transaction on https://sepolia.etherscan.io/

---

## Production Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                                  │
│                                                                      │
│  ┌──────────────────┐    ┌─────────────────┐    ┌────────────────┐ │
│  │    React App     │    │   Encryption    │    │   Manifest     │ │
│  │                  │───▶│   (AES-256)     │───▶│   (JSON)       │ │
│  │  - Password      │    │                 │    │                │ │
│  │  - File Upload   │    │ - PBKDF2/SHA256 │    │ - File list   │ │
│  │  - Wallet Connect│    │ - 150k iterations│   │ - Metadata    │ │
│  └──────────────────┘    └─────────────────┘    └────────────────┘ │
│                                                        │            │
└────────────────────────────────────────────────────────│────────────┘
                                                         │
                    ┌────────────────────────────────────┼───────────────────┐
                    │                                    │                   │
                    ▼                                    ▼                   ▼
          ┌─────────────────┐              ┌─────────────────┐    ┌─────────────────┐
          │   PINATA IPFS   │              │   BLOCKCHAIN    │    │  localStorage   │
          │                 │              │   (Ethereum)    │    │                 │
          │  ┌───────────┐ │              │                 │    │  ┌───────────┐ │
          │  │ Encrypted  │ │              │  ┌───────────┐ │    │  │ Password  │ │
          │  │ Files      │ │              │  │ Manifest  │ │    │  │ Hash      │ │
          │  │             │ │              │  │ CID       │ │    │  │ (SHA256)  │ │
          │  │ (QmX4F...) │ │              │  │            │ │    │  └───────────┘ │
          │  └───────────┘ │              │  │ (0x123..)  │ │    │                 │
          │                 │              │  └───────────┘ │    │  ┌───────────┐ │
          │  ┌───────────┐ │              │                 │    │  │ Vault ID  │ │
          │  │ Encrypted  │ │              │  User Address  │ │    │  │           │ │
          │  │ Manifest   │ │              │  → Manifest CID│ │    │  └───────────┘ │
          │  │             │ │              │                 │    │                 │
          │  │ (QmY7A...) │ │              └─────────────────┘    └─────────────────┘
          │  └───────────┘ │
          │                 │
          └─────────────────┘
```

---

## Data Flow

### File Upload Flow

```
USER INPUT (File)
    │
    ▼
┌────────────────────────┐
│ BROWSER                │
│                        │
│ 1. Encrypt file        │
│    (AES-256-GCM)       │
│                        │
│ 2. Upload to IPFS      │
│    (via Pinata API)    │
│                        │
│ 3. Get IPFS CID        │◀───── QmX4F... (file hash)
│                        │
│ 4. Update Manifest     │
│    - Add file metadata │
│    - Encrypt manifest   │
│    - Upload manifest   │
│                        │
│ 5. Get Manifest CID    │◀───── QmY7A... (manifest hash)
│                        │
│ 6. Sync to Blockchain │
│    (if wallet linked)  │
│                        │
└────────────────────────┘
    │
    ▼
STORAGE UPDATED:
 - IPFS: File + Manifest
 - Blockchain: Manifest CID
 - localStorage: Vault metadata
```

### Cross-Device Access Flow

```
DEVICE 2 LOGIN
    │
    ▼
┌────────────────────────┐
│ OPTION A: RECOVERY       │
│ PHRASE ONLY             │
│                        │
│ 1. Enter 12-word phrase │
│ 2. Derive key          │
│ 3. Load from backup    │
│                        │
└────────────────────────┘

┌────────────────────────┐
│ OPTION B: WALLET +      │
│ RECOVERY (RECOMMENDED)  │
│                        │
│ 1. Connect MetaMask    │
│ 2. Query blockchain:    │
│    getManifestCID()    │
│ 3. Download manifest    │
│    from IPFS           │
│ 4. Enter recovery      │
│    phrase              │
│ 5. Decrypt manifest    │
│ 6. Display files!      │
│                        │
└────────────────────────┘
    │
    ▼
FILES ACCESSIBLE:
 - List from manifest
 - Download from IPFS
 - Decrypt locally
```

---

## Security Improvements

| Before | After |
|--------|-------|
| Password stored as base64 (reversible) | SHA-256 hash (one-way) |
| Files in localStorage (5MB limit) | Files on IPFS (unlimited) |
| No cross-device access | Blockchain-synced manifest |
| Data lost on browser clear | Data persists on IPFS |
| No backup mechanism | Recovery phrase backup |

---

## Cost Estimation

### Pinata Pricing

| Plan | Storage | Price | Use Case |
|------|---------|-------|----------|
| **Free** | 1 GB | $0/month | Development, Testing, Personal Projects |
| **Starter** | 100 GB | $20/month | Production, Small Teams |
| **Professional** | 500 GB | $100/month | Large Scale, Enterprise |
| **Enterprise** | Custom | Contact Sales | High Volume |

**When to Upgrade:**

| Free Plan Limits | Action |
|------------------|--------|
| Storage reaches 1 GB | Upgrade to Starter ($20) |
| Need faster access | Starter includes dedicated gateway |
| Multiple team members | Starter has unlimited API keys |
| Production launch | Consider Starter for reliability |

### Sepolia Testnet

| Operation | Gas Cost (approx) |
|-----------|-------------------|
| Deploy contract | ~0.01 ETH |
| Update manifest | ~0.001 ETH |
| Add file | ~0.001 ETH |
| Get manifest CID | Free (view) |

### Mainnet (Not Recommended for Testing)

| Operation | Gas Cost (approx) |
|-----------|-------------------|
| Deploy contract | ~0.5-1 ETH |
| Update manifest | ~0.01-0.05 ETH |

---

## Security Checklist

Before deploying:

- [ ] Pinata JWT set as environment variable (not in code)
- [ ] Contract address configured (if using blockchain sync)
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Contract verified on Etherscan
- [ ] Recovery phrase feature tested
- [ ] Cross-device sync tested
- [ ] Test thoroughly on testnet first

---

## Monitoring

### Pinata Dashboard

Monitor your IPFS usage:
1. Go to https://app.pinata.cloud/
2. Check "Pin Manager" for uploaded files
3. Monitor bandwidth usage

### Blockchain Events

Monitor your contract:

```javascript
// In your app
contract.on('ManifestUpdated', (user, manifestCID, timestamp) => {
  console.log('Manifest updated:', user, manifestCID, timestamp);
});
```

### Frontend Errors

Use error tracking:
- Sentry
- LogRocket
- Bugsnag

---

## Troubleshooting

### Pinata API Errors

**"Authentication failed"**
```
Problem: JWT is invalid or expired
Solution:
1. Verify JWT is correct in .env
2. Check JWT wasn't copied with extra spaces
3. Create new API key if needed
4. Test with: curl -X GET "https://api.pinata.cloud/data/testAuthentication" -H "Authorization: Bearer YOUR_JWT"
```

**"Rate limit exceeded"**
```
Problem: Too many API requests
Solution:
1. Wait 1 minute and try again
2. Reduce file upload frequency
3. Consider upgrading Pinata plan
```

**"Storage limit reached"**
```
Problem: Free plan 1 GB limit
Solution:
1. Check usage at https://app.pinata.cloud/
2. Delete unused files from Pin Manager
3. Upgrade to Starter plan ($20/month)
```

**Files not uploading to IPFS**
```
Problem: Upload fails silently
Solution:
1. Check Pinata JWT is correct in .env
2. Verify environment variable in Vercel
3. Check browser console for errors
4. Files fall back to localStorage automatically
5. Test JWT with curl command above
```

### Cross-device sync not working

1. Ensure MetaMask connected on both devices
2. Verify using same wallet address
3. Check Sepolia network is selected
4. Ensure contract address is configured
5. Check browser console for blockchain errors

### Manifest not syncing

1. Check wallet has ETH for gas
2. Verify contract address in `.env`
3. Check Sepolia Etherscan for transaction

### Build fails

1. Run `npm run build` locally first
2. Check for TypeScript errors
3. Verify all dependencies installed

---

## Local Development

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your values
# VITE_PINATA_JWT=your_token
# VITE_CONTRACT_ADDRESS=0x...

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## Backup Strategy

### User Data

Users must remember:
- Password (or write down securely)
- 12-word recovery phrase
- No server-side backup possible (by design)

### Manifest Recovery

If user loses device but has:
- Recovery phrase → Can restore on new device
- Wallet connected → Manifest CID from blockchain

### Contract Backup

- Save deployment transaction hash
- Keep contract source code
- Document all functions

---

## Support

If deployment fails:

1. Check Vercel build logs
2. Verify environment variables
3. Test locally with `npm run build && npm run preview`
4. Check browser console for errors
5. Verify Pinata JWT is valid
6. Ensure smart contract is deployed correctly