"use client"

import React from "react"
import type { DocWorkflowEvent } from "types"
import { Table } from "@/components/Table"
import { Badge } from "@/components/Badge"
import { Tooltip } from "@/components/Tooltip"
import { CodeBlock } from "@/components/CodeBlock"
import { CopyGeneratedSnippetButton } from "@/components/CopyGeneratedSnippetButton"
import { MarkdownContent } from "@/components/MarkdownContent"
import { Mdx } from "./shared"

export type ReferenceWorkflowEventsProps = {
  events: DocWorkflowEvent[]
}

/**
 * Renders the structured `workflowEvents` block as a table, mirroring the
 * `<Table>` the `workflowEvents` MDX helper produced (event name, description,
 * payload snippet, and a "copy subscriber" action).
 */
export const ReferenceWorkflowEvents = ({
  events,
}: ReferenceWorkflowEventsProps) => {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Event</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell>Payload</Table.HeaderCell>
          <Table.HeaderCell>Action</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {events.map((event, index) => (
          <Table.Row key={index}>
            <Table.Cell>
              <Mdx.code>{event.name}</Mdx.code>
              {event.deprecated ? (
                <Tooltip text={event.deprecatedMessage || "Deprecated"}>
                  <Badge variant="orange">Deprecated</Badge>
                </Tooltip>
              ) : null}
              {event.since ? (
                <Tooltip
                  text={`This event was added in version v${event.since}`}
                >
                  <Badge variant="blue">v{event.since}</Badge>
                </Tooltip>
              ) : null}
            </Table.Cell>
            <Table.Cell>
              {event.description ? (
                <MarkdownContent>{event.description}</MarkdownContent>
              ) : null}
            </Table.Cell>
            <Table.Cell>
              {event.payload ? (
                <CodeBlock
                  source={event.payload}
                  lang="ts"
                  blockStyle="inline"
                />
              ) : null}
            </Table.Cell>
            <Table.Cell>
              <CopyGeneratedSnippetButton
                tooltipText="Copy subscriber for event"
                type="subscriber"
                options={{
                  event: event.name,
                  payload: event.payload || "",
                }}
              />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
