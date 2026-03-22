const ITERATIONS = 100000;
const HASH_LENGTH = 256;
const ALGORITHM = 'SHA-256';

export function generateSalt() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, '0')
  ).join('');
}

export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: hexToBytes(salt),
      iterations: ITERATIONS,
      hash: ALGORITHM,
    },
    keyMaterial,
    HASH_LENGTH
  );

  const hex = bytesToHex(derivedBits);
  return `pbkdf2:${salt}:${hex}`;
}

export async function verifyPassword(password, storedHash) {
  const parts = storedHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'pbkdf2') {
    return false;
  }

  const salt = parts[1];
  const reHashed = await hashPassword(password, salt);
  // Constant-time comparison
  if (reHashed.length !== storedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < reHashed.length; i++) {
    diff |= reHashed.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return diff === 0;
}

export function isLegacyHash(hash) {
  return !hash.startsWith('pbkdf2:');
}
