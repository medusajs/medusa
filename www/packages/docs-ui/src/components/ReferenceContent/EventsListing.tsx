"use client"

import React from "react"
import type { DocEvent } from "types"
import { Table } from "@/components/Table"
import { Badge } from "@/components/Badge"
import { Tooltip } from "@/components/Tooltip"
import { CodeBlock } from "@/components/CodeBlock"
import { CopyGeneratedSnippetButton } from "@/components/CopyGeneratedSnippetButton"
import { MarkdownContent } from "@/components/MarkdownContent"
import { Mdx, DocHeading } from "./shared"

export type ReferenceEventsListingProps = {
  categories: { title?: string; events: DocEvent[] }[]
}

const FENCE_RE = /```(\w+)?\n?([\s\S]*?)```/

function EventBadges({ event }: { event: DocEvent }) {
  return (
    <>
      {event.deprecated ? (
        <Tooltip text={event.deprecatedMessage || "Deprecated"}>
          <Badge variant="orange">Deprecated</Badge>
        </Tooltip>
      ) : null}
      {event.since ? (
        <Tooltip text={`This event was added in version v${event.since}`}>
          <Badge variant="blue">v{event.since}</Badge>
        </Tooltip>
      ) : null}
    </>
  )
}

function EventDetail({ event, level }: { event: DocEvent; level: number }) {
  const fence = event.payload?.match(FENCE_RE)
  const { ul: Ul, li: Li, a: Anchor } = Mdx

  return (
    <>
      <div className="flex items-center justify-between flex-wrap">
        <DocHeading
          level={level}
          id={event.id}
          className="flex flex-wrap justify-center gap-docs_0.25"
        >
          {event.name}
          <EventBadges event={event} />
        </DocHeading>
        <CopyGeneratedSnippetButton
          tooltipText="Copy subscriber for event"
          type="subscriber"
          options={{ event: event.name, payload: event.payload || "" }}
        />
      </div>
      {event.description ? (
        <MarkdownContent>{event.description}</MarkdownContent>
      ) : null}
      {event.payload ? (
        <>
          <DocHeading level={level + 1} id={`${event.id}-payload`}>
            Payload
          </DocHeading>
          <CodeBlock
            source={(fence?.[2] ?? event.payload).trim()}
            lang={fence?.[1] || "ts"}
          />
        </>
      ) : null}
      {event.workflows?.length ? (
        <>
          <DocHeading level={level + 1} id={`${event.id}-workflows`}>
            Workflows Emitting this Event
          </DocHeading>
          <Ul>
            {event.workflows.map((workflow, index) => (
              <Li key={`${workflow.name}-${index}`}>
                <Anchor href={workflow.href}>{workflow.name}</Anchor>
              </Li>
            ))}
          </Ul>
        </>
      ) : null}
    </>
  )
}

/**
 * Renders the full events reference (the `eventsListing` block): a per-category
 * summary table followed by each event's details (payload, emitting workflows).
 */
export const ReferenceEventsListing = ({
  categories,
}: ReferenceEventsListingProps) => {
  const multi = categories.length > 1
  const summaryLevel = multi ? 3 : 2
  const eventLevel = multi ? 3 : 2
  const { code: Code, a: Anchor } = Mdx

  return (
    <>
      {categories.map((category, index) => {
        const categorySlug =
          (category.title || `category-${index}`)
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || `category-${index}`
        return (
        <React.Fragment key={index}>
          {multi && category.title ? (
            <DocHeading level={2} id={`${categorySlug}-events`}>
              {category.title} Events
            </DocHeading>
          ) : null}
          <DocHeading level={summaryLevel} id={`${categorySlug}-summary`}>
            Summary
          </DocHeading>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Event</Table.HeaderCell>
                <Table.HeaderCell>Description</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {category.events.map((event) => (
                <Table.Row key={event.id}>
                  <Table.Cell>
                    <Anchor href={`#${event.id}`}>
                      <Code>{event.name}</Code>
                    </Anchor>{" "}
                    <EventBadges event={event} />
                  </Table.Cell>
                  <Table.Cell>
                    {event.description ? (
                      <MarkdownContent>{event.description}</MarkdownContent>
                    ) : null}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {category.events.map((event) => (
            <EventDetail key={event.id} event={event} level={eventLevel} />
          ))}
        </React.Fragment>
        )
      })}
    </>
  )
}
