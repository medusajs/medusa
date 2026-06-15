import { toPosix } from "./filename"

/**
 * True when `filename` lives under an `api/` directory — either `src/api/`
 * (the canonical Medusa layout) or a bare `api/` (nested project layouts).
 * Bails on synthetic / empty filenames.
 */
export const isUnderApiDir = (filename: string | undefined): boolean => {
  if (!filename || filename.startsWith("<")) return false
  const posix = toPosix(filename)
  return /(^|\/)src\/api\//.test(posix) || /(^|\/)api\//.test(posix)
}

/**
 * Returns the path segments of a file under `src/api/` (or a bare `api/`),
 * excluding the file's own basename. Returns `null` when the file is not
 * under an api directory.
 *
 * Example: `/proj/src/api/admin/customers/[id]/route.ts`
 *       → `["admin", "customers", "[id]"]`
 */
export function getApiRouteSegments(filename: string): string[] | null {
  const posix = toPosix(filename)
  const m =
    posix.match(/(?:^|\/)src\/api\/(.+)$/) ??
    posix.match(/(?:^|\/)api\/(.+)$/)
  if (!m) return null
  const segments = m[1].split("/")
  segments.pop()
  return segments
}

/**
 * Absolute (POSIX) path to the `src/api` (or bare `api`) directory that
 * contains `filename`, or `null` if the file is not under one.
 */
export function findApiRoot(filename: string): string | null {
  const posix = toPosix(filename)
  const m =
    posix.match(/^(.*\/src\/api)\//) ?? posix.match(/^(.*\/api)\//)
  if (!m) return null
  return m[1]
}
