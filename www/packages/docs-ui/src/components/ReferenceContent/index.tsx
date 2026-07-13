"use client"

import React, { useEffect } from "react"
import type { DocBlock, DocPage, ToCItem } from "types"
import { useSiteConfig } from "@/providers/SiteConfig"
import { TypeList } from "@/components/TypeList"
import { CodeTabs } from "@/components/CodeTabs"
import { CodeTab } from "@/components/CodeTabs/Item"
import { CodeBlock } from "@/components/CodeBlock"
import { WorkflowDiagram } from "@/components/WorkflowDiagram"
import { Note } from "@/components/Note"
import { SourceCodeLink } from "@/components/SourceCodeLink"
import { MarkdownContent } from "@/components/MarkdownContent"
import { H1 } from "@/components/Heading/H1"
import { Mdx, DocHeading } from "./shared"
import { ReferenceWorkflowEvents } from "./WorkflowEvents"
import { ReferenceEventsListing } from "./EventsListing"

export type ReferenceContentProps = {
  page: DocPage
}

const noteTypeMap: Record<string, React.ComponentProps<typeof Note>["type"]> = {
  note: "default",
  default: "default",
  warning: "warning",
  success: "success",
  error: "error",
  check: "check",
  soon: "soon",
}

const Block = ({ block }: { block: DocBlock }) => {
  switch (block.kind) {
    case "markdown":
      return <MarkdownContent>{block.html}</MarkdownContent>
    case "heading":
      return (
        <DocHeading level={block.level} id={block.id}>
          {block.text}
        </DocHeading>
      )
    case "typeList":
      return (
        <TypeList
          types={block.types}
          sectionTitle={block.sectionTitle}
          expandUrl={block.expandUrl}
          openedLevel={block.openedLevel}
        />
      )
    case "workflowDiagram":
      return <WorkflowDiagram workflow={block.workflow} />
    case "codeTabs":
      return (
        <CodeTabs group="reference">
          {block.tabs.map((tab, index) => (
            <CodeTab key={index} label={tab.label} value={`${tab.label}-${index}`}>
              <CodeBlock source={tab.code} lang={tab.language} title={tab.title} />
            </CodeTab>
          ))}
        </CodeTabs>
      )
    case "note":
      return (
        <Note type={noteTypeMap[block.variant || "note"] || "default"} title={block.title}>
          <MarkdownContent>{block.html}</MarkdownContent>
        </Note>
      )
    case "sourceCodeLink":
      return <SourceCodeLink link={block.link} />
    case "linkList": {
      const { ul: Ul, li: Li, a: Anchor } = Mdx
      return (
        <Ul>
          {block.items.map((item, index) => (
            <Li key={index}>
              <Anchor href={item.href}>{item.title}</Anchor>
              {item.description ? ` — ${item.description}` : null}
            </Li>
          ))}
        </Ul>
      )
    }
    case "workflowEvents":
      return <ReferenceWorkflowEvents events={block.events} />
    case "eventsListing":
      return <ReferenceEventsListing categories={block.categories} />
    case "badges":
      return null
    case "table":
      return null
    default:
      return null
  }
}

/**
 * Renders a references {@link DocPage} (the JSON doc-model) as React, mapping
 * each {@link DocBlock} to the corresponding `docs-ui` component. This replaces
 * the runtime MDX serialization + `MDXClient` path for migrated references.
 */
export const ReferenceContent = ({ page }: ReferenceContentProps) => {
  const { setFrontmatter, setToc } = useSiteConfig()

  // Feed the page's frontmatter/TOC into the site config so the "On this page"
  // content menu works (same data the MDX pipeline injected via InjectedMDXData).
  useEffect(() => {
    setFrontmatter(page.frontmatter)
  }, [page])

  useEffect(() => {
    // generate_toc pages build the TOC by scanning the rendered headings, so
    // start from null to show the loading state until that scan runs.
    setToc(
      page.frontmatter?.generate_toc ? null : ((page.toc as ToCItem[]) ?? [])
    )
  }, [page])

  return (
    <>
      <H1 variant="content">{page.title}</H1>
      {page.blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </>
  )
}
