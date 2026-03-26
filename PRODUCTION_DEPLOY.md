# Production Deployment Guide

Complete guide to deploy OwnNet Vault to production.

---

## Prerequisites

- Node.js 18+
- Pinata account (free tier: 1GB)
- GitHub account
- Vercel account (free)
- MetaMask with Sepolia ETH (for blockchain sync)

---

## Step 1: Configure Pinata (IPFS Storage)

### Create Pinata Account

1. Go to https://app.pinata.cloud/
2. Sign up (free tier: 1GB storage)
3. Verify email

### Generate JWT Token

1. Click profile icon (top right)
2. Select **API Keys**
3. Click **New Key**
4. Configure:

```
Key Name: ownnet-vault-production

Permissions: Custom
☑ pinFileToIPFS
☑ pinJSONToIPFS

Usage Limits: Limited
Max uses: 10000 (or higher for production)
```

5. Click **Create Key**
6. **Copy the JWT immediately** (starts with `eyJ...`) - you won't see it again

### Verify JWT Works

```bash
curl -X GET "https://api.pinata.cloud/data/testAuthentication" \
  -H "Authorization: Bearer YOUR_JWT_HERE"
```

Expected: `{"message":"Congratulations! You are winning!"}`

---

## Step 2: Configure Environment

### Create .env File

```bash
cp .env.example .env
```

### Edit .env

```env
# Required - Pinata JWT for IPFS storage
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_JWT_HERE

# Optional - Custom IPFS gateway
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Optional - Smart contract for cross-device sync
VITE_CONTRACT_ADDRESS=
```

### Test Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and verify:
- [ ] Can create vault
- [ ] Can upload file
- [ ] Status shows "IPFS" (not "localStorage")
- [ ] Can download file

---

## Step 3: Deploy Smart Contract (Optional but Recommended)

### Why Deploy?

Enables cross-device sync via blockchain. Users can access files from any device with their recovery phrase.

### Step 3.1: Add Sepolia Network to MetaMask

Open MetaMask → Click network dropdown → **Add Network** → Enter manually:

| Field | Value |
|-------|-------|
| Network Name | Sepolia |
| RPC URL | https://rpc.sepolia.org |
| Chain ID | 11155111 |
| Currency Symbol | SepoliaETH |
| Block Explorer | https://sepolia.etherscan.io |

Click **"Save"**

---

### Step 3.2: Get Free Test ETH

Choose one of the following faucets:

#### Option A: Alchemy Faucet (Recommended - Fastest)

1. Go to: https://sepoliafaucet.com/
2. Sign in with Alchemy account (free to create)
3. Paste your MetaMask wallet address
4. Click **"Send Me ETH"**
5. Receive 0.5 ETH instantly

#### Option B: Infura Faucet

1. Go to: https://www.infura.io/faucet/sepolia
2. Sign in with Infura account (free to create)
3. Paste your wallet address
4. Click **"Send Me ETH"**
5. Receive 0.5 ETH

#### Option C: QuickNode Faucet

1. Go to: https://faucet.quicknode.com/ethereum/sepolia
2. Paste your wallet address
3. Complete captcha
4. Click **"Send Me ETH"**
5. Receive test ETH (amount varies)

#### Option D: Polygon Faucet (Alternative)

1. Go to: https://faucet.polygon.technology/
2. Select "Sepolia" network
3. Paste wallet address
4. Complete verification
5. Receive test ETH

**Note:** You need ~0.01 ETH to deploy the contract. Each faucet gives 0.5 ETH per day.

---

### Step 3.3: Deploy Contract on Remix

#### Open Remix IDE

Go to: https://remix.ethereum.org/

#### Create Contract File

1. Click **"File Explorers"** (folder icon, left sidebar)
2. Click **"Create New File"** icon
3. Name it: `DataVault.sol`
4. Copy content from your local `contracts/DataVault.sol`
5. Paste into Remix

#### Compile the Contract

1. Click **"Solidity Compiler"** (S icon, left sidebar)
2. Set compiler version: `0.8.24`
3. Click **"Compile DataVault.sol"**
4. Wait for green checkmark ✓

#### Deploy to Sepolia

1. Click **"Deploy & Run Transactions"** (Ethereum logo, left sidebar)
2. Set **Environment**: `Injected Provider - MetaMask`
3. MetaMask popup → Click **"Connect"**
4. Verify **Network** shows: `Sepolia (11155111)`
5. Verify **Account** shows your wallet address
6. Verify balance shows ~0.5 ETH
7. Select **Contract**: `DataVault`
8. Click **"Deploy"**
9. MetaMask popup → Click **"Confirm"**
10. Wait 15-30 seconds for deployment

