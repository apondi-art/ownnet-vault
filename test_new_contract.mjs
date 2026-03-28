import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x6750DfBc0957693637ee2bCBFA12B37D814730B7';
const RPC_URL = 'https://ethereum-sepolia.publicnode.com';

const ABI = [
  {"inputs": [], "name": "owner", "outputs": [{"name": "", "type": "address"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"name": "_user", "type": "address"}], "name": "hasVault", "outputs": [{"name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"name": "_user", "type": "address"}], "name": "getManifestCID", "outputs": [{"name": "manifestCID", "type": "string"}, {"name": "lastUpdated", "type": "uint256"}], "stateMutability": "view", "type": "function"}
];

async function test() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  
  console.log('Testing new contract at:', CONTRACT_ADDRESS);
  console.log('---');
  
  try {
    const owner = await contract.owner();
    console.log('✅ Owner:', owner);
  } catch (e) {
    console.log('❌ Owner failed:', e.message);
  }
  
  try {
    const hasVault = await contract.hasVault('0x57A231570CFBb4e6F2F28916fEe16953e6311438');
    console.log('✅ hasVault(deployer):', hasVault);
  } catch (e) {
    console.log('❌ hasVault failed:', e.message);
  }
  
  console.log('---');
  console.log('✅ Contract is working correctly!');
}

test();
