"use client"

import React from "react"
import type { DocBlock, DocPage } from "types"
import { TypeList } from "@/components/TypeList"
import { CodeTabs } from "@/components/CodeTabs"
import { CodeTab } from "@/components/CodeTabs/Item"
import { CodeBlock } from "@/components/CodeBlock"
import { WorkflowDiagram } from "@/components/WorkflowDiagram"
import { Note } from "@/components/Note"
import { SourceCodeLink } from "@/components/SourceCodeLink"
import { MarkdownContent } from "@/components/MarkdownContent"
import { H1 } from "@/components/Heading/H1"
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

const HeadingTag = ({
  level,
  id,
  children,
}: {
  level: number
  id: string
  children: React.ReactNode
}) => {
  const Tag = `h${Math.min(Math.max(level, 2), 6)}` as keyof React.JSX.IntrinsicElements
  return (
    <Tag id={id} className="scroll-mt-4">
      {children}
    </Tag>
  )
}

const Block = ({ block }: { block: DocBlock }) => {
  switch (block.kind) {
    case "markdown":
      return <MarkdownContent>{block.html}</MarkdownContent>
    case "heading":
      return (
        <HeadingTag level={block.level} id={block.id}>
          {block.text}
        </HeadingTag>
      )
    case "typeList":
      return (
        <TypeList
          types={block.types}
          sectionTitle={block.sectionTitle}
          expandUrl={block.expandUrl}
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
    case "linkList":
      return (
        <ul className="!list-disc !pl-docs_1">
          {block.items.map((item, index) => (
            <li key={index}>
              <a href={item.href}>{item.title}</a>
              {item.description ? (
                <span className="text-medusa-fg-subtle">
                  {" — "}
                  {item.description}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )
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
  return (
    <>
      <H1>{page.title}</H1>
      {page.blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
    </>
  )
}
