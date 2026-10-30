export function load<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback } catch { return fallback }
}
export function save(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ } }
export const KEYS = {
  theme: 'flowpilot.theme', workflow: 'flowpilot.builder', savedWorkflows: 'flowpilot.workflows',
  settings: 'flowpilot.settings', executions: 'flowpilot.executions', integrations: 'flowpilot.integrations',
  builderName: 'flowpilot.builderName',
}
