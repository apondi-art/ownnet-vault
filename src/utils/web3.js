const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'YOUR_CONTRACT_ADDRESS';

console.log('Contract Address:', CONTRACT_ADDRESS);
console.log('Contract Configured:', CONTRACT_ADDRESS !== 'YOUR_CONTRACT_ADDRESS');

const CONTRACT_ABI = [
  {
    "inputs": [{"name": "_manifestCID", "type": "string"}],
    "name": "updateManifest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_user", "type": "address"}],
    "name": "getManifestCID",
    "outputs": [{"name": "manifestCID", "type": "string"}, {"name": "lastUpdated", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_user", "type": "address"}],
    "name": "hasVault",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_ipfsHash", "type": "string"}],
    "name": "addFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserFiles",
    "outputs": [{"name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "index", "type": "uint256"}],
    "name": "deleteFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFileCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const SEPOLIA_RPC = 'https://ethereum-sepolia.publicnode.com';
let provider = null;
let signer = null;
let contract = null;
let readOnlyContract = null;

async function getReadOnlyProvider() {
  const { ethers } = await import('ethers');
  return new ethers.JsonRpcProvider(SEPOLIA_RPC);
}

async function getReadOnlyContract() {
  if (!readOnlyContract) {
    const { ethers } = await import('ethers');
    const rpcProvider = await getReadOnlyProvider();
    readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, rpcProvider);
  }
  return readOnlyContract;
}

export async function connectWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask');
  }
  
  try {
    const { ethers } = await import('ethers');
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    signer = await provider.getSigner();
    
    const address = await signer.getAddress();
    
    const network = await provider.getNetwork();
    if (network.chainId !== 11155111n) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }],
        });
      } catch (switchError) {
        console.warn('Please add Sepolia network to MetaMask');
      }
    }
    
    return address;
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
}

export async function getContract() {
  if (!contract && signer) {
    const { ethers } = await import('ethers');
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  }
  return contract;
}

export async function updateManifestOnChain(manifestCID) {
  try {
    const contract = await getContract();
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    
    const tx = await contract.updateManifest(manifestCID);
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error) {
    console.error('Update manifest error:', error);
    throw error;
  }
}

export async function getManifestFromChain(address) {
  try {
    const contract = signer ? await getContract() : await getReadOnlyContract();
    if (!contract) {
      return null;
    }
    
    const [manifestCID, lastUpdated] = await contract.getManifestCID(address);
    
    if (!manifestCID || manifestCID === '') {
      return null;
    }
    
    return {
      manifestCID,
      lastUpdated: Number(lastUpdated)
    };
  } catch (error) {
    console.error('Get manifest error:', error);
    return null;
  }
}

export async function hasVaultOnChain(address) {
  try {
    const contract = signer ? await getContract() : await getReadOnlyContract();
    if (!contract) {
      return false;
    }
    
    return await contract.hasVault(address);
  } catch (error) {
    console.error('Has vault error:', error);
    return false;
  }
}

export async function registerFileHash(ipfsHash) {
  try {
    const contract = await getContract();
    if (!contract) {
      throw new Error('Contract not initialized');
    }
    
    const tx = await contract.addFile(ipfsHash);
    const receipt = await tx.wait();
    
    return receipt.hash;
  } catch (error) {
    console.error('Register file error:', error);
    throw error;
  }
}

export async function getUserFiles(address) {
  try {
    const contract = signer ? await getContract() : await getReadOnlyContract();
    if (!contract) {
      return [];
    }
    
    const targetAddress = address || (signer? await signer.getAddress() : null);
    if (!targetAddress) {
      return [];
    }
    
    const files = await contract.getUserFiles(targetAddress);
    return files;
  } catch (error) {
    console.error('Get files error:', error);
    return [];
  }
}

export async function getWalletAddress() {
  if (!signer) {
    return null;
  }
  return await signer.getAddress();
}

export async function isWalletConnected() {
  return signer !== null;
}

export function disconnectWallet() {
  provider = null;
  signer = null;
  contract = null;
}

export async function getBalance() {
  if (!provider || !signer) {
    return null;
  }
  const { ethers } = await import('ethers');
  const balance = await provider.getBalance(await signer.getAddress());
  return ethers.formatEther(balance);
}

export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function toBytes32(str) {
  return str;
}

export function isContractConfigured() {
  return CONTRACT_ADDRESS !== 'YOUR_CONTRACT_ADDRESS';
}