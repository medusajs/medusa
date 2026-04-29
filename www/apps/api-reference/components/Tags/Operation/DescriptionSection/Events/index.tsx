"use client"

import React from "react"
import {
  Badge,
  DetailsSummary,
  DropdownMenu,
  Link,
  MarkdownContent,
  parseEventPayload,
  Tabs,
  TabsContent,
  TabsContentWrapper,
  TabsList,
  TabsTrigger,
  Tooltip,
  useCopy,
  useGenerateSnippet,
} from "docs-ui"
import { useMemo } from "react"
import type { OpenAPI } from "types"
import TagOperationParameters from "../../Parameters"
import { Brackets, CheckCircle, SquareTwoStack, Tag } from "@medusajs/icons"

export type TagsOperationDescriptionSectionEventsProps = {
  events: OpenAPI.OasEvents[]
}

const TagsOperationDescriptionSectionEvents = ({
  events,
}: TagsOperationDescriptionSectionEventsProps) => {
  return (
    <>
      <DetailsSummary
        title="Emitted Events"
        subtitle={
          <span>
            The following events are emitted by the workflow used in this API
            route. You can listen to and handle these events using a{" "}
            <Link
              href="https://docs.medusajs.com/learn/fundamentals/events-and-subscribers"
              variant="content"
            >
              Subscriber
            </Link>
          </span>
        }
        expandable={false}
        className="border-t-0"
        titleClassName="text-h3 mt-1.5"
      />
      <Tabs defaultValue={events[0].name} className="mt-1">
        <TabsList>
          {events.map((event) => (
            <TabsTrigger key={event.name} value={event.name}>
              {event.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContentWrapper>
          {events.map((event) => (
            <TagsOperationDescriptionSectionEvent
              key={event.name}
              event={event}
            />
          ))}
        </TabsContentWrapper>
      </Tabs>
    </>
  )
}

export default TagsOperationDescriptionSectionEvents

const TagsOperationDescriptionSectionEvent = ({
  event,
}: {
  event: OpenAPI.OasEvents
}) => {
  const {
    parsed_payload: parsedPayload,
    payload_for_snippet: payloadForSnippet,
  } = useMemo(() => {
    return parseEventPayload(event.payload)
  }, [event.payload])
  const { snippet } = useGenerateSnippet({
    type: "subscriber",
    options: {
      event: event.name,
      payload: payloadForSnippet,
    },
  })
  const { handleCopy: handleEventNameCopy, isCopied: eventNameCopied } =
    useCopy(event.name)
  const { handleCopy: handleSnippetCopy, isCopied: snippetCopied } =
    useCopy(snippet)
  return (
    <TabsContent value={event.name}>
      <div className="my-1 flex flex-wrap justify-between items-start mb-1">
        <div className="flex flex-wrap items-center gap-0.5 flex-1">
          <MarkdownContent
            allowedElements={["code", "p", "a"]}
            className={"[&_p:last-child]:!mb-0"}
          >
            {event.description}
          </MarkdownContent>
          {event.deprecated &&
            (event.deprecated_message ? (
              <Tooltip
                text={event.deprecated_message}
                data-testid="deprecated-tooltip"
              >
                <Badge variant="orange" data-testid="deprecated-badge">
                  Deprecated
                </Badge>
              </Tooltip>
            ) : (
              <Badge variant="orange" data-testid="deprecated-badge">
                Deprecated
              </Badge>
            ))}
          {event.since && (
            <Tooltip
              text={`This event is emitted since v${event.since}`}
              data-testid="since-tooltip"
            >
              <Badge variant="blue" data-testid="since-badge">
                v{event.since}
              </Badge>
            </Tooltip>
          )}
        </div>
        <DropdownMenu
          dropdownButtonContent={
            <>
              {eventNameCopied || snippetCopied ? (
                <CheckCircle />
              ) : (
                <SquareTwoStack />
              )}
            </>
          }
          menuItems={[
            {
              type: "action",
              title: "Copy event name",
              action: () => handleEventNameCopy(),
              icon: <Tag />,
            },
            {
              type: "action",
              title: "Copy subscriber for event",
              action: () => handleSnippetCopy(),
              icon: <Brackets />,
            },
          ]}
          menuClassName="z-10"
        />
      </div>
      <TagOperationParameters
        schemaObject={parsedPayload}
        topLevel={true}
        isExpanded={true}
      />
    </TabsContent>
  )
}
