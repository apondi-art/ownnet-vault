# Deployment Guide

This guide walks you through deploying OwnNet Vault to production.

## Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask wallet with test ETH
- GitHub account
- Vercel account (free)

## Step 1: Deploy Smart Contract (Optional)

### Using Remix IDE

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

### Update Contract Address

Edit `src/utils/web3.js`:

```javascript
const CONTRACT_ADDRESS = '0xYourContractAddressHere';
```

## Step 2: Build Frontend

```bash
npm run build
```

This creates an optimized build in `dist/`.

## Step 3: Deploy to Vercel

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

## Step 4: Configure Environment

In Vercel dashboard:

1. Go to Settings > Environment Variables
2. Add:
   - `VITE_CONTRACT_ADDRESS` = your contract address
   - `VITE_INFURA_PROJECT_ID` = your Infura project ID (optional)
   - `VITE_INFURA_PROJECT_SECRET` = your Infura secret (optional)

## Step 5: Test Deployment

1. Visit your deployed URL
2. Test all features:
   - Create vault
   - Upload file
   - Download file
   - Connect wallet
   - Register file on blockchain

## Step 6: Verify Smart Contract (Optional)

1. Go to https://sepolia.etherscan.io/
2. Search your contract address
3. Click "Contract" > "Verify and Publish"
4. Enter:
   - Compiler: v0.8.19
   - License: MIT
   - Paste contract source code

## Cost Estimation

### Sepolia Testnet

| Operation | Gas Cost (approx) |
|-----------|-------------------|
| Deploy contract | ~0.01 ETH |
| Add file | ~0.001 ETH |
| Get files | Free (view) |

### Mainnet (Not Recommended for Testing)

| Operation | Gas Cost (approx) |
|-----------|-------------------|
| Deploy contract | ~0.5-1 ETH |
| Add file | ~0.01-0.05 ETH |

## Security Checklist

Before deploying:

- [ ] Strong passwords enforced
- [ ] No sensitive data in environment variables
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Contract verified on Etherscan
- [ ] Test thoroughly on testnet first

## Monitoring

### Contract Events

Monitor your contract:

```javascript
// In your app
contract.on('FileAdded', (user, ipfsHash, timestamp) => {
  console.log('New file:', user, ipfsHash, timestamp);
});
```

### Frontend Errors

Use error tracking:
- Sentry
- LogRocket
- Bugsnag

## Backup Strategy

### User Data

- Users must remember their passwords
- No server-side backup possible (by design)

### Contract

- Save deployment transaction hash
- Keep contract source code backed up
- Document all functions

## Scaling Considerations

### IPFS

For production:
- Use dedicated IPFS node
- Pin files with Pinata or Infura
- Consider file size limits

### Frontend

- Use CDN (automatic on Vercel)
- Lazy load components
- Optimize images

## Support

If deployment fails:

1. Check Vercel build logs
2. Verify environment variables
3. Test locally with `npm run build && npm run preview`
4. Check browser console for errors