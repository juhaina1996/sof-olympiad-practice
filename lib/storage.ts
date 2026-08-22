import type { DeviceProgress } from "@/types";

const STORAGE_KEY = "sof-practice:progress:v1";

export function loadProgress(): DeviceProgress {
  if (typeof window === "undefined") return { attempts: [], sessions: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DeviceProgress) : { attempts: [], sessions: [] };
  } catch {
    return { attempts: [], sessions: [] };
  }
}

export function saveProgress(progress: DeviceProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage may be unavailable — fail silently, practice still works this session.
  }
}
