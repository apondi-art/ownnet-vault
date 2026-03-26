let ipfsClient = null;

export function initIPFS() {
  if (!ipfsClient) {
    console.warn('IPFS not configured. Using local storage fallback.');
    return null;
  }
  return ipfsClient;
}

export async function uploadToIPFS(data) {
  console.warn('IPFS upload not available. Using local storage.');
  const key = 'ipfs-' + Date.now();
  return saveToLocalStorage(key, data);
}

export async function downloadFromIPFS(hash) {
  console.warn('IPFS download not available. Using local storage.');
  return loadFromLocalStorage(hash);
}

export async function uploadFileToIPFS(file) {
  console.warn('IPFS upload not available. Using local storage.');
  const key = 'ipfs-' + Date.now();
  const data = await file.arrayBuffer();
  return saveToLocalStorage(key, new Uint8Array(data));
}

export function getIPFSGatewayURL(hash) {
  return `https://ipfs.io/ipfs/${hash}`;
}

// Fallback to local storage if IPFS is not configured
export function saveToLocalStorage(key, data) {
  try {
    const serialized = btoa(String.fromCharCode(...data));
    localStorage.setItem(key, serialized);
    return { hash: key, local: true };
  } catch (error) {
    console.error('Local storage error:', error);
    throw new Error('Failed to save to local storage');
  }
}

export function loadFromLocalStorage(key) {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;
    const binary = atob(serialized);
    const data = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      data[i] = binary.charCodeAt(i);
    }
    return data;
  } catch (error) {
    console.error('Local storage load error:', error);
    return null;
  }
}

export async function storeEncryptedFile(encryptedData) {
  try {
    return await saveToLocalStorage('vault-' + Date.now(), encryptedData);
  } catch (error) {
    throw error;
  }
}

