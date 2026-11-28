// Pure scroll helpers for the /v2/ continuous ghost row (no DOM).
export const WHEEL_MAX = 32; // px cap per wheel event
export const WHEEL_MS = 220; // wheel-glide duration in ms
export const GLIDE_MS = 900; // click-glide duration in ms

export function easeInOut(t) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export function easeOut(t) {
  const c = Math.max(0, Math.min(1, t));
  return 1 - (1 - c) ** 3;
}

export function glideAt(from, to, elapsedMs, durationMs, ease = easeInOut) {
  if (durationMs <= 0 || elapsedMs >= durationMs) return to;
  if (elapsedMs <= 0) return from;
  return from + (to - from) * ease(elapsedMs / durationMs);
}

export function clickStep(viewW, pitch) {
  if (!(pitch > 0)) return 0;
  return Math.max(1, Math.floor(viewW / 2 / pitch)) * pitch;
}

export function wheelDelta({ deltaX = 0, deltaY = 0, deltaMode = 0 }) {
  const raw = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
  if (!raw) return 0;
  const scale = deltaMode === 1 ? 16 : deltaMode === 2 ? 400 : 1;
  return Math.max(-WHEEL_MAX, Math.min(WHEEL_MAX, raw * scale * 0.25));
}

export function tickIndex(x, pitch, offset = 0) {
  return Math.floor((x + offset) / pitch);
}

export function ticksBetween(a, b, pitch, offset = 0) {
  if (!(pitch > 0)) return 0;
  return Math.abs(tickIndex(b, pitch, offset) - tickIndex(a, pitch, offset));
}
