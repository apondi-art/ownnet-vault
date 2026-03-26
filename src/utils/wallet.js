import { ethers } from 'ethers';

const STORAGE_KEY_WALLET = 'ownnet-vault-wallet';
const STORAGE_KEY_WALLET_ENCRYPTED = 'ownnet-vault-wallet-encrypted';

export async function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase
  };
}

export async function encryptWallet(privateKey, password) {
  const { encryptText } = await import('./encryption');
  return await encryptText(privateKey, password);
}

export async function decryptWallet(encryptedPrivateKey, password) {
  const { decryptText } = await import('./encryption');
  return await decryptText(encryptedPrivateKey, password);
}

export async function getWalletFromMnemonic(mnemonic) {
  try {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase
    };
  } catch (error) {
    throw new Error('Invalid recovery phrase');
  }
}

export async function getWalletFromPrivateKey(privateKey) {
  try {
    const wallet = new ethers.Wallet(privateKey);
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: null
    };
  } catch (error) {
    throw new Error('Invalid private key');
  }
}

export function storeWalletLocally(wallet, encryptedPrivateKey) {
  localStorage.setItem(STORAGE_KEY_WALLET, JSON.stringify({
    address: wallet.address,
    encryptedPrivateKey: encryptedPrivateKey
  }));
}

export function getStoredWallet() {
  const stored = localStorage.getItem(STORAGE_KEY_WALLET);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearStoredWallet() {
  localStorage.removeItem(STORAGE_KEY_WALLET);
  localStorage.removeItem(STORAGE_KEY_WALLET_ENCRYPTED);
}

export async function createAndStoreWallet(password) {
  const wallet = await generateWallet();
  const encryptedPrivateKey = await encryptWallet(wallet.privateKey, password);
  storeWalletLocally(wallet, encryptedPrivateKey);
  return wallet;
}

export async function restoreWalletFromMnemonic(mnemonic, password) {
  const wallet = await getWalletFromMnemonic(mnemonic);
  const encryptedPrivateKey = await encryptWallet(wallet.privateKey, password);
  storeWalletLocally(wallet, encryptedPrivateKey);
  return wallet;
}

export async function restoreWalletFromEncrypted(encryptedPrivateKey, password) {
  const privateKey = await decryptWallet(encryptedPrivateKey, password);
  const wallet = await getWalletFromPrivateKey(privateKey);
  return wallet;
}

export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}