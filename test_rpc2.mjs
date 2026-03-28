import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99';
const USER_ADDRESS = '0xC17b9058356403F431d556354b0643DDBCa42B3c';

const ABI = [
  {"inputs": [], "name": "owner", "outputs": [{"name": "", "type": "address"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"name": "_user", "type": "address"}], "name": "hasVault", "outputs": [{"name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"name": "_user", "type": "address"}], "name": "getManifestCID", "outputs": [{"name": "manifestCID", "type": "string"}, {"name": "lastUpdated", "type": "uint256"}], "stateMutability": "view", "type": "function"}
];

async function test() {
  // Test with Ankr public RPC
  const rpcs = [
    'https://rpc.ankr.com/eth_sepolia',
    'https://eth-sepolia.public.blastapi.io',
    'https://sepolia.drpc.org'
  ];

  for (const rpc of rpcs) {
    try {
      console.log(`\nTesting RPC: ${rpc}`);
      const provider = new ethers.JsonRpcProvider(rpc);
      
      // First check chain ID
      const network = await provider.getNetwork();
      console.log('Chain ID:', network.chainId.toString());
      
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      // Test owner function first
      const owner = await contract.owner();
      console.log('Contract owner:', owner);
      
      const hasVault = await contract.hasVault(USER_ADDRESS);
      console.log('Has vault:', hasVault);
      
      if (hasVault) {
        const result = await contract.getManifestCID(USER_ADDRESS);
        console.log('Manifest CID:', result[0]);
      }
      return;
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

test();
