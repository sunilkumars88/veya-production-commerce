import { db } from './db.js';

const cache = new Map<string, string>();
let lastFetch = 0;
const TTL = 60_000;

export async function getSetting(key: string, fallback = ''): Promise<string> {
  if (Date.now() - lastFetch > TTL) {
    const all = await db.setting.findMany();
    cache.clear();
    for (const s of all) cache.set(s.key, s.value);
    lastFetch = Date.now();
  }
  return cache.get(key) ?? fallback;
}

export async function getSettingInt(key: string, fallback: number): Promise<number> {
  const val = await getSetting(key);
  const n = parseInt(val, 10);
  return isNaN(n) ? fallback : n;
}

export async function getSettingBool(key: string, fallback = false): Promise<boolean> {
  const val = await getSetting(key);
  if (!val) return fallback;
  return val === 'true' || val === '1';
}
