const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99';
const USER_ADDRESS = '0xC17b9058356403F431d556354b0643DDBCa42B3c';

const ABI = [
  {"inputs": [{"name": "_user", "type": "address"}], "name": "hasVault", "outputs": [{"name": "", "type": "bool"}], "stateMutability": "view", "type": "function"},
  {"inputs": [{"name": "_user", "type": "address"}], "name": "getManifestCID", "outputs": [{"name": "manifestCID", "type": "string"}, {"name": "lastUpdated", "type": "uint256"}], "stateMutability": "view", "type": "function"}
];

async function test() {
  const rpcs = [
    'https://rpc.sepolia.org',
    'https://ethereum-sepolia.publicnode.com',
    'https://ethereum.publicnode.com'
  ];

  for (const rpc of rpcs) {
    try {
      console.log(`\nTesting RPC: ${rpc}`);
      const provider = new ethers.JsonRpcProvider(rpc);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      
      const hasVault = await contract.hasVault(USER_ADDRESS);
      console.log('Has vault:', hasVault);
      
      if (hasVault) {
        const result = await contract.getManifestCID(USER_ADDRESS);
        console.log('Manifest CID:', result[0]);
        console.log('Last Updated:', new Date(Number(result[1]) * 1000).toISOString());
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

test();
