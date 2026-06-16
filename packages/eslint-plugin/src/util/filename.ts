import * as path from "path"

/**
 * Normalizes a filesystem path to POSIX separators so path matching works
 * the same on Windows and POSIX hosts.
 */
export const toPosix = (p: string): string => p.replace(/\\/g, "/")

/**
 * Returns the basename of `filename` without its extension, or `null` when
 * the filename is unusable as a naming hint — empty, synthetic (`<input>`),
 * or `index.<ext>` (carries no useful signal).
 */
export const getFilenameStem = (
  filename: string | undefined
): string | null => {
  if (!filename) return null
  if (filename.startsWith("<")) return null
  const base = path.basename(filename, path.extname(filename))
  if (!base || base === "index") return null
  return base
}
