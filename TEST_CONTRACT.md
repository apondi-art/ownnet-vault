# Smart Contract Testing Guide

Complete guide for testing the DataVault smart contract on Remix IDE.

---

## Quick Start

| Step | Action | Time |
|------|--------|------|
| 1 | Get test ETH | 2-5 min |
| 2 | Deploy contract | 1 min |
| 3 | Test functions | 5 min |
| 4 | Add to .env | 30 sec |

---

## Prerequisites

### Required

- [ ] MetaMask installed: https://metamask.io/
- [ ] Sepolia network added to MetaMask
- [ ] Test ETH in wallet (0.05+ ETH)

### Get Test ETH

Use any faucet:

| Faucet | URL | ETH |
|--------|-----|-----|
| PoW Faucet | https://sepolia-faucet.pk910.de/ | 0.05+ ETH |
| QuickNode | https://faucet.quicknode.com/ethereum/sepolia | 0.1 ETH |
| Alchemy | https://sepoliafaucet.com/ | 0.5 ETH |

---

## Set Up MetaMask

### Add Sepolia Network

1. Open MetaMask
2. Click **Settings** → **Advanced**
3. Enable **"Show test networks"**
4. Go back to main screen
5. Click network dropdown (top)
6. Select **"Sepolia"**

### Add Manually (if not visible)

| Field | Value |
|-------|-------|
| Network Name | Sepolia |
| RPC URL | https://rpc.sepolia.org |
| Chain ID | 11155111 |
| Symbol | SepoliaETH |
| Explorer | https://sepolia.etherscan.io |

---

## Deploy Contract

### Step 1: Open Remix

Go to: **https://remix.ethereum.org/**

### Step 2: Create File

1. Click "File Explorers" (folder icon)
2. Click "Create New File"
3. Name it: `DataVault.sol`
4. Paste contract code from `contracts/DataVault.sol`

### Step 3: Compile

1. Click "Solidity Compiler" (S icon)
2. Select version: **0.8.24**
3. Click "Compile DataVault.sol"
4. Wait for ✓

### Step 4: Connect MetaMask

1. Click "Deploy & Run Transactions" (Ethereum icon)
2. Environment: **"Injected Provider - MetaMask"**
3. MetaMask popup → Click **"Connect"**
4. Verify shows:
   - Network: `Sepolia (11155111)`
   - Account: `0xYourAddress`
   - Balance: `0.05+ ETH`

### Step 5: Deploy

1. Contract: `DataVault`
2. Click **"Deploy"**
3. MetaMask popup → Click **"Confirm"**
4. Wait 15-30 seconds
5. See "Deployed Contracts" at bottom

### Step 6: Copy Address

```
Deployed Contracts
▼ DataVault
  at 0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99
  📋 (copy icon)
```

1. Click copy icon 📋
2. Save address for .env

---

## Test Functions

### Your Addresses

| Type | Address | Use For |
|------|---------|---------|
| Your Wallet | `0x5B38Da...eddC4` | Input in functions |
| Contract | `0x9D7f74d0...` | .env file only |

---

### Test 1: Check Owner

**Function:** `owner()`

```
Input: (none)
Click: call

Expected Output:
address: 0xYourWalletAddress
```

✅ Should return your wallet address

---

### Test 2: Check Paused

**Function:** `paused()`

```
Input: (none)
Click: call

Expected Output:
bool: false
```

✅ Should return `false`

---

### Test 3: Check Vault Exists

**Function:** `hasVault(address)`

```
Input: 0xYourWalletAddress
Click: call

Expected Output:
bool: false
```

✅ Should return `false` (no vault yet)

⚠️ **Use your WALLET address, NOT contract address!**

---

### Test 4: Create Vault

**Function:** `updateManifest(string)`

```
Input: QmTest123456
Click: transact (NOT call!)
MetaMask: Confirm
Wait: 15-30 sec

Expected Output:
✓ Transaction confirmed
```

✅ Vault created!

⚠️ **This costs gas!**

---

### Test 5: Verify Vault Created

**Function:** `hasVault(address)`

```
Input: 0xYourWalletAddress
Click: call

Expected Output:
bool: true
```

✅ Should now return `true`

---

### Test 6: Get Manifest CID

**Function:** `getManifestCID(address)`

