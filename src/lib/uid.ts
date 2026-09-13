// Safe unique-id generator with a fallback for environments where
// crypto.randomUUID is unavailable (e.g. some non-secure contexts).
export function uid(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
