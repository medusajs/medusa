import React from "react"
import { H2, MarkdownContent } from "docs-ui"
import type { PublicChangelogEntry } from "../../utils/changelog"

type ChangelogEntryProps = {
  entry: PublicChangelogEntry
}

const ChangelogEntry = ({ entry }: ChangelogEntryProps) => {
  return (
    <section>
      <H2 id={entry.id}>{entry.title}</H2>
      <MarkdownContent>{entry.content}</MarkdownContent>
    </section>
  )
}

export default ChangelogEntry
