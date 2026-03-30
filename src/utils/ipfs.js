const PINATA_API_URL = 'https://api.pinata.cloud';
let pinataConfigured = false;
let pinataJwt = null;

export function configurePinata(jwt) {
  if (jwt) {
    pinataJwt = jwt;
    pinataConfigured = true;
    return true;
  }
  const envJwt = import.meta.env.VITE_PINATA_JWT;
  if (envJwt) {
    pinataJwt = envJwt;
    pinataConfigured = true;
    return true;
  }
  return false;
}

export function isPinataConfigured() {
  return pinataConfigured || !!import.meta.env.VITE_PINATA_JWT;
}

export function getPinataConfig() {
  return {
    configured: pinataConfigured || !!import.meta.env.VITE_PINATA_JWT,
    jwt: pinataJwt || import.meta.env.VITE_PINATA_JWT
  };
}

async function uploadToPinata(data) {
  const jwt = pinataJwt || import.meta.env.VITE_PINATA_JWT;
  if (!jwt) {
    throw new Error('Pinata JWT not configured');
  }

  const formData = new FormData();
  const blob = new Blob([data], { type: 'application/octet-stream' });
  const file = new File([blob], `vault-${Date.now()}.enc`, { type: 'application/octet-stream' });
  formData.append('file', file);
  
  const metadata = JSON.stringify({
    name: `ownnet-vault-${Date.now()}`,
    keyvalues: {
      app: 'ownnet-vault',
      timestamp: Date.now().toString()
    }
  });
  formData.append('pinataMetadata', metadata);
  formData.append('pinataOptions', JSON.stringify({
    cidVersion: 1
  }));

  const response = await fetch(`${PINATA_API_URL}/pinning/pinFileToIPFS`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`
    },
    body: formData
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata upload failed: ${error}`);
  }

  const result = await response.json();
  return {
    hash: result.IpfsHash,
    pinSize: result.PinSize,
    timestamp: result.Timestamp
  };
}

async function downloadFromPinata(hash) {
  const fallbackGateways = [
    'https://ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://ipfs.gateway.ipfs.io/ipfs/'
  ];
  
  const configuredGateway = import.meta.env.VITE_PINATA_GATEWAY;
  if (configuredGateway && !configuredGateway.includes('gateway.pinata.cloud')) {
    fallbackGateways.unshift(configuredGateway);
  }
  
  const errors = [];
  
  for (const gateway of fallbackGateways) {
    const url = gateway.endsWith('/') ? `${gateway}${hash}` : `${gateway}/${hash}`;
    
    try {
      const response = await fetch(url, {
        mode: 'cors',
        headers: {
          'Accept': 'application/octet-stream'
        }
      });
      
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
      }
      
      errors.push(`${gateway}: ${response.status}`);
    } catch (error) {
      errors.push(`${gateway}: ${error.message}`);
    }
  }
  
  throw new Error(`Failed to download from IPFS. Tried gateways: ${errors.join(', ')}`);
}

export async function uploadToIPFS(data) {
  if (isPinataConfigured()) {
    try {
      const result = await uploadToPinata(data);
      return {
        hash: result.hash,
        local: false,
        pinSize: result.pinSize,
        timestamp: result.timestamp
      };
    } catch (error) {
      console.warn('IPFS upload failed, falling back to local storage:', error.message);
      return saveToLocalStorage('ipfs-' + Date.now(), data);
    }
  }
  
  console.warn('IPFS not configured. Using local storage fallback.');
  return saveToLocalStorage('ipfs-' + Date.now(), data);
}

export async function downloadFromIPFS(hash) {
  if (hash.startsWith('ipfs-') || hash.startsWith('vault-')) {
    return loadFromLocalStorage(hash);
  }
  
  if (isPinataConfigured()) {
    try {
      return await downloadFromPinata(hash);
    } catch (error) {
      console.warn('IPFS download failed:', error.message);
      return null;
    }
  }
  
  return loadFromLocalStorage(hash);
}

export function getIPFSGatewayURL(hash) {
  if (import.meta.env.VITE_PINATA_GATEWAY) {
    const gateway = import.meta.env.VITE_PINATA_GATEWAY;
    return gateway.endsWith('/') ? `${gateway}${hash}` : `${gateway}/${hash}`;
  }
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

export function saveToLocalStorage(key, data) {
  try {
    const serialized = btoa(String.fromCharCode(...data));
    localStorage.setItem(key, serialized);
    return { hash: key, local: true };
  } catch (error) {
    console.error('Local storage error:', error);
    
    const chunkSize = 1024 * 1024;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const serialized = btoa(String.fromCharCode(...chunk));
      chunks.push(serialized);
    }
    
    const metaKey = key + '-meta';
    const meta = {
      chunks: chunks.length,
      originalLength: data.length
    };
    localStorage.setItem(metaKey, JSON.stringify(meta));
    
    chunks.forEach((chunk, index) => {
      localStorage.setItem(`${key}-chunk-${index}`, chunk);
    });
    
    return { hash: key, local: true, chunked: true };
  }
}

export function loadFromLocalStorage(key) {
  try {
    const metaKey = key + '-meta';
    const meta = localStorage.getItem(metaKey);
    
    if (meta) {
      const { chunks, originalLength } = JSON.parse(meta);
      const combined = new Uint8Array(originalLength);
      let offset = 0;
      
      for (let i = 0; i < chunks; i++) {
        const chunkData = localStorage.getItem(`${key}-chunk-${i}`);
        if (!chunkData) return null;
        
        const binary = atob(chunkData);
        for (let j = 0; j < binary.length; j++) {
          combined[offset + j] = binary.charCodeAt(j);
        }
        offset += binary.length;
      }
      
      return combined;
    }
    
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

export async function deleteFromLocalStorage(key) {
  localStorage.removeItem(key);
  
  const metaKey = key + '-meta';
  const meta = localStorage.getItem(metaKey);
  
  if (meta) {
    const { chunks } = JSON.parse(meta);
    localStorage.removeItem(metaKey);
    for (let i = 0; i < chunks; i++) {
      localStorage.removeItem(`${key}-chunk-${i}`);
    }
  }
}

export async function storeEncryptedFile(encryptedData) {
  return await uploadToIPFS(encryptedData);
}

export async function initIPFS() {
  if (isPinataConfigured()) {
    return true;
  }
  console.warn('IPFS not configured. Using local storage fallback.');
  return false;
}

export function unpinFromPinata(hash) {
  const jwt = pinataJwt || import.meta.env.VITE_PINATA_JWT;
  if (!jwt) return false;
  
  return fetch(`${PINATA_API_URL}/pinning/unpin/${hash}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${jwt}`
    }
  }).then(res => res.ok).catch(() => false);
}