/**
 * Shared filesystem helpers for skill scripts.
 */
import fs from 'node:fs';
import path from 'node:path';

export function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

export function mtime(filePath) {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

export function listMd(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md') && !f.startsWith('_'));
}

export function safeRead(filePath, { trim = false, fallback = '' } = {}) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return trim ? content.trim() : content;
  } catch {
    return fallback;
  }
}

export function firstExisting(dir, names) {
  for (const name of names) {
    const p = path.join(dir, name);
    if (exists(p)) return p;
  }
  return null;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}
