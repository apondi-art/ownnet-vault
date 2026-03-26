# OwnNet Vault - Development History

> This document captures the complete development journey of OwnNet Vault, a privacy-first data storage application built for the Web3 hackathon.

## Project Overview

**Name:** OwnNet Vault

**Track:** Infrastructure & Digital Rights

**Goal:** Build a client-side encrypted data vault where users fully own and control their data.

---

## Conversation History

### Phase 1: Project Ideation & Planning

#### User Request
> "I want to participate in this hackathon challenge I am a beginner guide me step by step from tech stack to implementation what I need a complete documentation I am a beginner but give me best way to achieve this step by step what I need to do from planning to the end"

#### Assistant Guidance

**Recommended Project:** Personal Data Vault (privacy-first)

**Why this project:**
- Beginner-friendly
- Covers all hackathon themes: Data ownership, Privacy, Cryptography
- Achievable scope
- Clear value proposition

**Selected Tech Stack:**
| Layer | Technology |
|-------|-------------|
| Frontend | React + Vite |
| Encryption | Web Crypto API (AES-256-GCM) |
| Storage | LocalStorage / IPFS |
| Blockchain | Ethereum (Solidity) |
| Wallet | MetaMask |

---

### Phase 2: Understanding Core Concepts

#### User Question
> "What do you mean client-side encryption use analogy"

#### Explanation Provided

**Analogy: The Locked Box**

Traditional Cloud (Google Drive):
- You give your diary to storage company
- They put it in a box and lock it
- They keep the key
- They CAN open it anytime

Client-Side Encryption (OwnNet Vault):
- You put your diary in a box
- YOU lock it with your own key
- You send the locked box to storage
- Storage company does NOT have the key
- Only YOU can unlock it

**Key Insight:**
- Data is encrypted BEFORE leaving the device
- Keys NEVER leave the user's browser
- Even the developer cannot access user data

---

### Phase 3: Competitive Analysis

#### User Question
> "How different it is with the existing ones"

#### Existing Systems Analyzed

1. **Proton (Proton Drive)**
   - Strength: Strong encryption, trusted brand
   - Weakness: Still centralized, limited customization

2. **IPFS**
   - Strength: Decentralized, censorship-resistant
   - Weakness: Not encrypted by default, hard for beginners

3. **Bitwarden**
   - Strength: Open source, secure design
   - Weakness: Only for passwords, not general data

4. **Google Drive**
   - Strength: Easy to use, fast
   - Weakness: Google can access data, not private

#### Our Differentiator

| Feature | Existing Apps | OwnNet Vault |
|---------|--------------|--------------|
| Easy to use | Some complex | Very simple |
| Fully private | Not always | Yes |
| Beginner-friendly | No | Yes |
| Decentralized | Limited | Optional |
| Education value | Low | High |

**Positioning:** "The simplest way for anyone to own their data securely."

---

### Phase 4: Web3 Integration Discussion

#### User Question
> "This smart contract I was going to deploy I don't know anything like deployment yet I am supposed to deploy with something cause the hackathon is sponsored with Web3"

#### Assistant Decision

**Do you NEED a smart contract?**

For OwnNet Vault: **Core feature = client-side encryption, NOT blockchain**

**Strategy:**
1. Build core app (encryption + upload) first
2. Add IPFS
3. Add smart contract (optional bonus)

**Blockchain Purpose:**
- Store file hash ownership on-chain
- Prove ownership
- Immutable record

