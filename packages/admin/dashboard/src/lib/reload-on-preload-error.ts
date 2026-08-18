const RELOAD_ATTEMPT_KEY = "medusa_preload_error_reloaded_at"
const RELOAD_COOLDOWN_MS = 10_000

/**
 * Reloading is only safe if we can tell that we haven't just reloaded. If the
 * chunks are gone for good, an unguarded reload would loop forever, so without
 * a usable storage we let the error propagate instead.
 */
const canAttemptReload = () => {
  try {
    const lastAttempt = Number(sessionStorage.getItem(RELOAD_ATTEMPT_KEY))

    if (lastAttempt && Date.now() - lastAttempt < RELOAD_COOLDOWN_MS) {
      return false
    }

    sessionStorage.setItem(RELOAD_ATTEMPT_KEY, String(Date.now()))
    return true
  } catch {
    return false
  }
}

/**
 * The dashboard loads its routes as hashed chunks, and a deploy replaces those
 * files. A tab that was opened before the deploy requests chunks that no
 * longer exist, so every lazy-loaded route it hasn't visited yet fails until
 * the tab loads the new build. Vite reports exactly this failure through the
 * `vite:preloadError` event, and reloading once is its documented recovery:
 * https://vite.dev/guide/build#load-error-handling
 *
 * When a reload is not allowed (we just reloaded and the chunks are still
 * missing), the event is not canceled, so the error surfaces in the route's
 * error boundary.
 */
export const registerReloadOnPreloadError = (
  reload = () => window.location.reload()
) => {
  window.addEventListener("vite:preloadError", (event) => {
    if (!canAttemptReload()) {
      return
    }

    event.preventDefault()
    reload()
  })
}
