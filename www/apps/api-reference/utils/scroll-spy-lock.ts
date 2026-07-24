/*
 * Coordinates the deep-link scroll (driven by TagSection) with the per-section
 * scroll-spy (in TagOperation / TagSectionSchema).
 *
 * The scroll-spy updates the URL via history.replaceState, which Next syncs to
 * usePathname. Without coordination, a section at the top on load (the schema or
 * the first operation) would claim the URL before the target operation's scroll
 * runs — changing the pathname and aborting the deep-link scroll (so it "stays
 * on the schema"). While a navigation-scroll is settling we lock the scroll-spy;
 * and scroll-spy URL updates are marked so the deep-link controller can tell
 * them apart from real navigations.
 */

let lockCount = 0
let lastScrollSpyPath: string | null = null

/**
 * Acquire the scroll-spy lock. Returns a release function (idempotent).
 */
export function lockScrollSpy(): () => void {
  lockCount++
  let released = false
  return () => {
    if (released) {
      return
    }
    released = true
    lockCount = Math.max(0, lockCount - 1)
  }
}

export function isScrollSpyLocked(): boolean {
  return lockCount > 0
}

/**
 * Record a path the scroll-spy just wrote to the URL.
 */
export function markScrollSpyNavigation(path: string): void {
  lastScrollSpyPath = path
}

/**
 * Returns true (once) if the given path was the last scroll-spy URL update —
 * i.e. this pathname change came from scroll-spy, not a real navigation.
 */
export function isScrollSpyNavigation(path: string): boolean {
  if (lastScrollSpyPath === path) {
    lastScrollSpyPath = null
    return true
  }
  return false
}

let scrollSpyTimer: ReturnType<typeof setTimeout> | null = null

/**
 * Debounce scroll-spy updates so fast scrolling applies a single update once it
 * settles (one URL/highlight change) instead of one per crossed section. This
 * avoids per-crossing re-render churn and keeps the deep-link controller from
 * treating each intermediate pathname change as a navigation and re-scrolling.
 */
export function scheduleScrollSpyUpdate(apply: () => void): void {
  if (scrollSpyTimer) {
    clearTimeout(scrollSpyTimer)
  }
  scrollSpyTimer = setTimeout(() => {
    scrollSpyTimer = null
    apply()
  }, 120)
}