**Smart Contract Code Created:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DataVault {
    struct FileRecord {
        string ipfsHash;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(address => FileRecord[]) private userFiles;
    mapping(address => mapping(string => bool)) private fileOwnership;
    
    event FileAdded(address indexed user, string ipfsHash, uint256 timestamp);
    event FileDeleted(address indexed user, uint256 index);
    
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
}
```

---

### Phase 5: Project Creation

#### User Request
> "Create a folder called web3 then now create this challenge there ensure you have given it a name as well so help me with complete readme on how deploy it with crypto step by step to run and test"

#### Files Created

**Project Structure:**
```
web3/ownnet-vault/
├── contracts/
│   └── DataVault.sol          # Smart contract
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
│   │   ├── encryption.js      # Web Crypto API utilities
│   │   ├── ipfs.js             # IPFS integration
│   │   └── web3.js             # Ethereum interaction
│   ├── App.jsx                 # Main application
│   ├── index.css               # Styles
│   └── main.jsx                # Entry point
├── tests/
│   ├── encryption.test.js     # Encryption tests
│   └── storage.test.js         # Storage tests
├── index.html                  # HTML template
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Test configuration
├── README.md                   # Complete documentation
└── DEPLOYMENT.md               # Deployment guide
```

---

### Phase 6: Running & Testing

#### User Request
> "I want to fast run and test now guide me"

#### Steps Executed

1. **Install Dependencies**
   ```bash
   cd web3/ownnet-vault
   npm install
   ```

2. **Errors Encountered & Fixed**

   **Error 1: IPFS Import Issue**
   ```
   src/utils/ipfs.js (41:14): Expression expected
   forawait (const chunk of client.cat(hash)) {
   ```
   **Fix:** Changed `forawait` to `for await`

   **Error 2: Web3.js Duplicated Code**
   ```
   src/utils/web3.js (143:0): Expression expected
   ```
   **Fix:** Removed duplicate code that was accidentally appended

   **Error 3: White Screen Issue**
   - Added ErrorBoundary component to catch and display errors
   - Made ethers.js import dynamic (lazy loading)
   - Simplified IPFS integration (using local storage fallback)

3. **Build Commands**
   ```bash
   npm run build    # Production build
   npm run dev      # Development server
   npm run test     # Run tests
   ```

---

## Technical Decisions

### Encryption Implementation

**Algorithm:** AES-256-GCM with PBKDF2 key derivation

**Key Derivation:**
```javascript
// 100,000 iterations for security
const key = await crypto.subtle.deriveKey(
  {
    name: 'PBKDF2',
    salt: encoder.encode('ownnet-vault-salt'),
    iterations: 100000,
    hash: 'SHA-256'
  },
  keyMaterial,
  { name: 'AES-GCM', length: 256 },
  false,
  ['encrypt', 'decrypt']
);
```

### Storage Strategy

**Primary:** LocalStorage (for simplicity and offline capability)
**Optional:** IPFS (for decentralization)
**Blockchain:** Smart contract for ownership verification

### Security Features

1. **Zero-Knowledge Architecture**
   - Password never sent to server
   - Keys derived locally
   - Data encrypted before upload

2. **Client-Side Only**
   - All crypto in browser
   - No backend required for core functionality

3. **Password Strength Validation**
   - Minimum 8 characters
   - Mixed case requirement
   - Numbers and special characters encouraged

---

## Deployment Guide

### Smart Contract Deployment (Remix IDE)

1. Open https://remix.ethereum.org/
2. Create file `DataVault.sol`
3. Copy contract code
4. Compile with Solidity 0.8.19
5. Deploy to Sepolia testnet
6. Copy contract address
7. Update `src/utils/web3.js` with address

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import to Vercel
3. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output: `dist`
4. Deploy

---

## Hackathon Submission Checklist

- [x] Working encryption (AES-256-GCM)
- [x] File upload & download
- [x] Encrypted notes
- [x] Password-derived keys
- [x] Smart contract for ownership
- [x] MetaMask integration
- [x] Clean UI
- [x] README documentation
- [x] Deployment guide

### Pitch

**Problem:** Users don't control their data on centralized platforms.

**Solution:** Client-side encrypted vault where only users hold the keys.

**Impact:** Restores privacy, prevents data exploitation, empowers users with true ownership.

---

## Key Learnings for Beginners

1. **Start Simple** - Don't try to build everything at once
2. **Test Incrementally** - Build, test, repeat
3. **Error Handling** - Add ErrorBoundary to catch issues
4. **Dynamic Imports** - Use lazy loading for large libraries
5. **Local Storage First** - Simpler than blockchain for MVP

---

## File Reference

| File | Purpose | Lines |
|------|---------|-------|
| `src/utils/encryption.js` | Core encryption logic | 172 |
| `src/utils/web3.js` | Wallet & contract | 140 |
| `src/utils/ipfs.js` | Storage utilities | 100 |
| `src/App.jsx` | Main application | 323 |
| `contracts/DataVault.sol` | Smart contract | 75 |
| `README.md` | Documentation | 550+ |
| `DEPLOYMENT.md` | Deployment steps | 200+ |

---

## Project Stats

- **Total Files:** 21
- **Lines of Code:** ~2000+
- **Dependencies:** React, ethers.js, ipfs-http-client, vite
- **Build Time:** ~3-4 seconds
- **Bundle Size:** ~600KB (with ethers.js)

---

## Next Steps for Enhancement

1. **Social Recovery** - Multi-sig for password reset
2. **File Sharing** - Time-limited access keys
3. **Mobile App** - React Native version
4. **E2EE Sync** - Cross-device synchronization
5. **Dead Man's Switch** - Digital inheritance feature

---

## Credits

Built for the **Infrastructure & Digital Rights** track of the Web3 Hackathon.

**Core Technologies:**
- Web Crypto API (browser-native encryption)
- React + Vite (fast development)
- ethers.js (Ethereum interaction)
- Solidity (smart contracts)

---

*This document serves as a complete record of the development process, decisions made, and code created during this session.*