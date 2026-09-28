/*
  Tiny handshake between the loading screen and the touch test:
    "scene" – the Three.js surface is ready (or has fallen back)
    "intro" – the loading screen has finished and left
  The loader waits for "scene"; the demo waits for "intro".
*/
type Flag = "scene" | "intro";

const raised = new Set<Flag>();
const waiting = new Map<Flag, Set<() => void>>();

export function signal(flag: Flag) {
  if (raised.has(flag)) return;
  raised.add(flag);
  waiting.get(flag)?.forEach((fn) => fn());
  waiting.delete(flag);
}

/** Runs `fn` once the flag is raised (straight away if it already is). Returns an unsubscribe. */
export function when(flag: Flag, fn: () => void) {
  if (raised.has(flag)) {
    fn();
    return () => {};
  }
  const set = waiting.get(flag) ?? new Set();
  set.add(fn);
  waiting.set(flag, set);
  return () => void set.delete(fn);
}

/** Called when the loader mounts, so a return visit to the page plays the intro again. */
export function resetIntro() {
  raised.clear();
  waiting.clear();
}
