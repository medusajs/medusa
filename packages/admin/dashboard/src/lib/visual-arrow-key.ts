/**
 * Maps a physical arrow key to the one that matches its on-screen direction.
 *
 * Horizontal navigation is written as if "next" were always to the right, which
 * only holds in a left-to-right document. Under `dir="rtl"` the next item sits
 * to the left, so the physical ArrowLeft and ArrowRight have to be exchanged
 * before the key reaches that logic -- otherwise the focus moves against the
 * arrow the user pressed. Every other key is returned unchanged, ArrowUp and
 * ArrowDown included: only the inline axis flips in RTL, never the block axis.
 */
export const toVisualArrowKey = (
  key: string,
  direction?: "ltr" | "rtl"
): string => {
  if (direction !== "rtl") {
    return key
  }

  if (key === "ArrowLeft") {
    return "ArrowRight"
  }

  if (key === "ArrowRight") {
    return "ArrowLeft"
  }

  return key
}
