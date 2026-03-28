import { ethers } from 'ethers';

const selectors = {
  'owner()': ethers.id('owner()').slice(0, 10),
  'hasVault(address)': ethers.id('hasVault(address)').slice(0, 10),
  'getManifestCID(address)': ethers.id('getManifestCID(address)').slice(0, 10),
  'updateManifest(string)': ethers.id('updateManifest(string)').slice(0, 10),
  'addFile(string)': ethers.id('addFile(string)').slice(0, 10),
  'paused()': ethers.id('paused()').slice(0, 10),
  'transfer(address,uint256)': ethers.id('transfer(address,uint256)').slice(0, 10),
  'balanceOf(address)': ethers.id('balanceOf(address)').slice(0, 10),
};

console.log("DataVault expected selectors:");
for (const [sig, sel] of Object.entries(selectors)) {
  console.log(`  ${sig}: ${sel}`);
}

console.log("\nDeployed contract has:");
console.log("  0x32f289cf");
console.log("  0x67272999");

// Try to find what these are
console.log("\nLooking up selectors...");
const found1 = Object.entries(selectors).find(([k, v]) => v === '0x32f289cf');
const found2 = Object.entries(selectors).find(([k, v]) => v === '0x67272999');
console.log(`  0x32f289cf = ${found1 ? found1[0] : 'Unknown'}`);
console.log(`  0x67272999 = ${found2 ? found2[0] : 'Unknown'}`);