```
Input: 0xYourWalletAddress
Click: call

Expected Output:
manifestCID: "QmTest123456"
lastUpdated: <timestamp>
```

✅ Should return your test CID

---

### Test 7: Add File

**Function:** `addFile(string)`

```
Input: QmFileHash123456789
Click: transact (NOT call!)
MetaMask: Confirm

Expected Output:
✓ Transaction confirmed
```

✅ File added!

---

### Test 8: Get File Count

**Function:** `getFileCount()`

```
Input: (none)
Click: call

Expected Output:
uint256: 1
```

✅ Should return `1`

---

### Test 9: Get User Files

**Function:** `getUserFiles()`

```
Input: (none)
Click: call

Expected Output:
Array of file records
```

✅ Should show your files

---

## Common Errors

### Error: "invalid address"

```
Error: invalid address (argument="address", value="")
```

**Wrong:**
```
Input: 0x9D7f74d0... (contract address)
```

**Correct:**
```
Input: 0x5B38Da... (your wallet address)
```

---

### Error: "Cannot start session"

```
Error: Cannot start session for 0x... (address is a contract)
```

**Solution:** Don't use "At Address" field. Use "Deployed Contracts" section.

---

### Error: "Insufficient funds"

```
Error: Insufficient funds for gas
```

**Solution:** Get more test ETH from faucet.

---

### Error: "Wrong network"

```
Error: Please switch to Sepolia network
```

**Solution:** Switch MetaMask to Sepolia.

---

## Testing Checklist

Complete in order:

- [ ] Get test ETH (0.05+)
- [ ] Add Sepolia to MetaMask
- [ ] Compile contract in Remix
- [ ] Deploy to Sepolia
- [ ] Copy contract address
- [ ] `owner()` returns your address
- [ ] `paused()` returns false
- [ ] `hasVault(address)` returns false
- [ ] `updateManifest(string)` succeeds
- [ ] `hasVault(address)` returns true
- [ ] `getManifestCID(address)` returns CID
- [ ] `addFile(string)` succeeds
- [ ] `getFileCount()` returns 1
- [ ] Add address to `.env`

---

## Gas Costs

| Function | Gas | Cost |
|----------|-----|------|
| Deploy | ~1,200,000 | ~0.01 ETH |
| updateManifest | ~80,000 | ~0.001 ETH |
| addFile | ~80,000 | ~0.001 ETH |
| hasVault | ~3,000 | Free |
| getManifestCID | ~3,000 | Free |
| getFileCount | ~3,000 | Free |

---

## After Testing

### Update .env

```bash
# Edit .env file
VITE_CONTRACT_ADDRESS=0xYourContractAddress
```

Example:
```bash
VITE_CONTRACT_ADDRESS=0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99
```

### Verify on Etherscan

1. Go to: https://sepolia.etherscan.io/
2. Paste your contract address
3. Check:
   - Contract exists
   - Transaction history
   - Events

### Run Your App

```bash
npm run dev
```

Open: http://localhost:3000

Test:
- [ ] Create vault
- [ ] Upload file
- [ ] Check IPFS status
- [ ] View transaction on Etherscan

---

## Quick Reference

### Contract Functions

| Function | Type | Input | Gas |
|----------|------|-------|-----|
| `owner()` | View | None | Free |
| `paused()` | View | None | Free |
| `hasVault(address)` | View | Wallet address | Free |
| `getManifestCID(address)` | View | Wallet address | Free |
| `getFileCount()` | View | None | Free |
| `getUserFiles()` | View | None | Free |
| `updateManifest(string)` | Transaction | IPFS CID | Paid |
| `addFile(string)` | Transaction | IPFS hash | Paid |

### Remix Buttons

| Button | Use When |
|--------|----------|
| `call` | Reading data (free) |
| `transact` | Writing data (costs gas) |

### Address Reference

| Type | Example |
|------|---------|
| Your Wallet | `0x5B38Da6a701c568545dCfcB03FcB875f56beddC4` |
| Contract | `0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99` |

**Always use your WALLET address as input!**

---

## Support

### Not Working?

1. Check MetaMask is unlocked
2. Check Sepolia network selected
3. Check you have test ETH
4. Clear browser cache
5. Try incognito mode

### Need Help?

1. Check Remix console for errors
2. Check MetaMask activity tab
3. Verify transaction on Etherscan
4. Check Sepolia network status