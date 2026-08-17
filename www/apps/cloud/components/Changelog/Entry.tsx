import React from "react"
import { H2, MarkdownContent } from "docs-ui"
import type { PublicChangelogEntry } from "../../utils/changelog"

type ChangelogEntryProps = {
  entry: PublicChangelogEntry
}

const ChangelogEntry = ({ entry }: ChangelogEntryProps) => {
  return (
    <section>
      {/* The heading is the entry's title, so the date is what tells the reader
          when the changes went live. */}
      <span className="text-medusa-fg-subtle text-compact-small-plus block mt-docs_2">
        {entry.displayDate}
      </span>
      <H2 id={entry.id} className="!mt-docs_0.25">
        {entry.title}
      </H2>
      <MarkdownContent>{entry.content}</MarkdownContent>
    </section>
  )
}

export default ChangelogEntry
