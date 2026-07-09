import { ReactNode, useMemo } from "react"
import { Helmet } from "react-helmet-async"
import { UIMatch, useMatches } from "react-router-dom"

const DEFAULT_TITLE = "Medusa"

export type RouteHandle = {
  breadcrumb?: (match?: UIMatch) => string | ReactNode
  /**
   * Resolves the document title for the route.
   *
   * Each route declares its own resolver, co-located with the route, so the
   * title logic lives next to the loader data shape it depends on (rather than
   * being centralised in this hook). Return `undefined` to let a parent route's
   * title or the default apply.
   */
  seo?: (match: UIMatch) => { title?: string }
}

/**
 * Resolves a single matched route to a title string, or `null` when the route
 * does not contribute a title.
 *
 * Resolution order:
 * 1. An explicit `seo` resolver (used by detail pages to surface entity names).
 * 2. A `breadcrumb` that returns a plain string (used by list/section pages).
 *
 * React-element breadcrumbs (rendered by detail pages) carry no extractable
 * text and are intentionally ignored here; those routes rely on `seo`.
 */
export function getTitleFromMatch(
  match: UIMatch<unknown, RouteHandle>
): string | null {
  const handle = match.handle

  if (handle?.seo) {
    try {
      const title = handle.seo(match)?.title
      if (typeof title === "string" && title.trim() !== "") {
        return title
      }
    } catch {
      // Fall through to the breadcrumb / default below.
    }
  }

  if (handle?.breadcrumb) {
    try {
      const result = handle.breadcrumb(match)
      if (typeof result === "string" && result.trim() !== "") {
        return result
      }
    } catch {
      // Ignore and let a parent route or the default apply.
    }
  }

  return null
}

/**
 * Hook that returns the document title based on the current route.
 *
 * It walks the matched routes from root to leaf and uses the most specific
 * (last) route that yields a title. The format is `"Page Title - Medusa"`,
 * falling back to `"Medusa"` when no route contributes a title.
 */
export function useDocumentTitle() {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[]

  const title = useMemo(() => {
    let pageTitle = ""

    for (let indx = matches.length - 1; indx >= 0; indx--) {
      const resolvedTitle = getTitleFromMatch(matches[indx])

      if (resolvedTitle) {
        pageTitle = resolvedTitle
        break
      }
    }

    if (!pageTitle) {
      return DEFAULT_TITLE
    }

    return `${pageTitle} - Medusa`
  }, [matches])

  return title
}

/**
 * Component that renders the document title using react-helmet-async.
 * Should be used within a HelmetProvider.
 */
export function DocumentTitle() {
  const title = useDocumentTitle()

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
