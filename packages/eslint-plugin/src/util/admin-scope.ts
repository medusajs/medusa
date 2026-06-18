import { toPosix } from "./filename"

const ADMIN_FILE_RE = /(?:^|\/)src\/admin\//
const WIDGET_RE = /(?:^|\/)src\/admin\/widgets\/[^/]+\.(?:tsx|jsx)$/
const WIDGET_RE_NO_SRC = /(?:^|\/)admin\/widgets\/[^/]+\.(?:tsx|jsx)$/
const UI_ROUTE_RE = /(?:^|\/)src\/admin\/routes\/.+\/page\.(?:tsx|jsx)$/
const UI_ROUTE_RE_NO_SRC = /(?:^|\/)admin\/routes\/.+\/page\.(?:tsx|jsx)$/

/**
 * True when `filename` lives anywhere under the admin dashboard tree
 * (`src/admin/**`). Deliberately requires the `src/admin` segment pair so it
 * does NOT match API admin routes (`src/api/admin/**`), which are server code
 * where `process.env` is legitimate. Bails on synthetic / empty filenames.
 */
export function isAdminFile(filename: string | undefined): boolean {
  if (!filename || filename.startsWith("<")) {
    return false
  }
  return ADMIN_FILE_RE.test(toPosix(filename))
}

/**
 * True when `filename` is an admin widget file —
 * `src/admin/widgets/<name>.tsx` (or `.jsx`) or the bare `admin/widgets/...`
 * variant for nested project layouts.
 */
export function isAdminWidgetFile(filename: string): boolean {
  const posix = toPosix(filename)
  return WIDGET_RE.test(posix) || WIDGET_RE_NO_SRC.test(posix)
}

/**
 * True when `filename` is an admin UI route page —
 * `src/admin/routes/**​/page.tsx` (or `.jsx`) or the bare `admin/routes/...`
 * variant.
 */
export function isAdminUiRoutePageFile(filename: string): boolean {
  const posix = toPosix(filename)
  return UI_ROUTE_RE.test(posix) || UI_ROUTE_RE_NO_SRC.test(posix)
}

/**
 * True when `filename` hosts an admin component that the framework loads —
 * a widget file or a UI route `page.tsx`. Bails on synthetic / empty
 * filenames.
 */
export function isAdminComponentFile(filename: string | undefined): boolean {
  if (!filename || filename.startsWith("<")) {
    return false
  }
  return isAdminWidgetFile(filename) || isAdminUiRoutePageFile(filename)
}

/**
 * True when `filename` sits under a dynamic route segment — any path segment
 * wrapped in brackets (`[id]`, `[...slug]`, `[[id]]`). Dynamic UI routes aren't
 * added to the sidebar, so route `config` doesn't apply to them.
 */
export function isDynamicUiRoutePath(filename: string | undefined): boolean {
  if (!filename) {
    return false
  }
  return toPosix(filename)
    .split("/")
    .some((segment) => /^\[.+\]$/.test(segment))
}
