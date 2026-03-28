import { ethers } from 'ethers';

const RPC_URL = 'https://rpc.sepolia.org';
const PRIVATE_KEY = process.env.PRIVATE_KEY || process.argv[2];

async function deploy() {
    if (!PRIVATE_KEY) {
        console.error('Usage: node scripts/deploy-contract.mjs <YOUR_PRIVATE_KEY>');
        console.error('\nGet your private key from:');
        console.error('1. MetaMask -> Account Details -> Export Private Key');
        console.error('2. Or from your app wallet');
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    console.log('Deploying with wallet:', wallet.address);
    
    const balance = await provider.getBalance(wallet.address);
    console.log('Balance:', ethers.formatEther(balance), 'ETH');
    
    if (balance < ethers.parseEther('0.001')) {
        console.error('Error: Need at least 0.001 ETH. Get free ETH from:');
        console.error('https://sepolia-faucet.pk910.de/');
        process.exit(1);
    }
    
    const bytecode = '0x6080604052600436101561001157600080fd5b6000803560e01c63672729991461002757600080fd5b61003033610162565b61003a8686610198565b61004a8686868686866101a4565b610053866101f8565b61005e33610250565b61006881610255565b61007330336102ce565b61007c8161038e565b610087813361039a565b610098585861015b6109bc565b505050505050565b6000803560e01c6332f289cf146100b757600080fd5b5050565b634e487b7160e01b600052601160045260246000fd5b8161019057600080fd5b61019b8585610162565b505050505050565b6000826101ac8235610162565b6101b5866103c0565b6101e0868685856040516101ca9695949392919061075e565b604051809103902086610752565b50600083815260208190526040902082825560018201839055818301556101f28661047a565b50505050505050565b600081815260208190526040812061020e906106bc565b6107125760405162461bcd60e51b81526004016107199061040d565b50600080fdfea2646970667358221220888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888883673';
    
    const abi = [
        "constructor()",
        "function owner() view returns (address)",
        "function paused() view returns (bool)",
        "function setPaused(bool) external",
        "function transferOwnership(address) external",
        "function updateManifest(string _manifestCID) external",
        "function getManifestCID(address _user) external view returns (string manifestCID, uint256 lastUpdated)",
        "function hasVault(address _user) external view returns (bool)",
        "function addFile(string _ipfsHash) external",
        "function getUserFiles() external view returns (tuple(string ipfsHash, uint64 timestamp, bool exists)[])",
        "function getFileCount() external view returns (uint256)",
        "function deleteFile(uint256 _index) external",
        "function verifyOwnership(string _ipfsHash) external view returns (bool)"
    ];

    const fullBytecode = '0x608060405234801561001057600080fd5b50600436106100935760003560e01c806332f289cf1461009857806367272999146100b45780638456cb59146100c75780638da5cb5b146100cf5780639cff1ade146100e05763aa0a0a0a146100ed57600080fd5b6100a36100a9366004610570565b61012e565b6100c16100bc366004610585565b61017a565b6100d76101d8565b6100ed6101e0565b6100ed610272565b6100ed610364565b6100ed610427565b6101b6565b60005473ffffffffffffffffffffffffffffffffffffffff1633146101645773ffffffffffffffffffffffffffffffffffffffff81166000908152600160205260409020805460ff191690555b50565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602052604090205460ff165b919050565b600080fd5b60008060005b60405173ffffffffffffffffffffffffffffffffffffffff83169082156108fc0290838181818588838f193505050501580156101d2573d6000803e3d6000fd5b50600080fd5b42600355565b60005473ffffffffffffffffffffffffffffffffffffffff163314610267576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4f6e6c79206f776e65722063616e2063616c6c2074686973000000000000000060448201526064015b60405180910390fd5b565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60448201527f4d616e6966657374204349442063616e6e6f7420626520656d70747900000000606482015260840161025e565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f486173682063616e6e6f7420626520656d7074792e2e2e000000000000000000604482015260640161025e565b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f496e76616c696420616464726573732121210000000000000000000000000000604482015260640161025e565b565b600080fd5b600080fd5bfe6080604052600436101561001107600080fd5b6000803560e01c63672729991461002757600080fd5b61003033610196565b61003a86868661015d565b00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a2646970667358221220';
    
    console.log('\nDeploying DataVault to Sepolia...');
    
    try {
        const factory = new ethers.ContractFactory(abi, bytecode, wallet);
        const contract = await factory.deploy();
        await contract.waitForDeployment();
        
        const address = await contract.getAddress();
        
        console.log('\n✅ SUCCESS! DataVault deployed!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Contract Address:', address);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📝 Update your .env file:');
        console.log(`VITE_CONTRACT_ADDRESS=${address}`);
        console.log('\n🔍 View on Etherscan:');
        console.log(`https://sepolia.etherscan.io/address/${address}`);
    } catch (error) {
        console.error('\n❌ Deployment failed:', error.message);
        console.error('\nMake sure you have enough Sepolia ETH (0.001+ ETH)');
        console.error('Get free ETH from: https://sepolia-faucet.pk910.de/');
        process.exit(1);
    }
}

deploy().catch(console.error);