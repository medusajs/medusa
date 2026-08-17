import { changelogEntries } from "@/generated/changelog/index.mjs"

/**
 * A single dated changelog entry, as authored in
 * `generated/changelog/{YYYY-MM-DD}.mjs`.
 */
export type ChangelogEntry = {
  /**
   * The date the changes went live, in `YYYY-MM-DD` format.
   */
  date: string
  /**
   * A short headline for the entry, written alongside it — the changelog page
   * uses it as the entry's heading. Optional, and falls back to the entry's
   * formatted date.
   */
  title?: string
  /**
   * The entry's changes as Markdown, without the heading. Links to other Cloud
   * documentation pages are root-relative and omit the base path, such as
   * `/environments/custom-domains`.
   */
  content: string
  /**
   * A one-sentence summary of what the entry covers, written alongside the
   * entry. It isn't rendered on the changelog page, and is only exposed through
   * the public endpoint.
   */
  summary?: string
  /**
   * The Cloudinary URL of the entry's banner image, rendered and uploaded by
   * the changelog pipeline. Like {@link summary}, it isn't rendered on the
   * changelog page and is only exposed through the public endpoint.
   */
  image?: string
}

/**
 * A changelog entry as it's exposed to the changelog page and the public
 * `/api/changelog` endpoint.
 */
export type PublicChangelogEntry = Omit<
  ChangelogEntry,
  "title" | "summary" | "image"
> & {
  /**
   * The entry's anchor ID on the changelog page, such as `august-10-2026`.
   * Derived from the date rather than the title, so rewording a title doesn't
   * break a permalink to the entry.
   */
  id: string
  /**
   * The entry's headline, falling back to {@link displayDate} when it was
   * written without one.
   */
  title: string
  /**
   * The entry's date, formatted for display, such as `August 10, 2026`.
   */
  displayDate: string
  /**
   * `null` when the entry was written without a summary.
   */
  summary: string | null
  /**
   * `null` when the entry has no banner image, which happens when the upload
   * was skipped or failed.
   */
  image: string | null
}

export type ChangelogPage = {
  entries: PublicChangelogEntry[]
  /**
   * The 1-based number of the returned page.
   */
  page: number
  limit: number
  /**
   * The total number of changelog entries, across all pages.
   */
  count: number
  has_more: boolean
}

export type GetChangelogPageOptions = {
  /**
   * The 1-based page to load. Defaults to `1`.
   */
  page?: number
  /**
   * How many entries to load. Defaults to {@link CHANGELOG_PAGE_SIZE}.
   */
  limit?: number
  /**
   * When set, root-relative links in each entry's content are rewritten to
   * absolute URLs. Pass this for consumers that can't resolve a path against
   * the documentation site, such as the public endpoint and the Markdown
   * version of the page.
   */
  baseUrl?: string
}

export const CHANGELOG_PAGE_SIZE = 10
export const CHANGELOG_MAX_PAGE_SIZE = 50

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

/**
 * Formats a `YYYY-MM-DD` date as `{Month} {Day}, {Year}`. The date is parsed
 * manually rather than with `Date`, so the result doesn't shift with the
 * server's time zone.
 */
export function formatChangelogDate(date: string): string {
  const [year, month, day] = date.split("-")
  const monthName = MONTHS[parseInt(month, 10) - 1]

  if (!monthName) {
    return date
  }

  return `${monthName} ${parseInt(day, 10)}, ${year}`
}

export function getChangelogEntryId(date: string): string {
  return formatChangelogDate(date)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function getChangelogCount(): number {
  return changelogEntries.length
}

/**
 * Rewrites root-relative Markdown links, such as `/environments`, to absolute
 * URLs. Links that are already absolute, anchors, and mail links are untouched.
 */
function absolutizeLinks(content: string, baseUrl: string): string {
  const prefix = `${baseUrl.replace(/\/$/, "")}${process.env.NEXT_PUBLIC_BASE_PATH || ""}`

  return content.replace(
    /\]\((\/[^)\s]*)\)/g,
    (_match, url) => `](${prefix}${url})`
  )
}

/** Shapes an authored entry into what the page and the endpoints expose. */
function toPublicEntry(
  date: string,
  entry: ChangelogEntry,
  baseUrl?: string
): PublicChangelogEntry {
  const displayDate = formatChangelogDate(date)

  return {
    id: getChangelogEntryId(date),
    title: entry.title?.trim() || displayDate,
    date,
    displayDate,
    summary: entry.summary ?? null,
    image: entry.image ?? null,
    content: baseUrl ? absolutizeLinks(entry.content, baseUrl) : entry.content,
  }
}

/**
 * Loads a single entry by its `YYYY-MM-DD` date, or `null` when the changelog
 * has no entry for that date. Only that entry's file is imported.
 */
export async function getChangelogEntry(
  date: string,
  baseUrl?: string
): Promise<PublicChangelogEntry | null> {
  const match = changelogEntries.find((entry) => entry.date === date)

  if (!match) {
    return null
  }

  const { default: entry } = await match.load()

  return toPublicEntry(match.date, entry, baseUrl)
}

/**
 * Loads a page of changelog entries, newest first. Only the entries of the
 * requested page are imported, so the cost of loading a page doesn't grow with
 * the number of entries in the changelog.
 */
export async function getChangelogPage({
  page = 1,
  limit = CHANGELOG_PAGE_SIZE,
  baseUrl,
}: GetChangelogPageOptions = {}): Promise<ChangelogPage> {
  const normalizedPage = Math.max(1, Math.floor(page))
  const normalizedLimit = Math.min(
    CHANGELOG_MAX_PAGE_SIZE,
    Math.max(1, Math.floor(limit))
  )
  const offset = (normalizedPage - 1) * normalizedLimit
  const slice = changelogEntries.slice(offset, offset + normalizedLimit)

  const entries = await Promise.all(
    slice.map(async ({ date, load }) => {
      const { default: entry } = await load()

      return toPublicEntry(date, entry, baseUrl)
    })
  )

  return {
    entries,
    page: normalizedPage,
    limit: normalizedLimit,
    count: changelogEntries.length,
    has_more: offset + entries.length < changelogEntries.length,
  }
}

/**
 * Builds the Markdown version of the full changelog list, used by the
 * `md-content` route to replace the `<ChangelogList />` component with the
 * entries it renders.
 */
export async function getChangelogMarkdown(baseUrl?: string): Promise<string> {
  // Unlike the page and the endpoint, this loads every entry, since the
  // Markdown version of a page must hold the same content as the page itself.
  const entries = await Promise.all(
    changelogEntries.map(async ({ date, load }) => {
      const { default: entry } = await load()

      return toPublicEntry(date, entry, baseUrl)
    })
  )

  return entries
    .map(
      (entry) =>
        `## ${entry.title}\n\n_${entry.displayDate}_\n\n${entry.content}`
    )
    .join("\n\n---\n\n")
}