#### Copy Contract Address

1. Look at bottom of Remix (Deployed Contracts section)
2. Find: `DataVault at 0xAbC123...789Def`
3. Click **copy icon** next to address
4. Save this address!

### Step 3.4: Add Contract Address to .env

1. Copy the deployed contract address from Remix
2. Add to your `.env` file:

```env
VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

Example:
```env
VITE_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```

### Step 3.5: Verify Deployment on Etherscan

1. Go to: https://sepolia.etherscan.io/
2. Paste your contract address
3. You should see:
   - Contract creation transaction
   - Contract balance (0 ETH)
   - Transaction count
4. Click on transaction hash to see details

---

## Step 4: Push to GitHub

### Initialize Git (if not done)

```bash
git init
git add .
git commit -m "Initial commit - OwnNet Vault ready for production"
```

### Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ownnet-vault`
3. Visibility: Public or Private
4. **Don't** initialize with README (already have one)
5. Click "Create repository"

### Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/ownnet-vault.git
git branch -M main
git push -u origin main
```

---

## Step 5: Deploy to Vercel

### Connect GitHub to Vercel

1. Go to https://vercel.com/
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your `ownnet-vault` repository

### Configure Project

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Add Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables**:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_PINATA_JWT` | `eyJhbGciOi...` | Production, Preview, Development |
| `VITE_PINATA_GATEWAY` | `https://gateway.pinata.cloud/ipfs/` | Production, Preview, Development |
| `VITE_CONTRACT_ADDRESS` | `0xYourContract...` | Production, Preview, Development |

### Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Vercel provides URL: `https://ownnet-vault.vercel.app`

---

## Step 6: Configure Domain (Optional)

### Add Custom Domain

1. In Vercel, go to **Settings** → **Domains**
2. Add your domain (e.g., `vault.yourdomain.com`)
3. Configure DNS:

```
Type: CNAME
Name: vault
Value: cname.vercel-dns.com
```

4. Wait for SSL certificate (automatic)

---

## Step 7: Production Checklist

### Security

- [ ] JWT not in source code
- [ ] Contract address correct
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] No console.log errors in production
- [ ] Environment variables set in Vercel

### Functionality

- [ ] File upload works
- [ ] Files store to IPFS (check Pinata dashboard)
- [ ] File download works
- [ ] Password protection works
- [ ] Recovery phrase shown
- [ ] Vault lock/unlock works
- [ ] Cross-device sync (if contract deployed)

### Performance

- [ ] Build size reasonable (< 5MB)
- [ ] First load fast (< 3s)
- [ ] File upload responsive

---

## Step 8: Monitor Production

### Pinata Dashboard

1. Go to https://app.pinata.cloud/
2. Monitor:
   - Total storage used
   - Bandwidth usage
   - File count

### Vercel Dashboard

1. Go to https://vercel.com/
2. Monitor:
   - Deployment status
   - Function logs
   - Analytics

### Blockchain (if contract deployed)

1. Go to https://sepolia.etherscan.io/
2. Monitor:
   - Transaction count
   - Gas usage
   - Contract interactions

---

## Production Costs

### Free Tier Limits

| Service | Free Limit | When to Upgrade |
|---------|------------|-----------------|
| Vercel | 100GB bandwidth, 100 builds/month | Heavy traffic |
| Pinata | 1GB storage | > 1GB uploaded |
| Sepolia ETH | Free test ETH | Only for testing |

### When to Upgrade Pinata

| Users | Files/User | Storage | Plan Needed |
|-------|------------|---------|-------------|
| 10 | 10MB each | 100MB | Free |
| 100 | 10MB each | 1GB | Free (limit) |
| 100 | 50MB each | 5GB | Starter ($20/mo) |
| 1000 | 50MB each | 50GB | Starter ($20/mo) |

---

## Mainnet Deployment (Optional)

### ⚠️ Important

Production use requires Ethereum mainnet. This costs real ETH.

### Steps

1. Get mainnet ETH (buy from exchange)
2. Deploy contract to mainnet (same Remix process)
3. Update `VITE_CONTRACT_ADDRESS` in Vercel
4. Redeploy

### Estimated Costs

