"use client"

import React, { useCallback, useMemo, useState } from "react"
import { Button, Hr } from "docs-ui"
import ChangelogEntry from "./Entry"
import { basePathUrl } from "../../utils/base-path-url"
import type { ChangelogPage, PublicChangelogEntry } from "../../utils/changelog"

type ChangelogProps = {
  /**
   * The first page of entries, loaded on the server so the changelog is
   * rendered and indexed without waiting for a client request.
   */
  initialPage: ChangelogPage
}

const Changelog = ({ initialPage }: ChangelogProps) => {
  const [entries, setEntries] = useState<PublicChangelogEntry[]>(
    initialPage.entries
  )
  const [page, setPage] = useState(initialPage.page)
  const [hasMore, setHasMore] = useState(initialPage.has_more)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const endpoint = useMemo(() => basePathUrl("/api/changelog"), [])

  const loadMore = useCallback(async () => {
    if (isLoading) {
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const nextPage = page + 1
      const response = await fetch(
        `${endpoint}?page=${nextPage}&limit=${initialPage.limit}`
      )

      if (!response.ok) {
        throw new Error(`Received a ${response.status} response.`)
      }

      const data = (await response.json()) as ChangelogPage

      // Guard against a duplicate entry if an entry was added between the two
      // requests, which would shift the pages.
      setEntries((previous) => {
        const seen = new Set(previous.map((entry) => entry.date))
        return [
          ...previous,
          ...data.entries.filter((entry) => !seen.has(entry.date)),
        ]
      })
      setPage(data.page)
      setHasMore(data.has_more)
    } catch {
      setError("Couldn't load more changelog entries. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, initialPage.limit, isLoading, page])

  return (
    <div>
      {entries.map((entry, index) => (
        <React.Fragment key={entry.date}>
          {index > 0 && <Hr />}
          <ChangelogEntry entry={entry} />
        </React.Fragment>
      ))}
      {hasMore && (
        <div className="flex flex-col items-center gap-docs_0.5 mt-docs_2">
          <Button variant="secondary" onClick={loadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load more"}
          </Button>
          {error && (
            <span className="text-medusa-fg-error text-compact-small">
              {error}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Changelog
