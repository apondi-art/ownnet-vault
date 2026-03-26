const encoder = new TextEncoder();
const decoder = new TextDecoder();

export async function generateKey(password) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('ownnet-vault-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
  
  return key;
}

export async function encryptData(data, password) {
  const key = await generateKey(password);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  let dataToEncrypt;
  if (data instanceof File) {
    const arrayBuffer = await data.arrayBuffer();
    dataToEncrypt = new Uint8Array(arrayBuffer);
  } else if (typeof data === 'string') {
    dataToEncrypt = encoder.encode(data);
  } else {
    dataToEncrypt = data;
  }
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataToEncrypt
  );
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return combined;
}

export async function decryptData(encryptedData, password) {
  const key = await generateKey(password);
  
  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return new Uint8Array(decrypted);
}

export async function encryptText(text, password) {
  const encrypted = await encryptData(text, password);
  return btoa(String.fromCharCode(...encrypted));
}

export async function decryptText(encryptedBase64, password) {
  const binary = atob(encryptedBase64);
  const encrypted = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    encrypted[i] = binary.charCodeAt(i);
  }
  const decrypted = await decryptData(encrypted, password);
  return decoder.decode(decrypted);
}

export async function encryptFile(file, password) {
  const encrypted = await encryptData(file, password);
  return {
    data: encrypted,
    name: file.name,
    type: file.type,
    size: file.size,
    encryptedSize: encrypted.length
  };
}

export async function decryptFile(encryptedData, password, fileName, fileType) {
  const decrypted = await decryptData(encryptedData, password);
  return new File([decrypted], fileName, { type: fileType });
}

export function generateRandomPassword(length = 32) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => charset[byte % charset.length]).join('');
}

export function checkPasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 4) return 'medium';
  return 'strong';
}

export async function exportKey(key) {
  const exported = await crypto.subtle.exportKey('raw', key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

export async function importKey(keyBase64) {
  const binary = atob(keyBase64);
  const keyData = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    keyData[i] = binary.charCodeAt(i);
  }
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    'AES-GCM',
    true,
    ['encrypt', 'decrypt']
  );
}

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'ownnet-vault-pepper');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password, storedHash) {
  const hash = await hashPassword(password);
  return hash === storedHash;
}

export async function deriveKeyFromPassword(password) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  const salt = encoder.encode('ownnet-vault-salt-v2');
  
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 150000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function generateRecoveryKey() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateKeyFromPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt || encoder.encode('ownnet-vault-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  return derivedKey;
}