| Operation | Gas (Mainnet) | Cost @ 20 Gwei |
|-----------|---------------|----------------|
| Deploy contract | ~1,200,000 gas | ~0.024 ETH (~$60) |
| Update manifest | ~80,000 gas | ~0.0016 ETH (~$4) |
| Add file | ~80,000 gas | ~0.0016 ETH (~$4) |

### Recommendations

- Start with Sepolia testnet
- Test thoroughly
- Preview mainnet deployment
- Consider L2 (Polygon, Base) for lower costs

---

## Troubleshooting

### Remix Deployment Issues

#### "MetaMask not detected"

1. Install MetaMaskextension: https://metamask.io/
2. Refresh Remix page
3. Click browser extension icon to unlock MetaMask
4. Try connecting again

#### "Insufficient funds for gas"

1. Check MetaMask balance
2. If 0 ETH, get more from faucet:
   - https://sepoliafaucet.com/
   - https://www.infura.io/faucet/sepolia
   - https://faucet.quicknode.com/ethereum/sepolia
3. Wait 1-2 minutes for ETH to arrive
4. Check balance: MetaMask → Sepolia network → Should show ~0.5 ETH

#### "Wrong network" error

1. Open MetaMask
2. Click network dropdown (top)
3. Select **Sepolia**
4. If not visible, add manually:
   - Network Name: Sepolia
   - RPC URL: https://rpc.sepolia.org
   - Chain ID: 11155111
   - Symbol: SepoliaETH

#### Contract compilation failed

```
Error: Compiled contract code size exceeds limit
```

Solution: Contract is too large. Our DataVault.sol is optimized and should compile fine.

#### Transaction pending forever

1. Check gas price: Remix → Deploy → Advanced → Gas Limit
2. Increase gas limit to 3,000,000
3. Check Sepolia status: https://status.sepolia.dev/
4. Try again later if network congested

#### Cannot find deployed contract

1. Check Remix bottom panel for "Deployed Contracts"
2. Click arrow to expand
3. If missing, try deploying again
4. Check transaction on Etherscan for address

---

### Testnet Faucet Issues

#### Faucet says "try again later"

Most faucets have rate limits:
- Alchemy: 0.5 ETH per day
- Infura: 0.5 ETH per day
- Try a different faucet
- Wait24 hours

#### Faucet requires social login

Some faucets require:
- GitHub account
- Twitter account
- Discord account

Alternative: Use multiple faucets, no login required:
- https://faucet.quicknode.com/ethereum/sepolia (no login)

#### Faucet transaction not received

1. Check correct wallet address pasted
2. Wait 5-10 minutes
3. Check MetaMask activity tab
4. View transaction hash from faucet
5. Check Sepolia Etherscan for address

---

### Files Not Uploading to IPFS

```bash
# Check JWT is valid
curl -X GET "https://api.pinata.cloud/data/testAuthentication" \
  -H "Authorization: Bearer YOUR_JWT"

# If error, generate new JWT in Pinata dashboard

# Verify in Vercel logs
# Settings → Environment Variables → Check VITE_PINATA_JWT
```

### Build Fails on Vercel

```bash
# Test locally first
npm run build

# If error, fix locally then push
npm run build
# If success, push to GitHub
git add .
git commit -m "Fix build errors"
git push
```

### Cross-Device Sync Not Working

1. Check MetaMask connected
2. Verify Sepolia network
3. Check `VITE_CONTRACT_ADDRESS` in Vercel
4. Verify contract on Etherscan
5. Check browser console for errors

### Environment Variables Not Working

1. Vercel requires rebuild after env changes
2. Go to Deployments → Redeploy
3. Or push new commit to trigger rebuild

---

## Rollback Procedure

### If Deployment Fails

1. Go to Vercel dashboard
2. Find last working deployment
3. Click "..." → "Promote to Production"

### If Contract Has Issues

1. Contract is immutable - cannot change
2. Deploy new contract
3. Update `VITE_CONTRACT_ADDRESS`
4. Users must reconnect wallet
5. Old manifests still accessible via IPFS CID

---

## Support

### Common Issues

| Issue | Solution |
|-------|----------|
| JWT authentication failed | Regenerate JWT in Pinata |
| Storage limit reached | Upgrade Pinata plan or delete files |
| Build timeout | Reduce bundle size |
| Slow uploads | Check file size, optimize images |

### Resources

- Pinata Docs: https://docs.pinata.cloud/
- Vercel Docs: https://vercel.com/docs
- Etherscan: https://sepolia.etherscan.io/
- Remix IDE: https://remix.ethereum.org/