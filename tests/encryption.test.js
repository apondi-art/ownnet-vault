import { test, expect } from 'vitest';
import {
  generateKey,
  encryptText,
  decryptText,
  checkPasswordStrength,
  generateRandomPassword
} from '../src/utils/encryption.js';

test('password strength checker', () => {
  expect(checkPasswordStrength('weak')).toBe('weak');
  expect(checkPasswordStrength('Weak123')).toBe('weak');
  expect(checkPasswordStrength('StrongPass123!')).toBe('strong');
});

test('random password generation', () => {
  const password = generateRandomPassword(32);
  expect(password.length).toBe(32);
  expect(typeof password).toBe('string');
});

test('text encryption and decryption', async () => {
  const password = 'test-password-123';
  const originalText = 'Hello, this is a secret message!';
  
  const encrypted = await encryptText(originalText, password);
  expect(encrypted).not.toBe(originalText);
  expect(typeof encrypted).toBe('string');
  
  const decrypted = await decryptText(encrypted, password);
  expect(decrypted).toBe(originalText);
});

test('decryption with wrong password fails', async () => {
  const password = 'correct-password';
  const wrongPassword = 'wrong-password';
  const text = 'Secret data';
  
  const encrypted = await encryptText(text, password);
  
  await expect(decryptText(encrypted, wrongPassword)).rejects.toThrow();
});

test('different encryptions produce different outputs', async () => {
  const password = 'test-password';
  const text = 'Same message';
  
  const encrypted1 = await encryptText(text, password);
  const encrypted2 = await encryptText(text, password);
  
  expect(encrypted1).not.toBe(encrypted2);
  
  const decrypted1 = await decryptText(encrypted1, password);
  const decrypted2 = await decryptText(encrypted2, password);
  
  expect(decrypted1).toBe(text);
  expect(decrypted2).toBe(text);
});