"use client"

import React from "react"
import type { DocEvent } from "types"
import { Table } from "@/components/Table"
import { Badge } from "@/components/Badge"
import { Tooltip } from "@/components/Tooltip"
import { CodeBlock } from "@/components/CodeBlock"
import { CopyGeneratedSnippetButton } from "@/components/CopyGeneratedSnippetButton"
import { MarkdownContent } from "@/components/MarkdownContent"

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
  const Heading = `h${Math.min(level, 6)}` as keyof React.JSX.IntrinsicElements
  const PayloadHeading = `h${Math.min(level + 1, 6)}` as keyof React.JSX.IntrinsicElements
  const fence = event.payload?.match(FENCE_RE)

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-docs_0.5">
        <Heading id={event.id} className="scroll-mt-4 flex items-center gap-docs_0.5">
          {event.name}
          <EventBadges event={event} />
        </Heading>
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
          <PayloadHeading>Payload</PayloadHeading>
          <CodeBlock
            source={(fence?.[2] ?? event.payload).trim()}
            lang={fence?.[1] || "ts"}
          />
        </>
      ) : null}
      {event.workflows?.length ? (
        <>
          <PayloadHeading>Workflows Emitting this Event</PayloadHeading>
          <ul className="!list-disc !pl-docs_1">
            {event.workflows.map((workflow) => (
              <li key={workflow.name}>
                <a href={workflow.href}>{workflow.name}</a>
              </li>
            ))}
          </ul>
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
  const CategoryHeading = "h2" as const
  const SummaryHeading = (multi ? "h3" : "h2") as keyof React.JSX.IntrinsicElements
  const eventLevel = multi ? 3 : 2

  return (
    <>
      {categories.map((category, index) => (
        <React.Fragment key={index}>
          {multi && category.title ? (
            <CategoryHeading>{category.title} Events</CategoryHeading>
          ) : null}
          <SummaryHeading>Summary</SummaryHeading>
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
                    <a href={`#${event.id}`}>
                      <code>{event.name}</code>
                    </a>{" "}
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
      ))}
    </>
  )
}
