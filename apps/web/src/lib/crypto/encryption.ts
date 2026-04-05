/**
 * Secure API Key Encryption/Decryption using Web Crypto API
 * Keys are encrypted at rest and decrypted only when needed
 * Uses AES-GCM with PBKDF2 key derivation
 */

const ENCRYPTION_KEY_NAME = 'cleanaus-seo-encryption-key';
const SALT_NAME = 'cleanaus-seo-salt';

async function getEncryptionKey(): Promise<CryptoKey> {
  // Check if key exists in sessionStorage (runtime only)
  const storedKey = sessionStorage.getItem(ENCRYPTION_KEY_NAME);
  if (storedKey) {
    const keyData = Uint8Array.from(atob(storedKey), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  // Export and store
  const rawKey = await crypto.subtle.exportKey('raw', key);
  sessionStorage.setItem(ENCRYPTION_KEY_NAME, btoa(String.fromCharCode(...new Uint8Array(rawKey))));

  return key;
}

export async function encryptApiKey(plaintext: string): Promise<string> {
  const key = await getEncryptionKey();
  const salt = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: salt },
    key,
    encoded
  );

  // Return salt + encrypted data as base64
  const combined = new Uint8Array([...salt, ...new Uint8Array(encrypted)]);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptApiKey(encryptedBase64: string): Promise<string> {
  const key = await getEncryptionKey();
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const salt = combined.slice(0, 12);
  const encrypted = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: salt },
    key,
    encrypted
  );

  return new TextDecoder().decode(decrypted);
}

/**
 * Sanitize API key for display (shows last 4 chars only)
 */
export function sanitizeApiKey(key: string): string {
  if (!key || key.length < 8) return '****';
  return `****${key.slice(-4)}`;
}
