import { CloudHint } from "../../types"

export const HINT_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000
export const HINT_DELAY_MS = 3000

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/"

/**
 * Returns the hint to show on a page, if any. Each hint is shown once per
 * browser, and no hint is shown within the cooldown of the last Cloud toast.
 */
export const getHintForPath = (
  pathname: string,
  hints: CloudHint[],
  {
    shownIds,
    lastToastAt,
    now = Date.now(),
  }: { shownIds: string[]; lastToastAt: number | null; now?: number }
): CloudHint | undefined => {
  if (lastToastAt && now - lastToastAt < HINT_COOLDOWN_MS) {
    return
  }

  const path = normalizePath(pathname)

  return hints.find(
    (hint) =>
      normalizePath(hint.admin_path) === path && !shownIds.includes(hint.id)
  )
}
