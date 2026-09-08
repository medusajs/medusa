import { ProjectReflection, Reflection } from "typedoc"
import { MarkdownTheme } from "../theme.js"
import { getPageFrontmatter } from "./frontmatter.js"

const PAGE_FILE_RE = /\/page\.(mdx|md|json)$/

/**
 * Computes the final website URL for a page reflection, mirroring the runtime
 * slug resolution that `files-map` + `slug-changes` + `fix-link` perform:
 *
 *  - if the page's formatting options set a `slug` frontmatter field, that is
 *    the final URL (it is already absolute, e.g. `/references/cart/create`);
 *  - otherwise the URL derives from the page's file location, i.e.
 *    `/references/<location without trailing /page.ext>`.
 *
 * Doing this at generation time is what removes the per-request R2 fetch that
 * `fix-link.ts` used to perform to read a link target's frontmatter.
 */
export function resolvePageSlug(
  theme: MarkdownTheme,
  reflection: Reflection,
  pageUrl: string
): string {
  const location = pageUrl.replace(PAGE_FILE_RE, "")
  const base = `/references/${location}`

  const { frontmatterData } = theme.getFormattingOptions(pageUrl)
  const frontmatter = getPageFrontmatter({ frontmatterData, reflection })
  const slug = frontmatter?.slug

  return typeof slug === "string" && slug.length ? slug : base
}

/**
 * Builds a map from each page reflection's `page.<ext>` URL (the location the
 * theme assigns during `buildUrls`) to its final website URL. Anchor links
 * (`.../page.mdx#foo`) resolve to their container page's final URL + `#foo`.
 *
 * The `JsonTheme` uses this map to rewrite every internal link to its final
 * destination at generation time.
 */
export function buildSlugMap(
  theme: MarkdownTheme,
  project: ProjectReflection
): Map<string, string> {
  const map = new Map<string, string>()

  const visit = (reflection: Reflection) => {
    if (
      reflection.url &&
      !MarkdownTheme.URL_PREFIX.test(reflection.url) &&
      reflection.hasOwnDocument &&
      !map.has(reflection.url)
    ) {
      map.set(reflection.url, resolvePageSlug(theme, reflection, reflection.url))
    }

    reflection.traverse((child) => {
      visit(child)
      return true
    })
  }

  visit(project)

  return map
}

/**
 * Resolves a link that the markdown helpers produced (a `page.<ext>` URL,
 * possibly with an `#anchor`) to its final website URL using the slug map.
 * Falls back to a path-derived URL when the target is not in the map.
 */
export function resolveLink(
  slugMap: Map<string, string>,
  url: string
): string {
  if (!url || MarkdownTheme.URL_PREFIX.test(url)) {
    return url
  }

  const hashIndex = url.indexOf("#")
  const pagePart = hashIndex === -1 ? url : url.slice(0, hashIndex)
  const hash = hashIndex === -1 ? "" : url.slice(hashIndex)

  const resolved =
    slugMap.get(pagePart) ??
    (pagePart ? `/references/${pagePart.replace(PAGE_FILE_RE, "")}` : "")

  return `${resolved}${hash}`
}
