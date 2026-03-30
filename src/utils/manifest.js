const MANIFEST_VERSION = '1.0';

export function createManifest(vaultId) {
  return {
    version: MANIFEST_VERSION,
    vaultId: vaultId || generateVaultId(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    files: []
  };
}

export function generateVaultId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function addFileToManifest(manifest, fileMetadata) {
  const updated = { ...manifest };
  updated.files.push({
    id: fileMetadata.id || Date.now().toString(),
    name: fileMetadata.name,
    type: fileMetadata.type,
    size: fileMetadata.size,
    encryptedSize: fileMetadata.encryptedSize,
    ipfsHash: fileMetadata.ipfsHash,
    storageKey: fileMetadata.storageKey,
    timestamp: Date.now(),
    storageType: fileMetadata.storageType || 'IPFS',
    synced: false
  });
  updated.updatedAt = Date.now();
  return updated;
}

export function markFileAsSynced(manifest, fileId) {
  const updated = { ...manifest };
  const file = updated.files.find(f => f.id === fileId);
  if (file) {
    file.synced = true;
    file.syncedAt = Date.now();
  }
  updated.updatedAt = Date.now();
  return updated;
}

export function markAllFilesAsSynced(manifest) {
  const updated = { ...manifest };
  const now = Date.now();
  updated.files.forEach(file => {
    if (!file.synced) {
      file.synced = true;
      file.syncedAt = now;
    }
  });
  updated.updatedAt = now;
  return updated;
}

export function getUnsyncedFiles(manifest) {
  if (!manifest || !manifest.files) return [];
  return manifest.files.filter(f => !f.synced);
}

export function getSyncedFiles(manifest) {
  if (!manifest || !manifest.files) return [];
  return manifest.files.filter(f => f.synced);
}

export function removeFileFromManifest(manifest, fileId) {
  const updated = { ...manifest };
  updated.files = updated.files.filter(f => f.id !== fileId);
  updated.updatedAt = Date.now();
  return updated;
}

export function getManifestSummary(manifest) {
  if (!manifest) return null;
  
  return {
    fileCount: manifest.files.length,
    totalSize: manifest.files.reduce((sum, f) => sum + (f.size || 0), 0),
    totalEncryptedSize: manifest.files.reduce((sum, f) => sum + (f.encryptedSize || 0), 0),
    createdAt: manifest.createdAt,
    updatedAt: manifest.updatedAt,
    vaultId: manifest.vaultId
  };
}

export function validateManifest(manifest) {
  if (!manifest) return false;
  if (!manifest.version) return false;
  if (!manifest.vaultId) return false;
  if (!Array.isArray(manifest.files)) return false;
  return true;
}

export function exportManifest(manifest) {
  return JSON.stringify(manifest, null, 2);
}

export function importManifest(jsonString) {
  try {
    const manifest = JSON.parse(jsonString);
    if (!validateManifest(manifest)) {
      throw new Error('Invalid manifest format');
    }
    return manifest;
  } catch (error) {
    throw new Error('Failed to parse manifest: ' + error.message);
  }
}

export async function encryptManifest(manifest, password) {
  const { encryptText } = await import('./encryption');
  const jsonString = JSON.stringify(manifest);
  return await encryptText(jsonString, password);
}

export async function decryptManifest(encryptedManifest, password) {
  const { decryptText } = await import('./encryption');
  const jsonString = await decryptText(encryptedManifest, password);
  const manifest = JSON.parse(jsonString);
  if (!validateManifest(manifest)) {
    throw new Error('Invalid manifest after decryption');
  }
  return manifest;
}

export function getManifestIdForAddress(address) {
  return `manifest-${address.toLowerCase()}`;
}

export function getManifestIdForVault(vaultId) {
  return `manifest-vault-${vaultId}`;
}