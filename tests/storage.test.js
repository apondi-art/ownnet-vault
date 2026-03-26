import { test, expect } from 'vitest';
import {
  saveToLocalStorage,
  loadFromLocalStorage
} from '../src/utils/ipfs.js';

test('save and load from local storage', () => {
  const testData = new Uint8Array([1, 2, 3, 4, 5]);
  const key = 'test-key-' + Date.now();
  
  const result = saveToLocalStorage(key, testData);
  expect(result.local).toBe(true);
  expect(result.hash).toBe(key);
  
  const loaded = loadFromLocalStorage(key);
  expect(loaded).not.toBeNull();
  expect(loaded.length).toBe(testData.length);
});

test('load non-existent key returns null', () => {
  const loaded = loadFromLocalStorage('non-existent-key-12345');
  expect(loaded).toBeNull();
});