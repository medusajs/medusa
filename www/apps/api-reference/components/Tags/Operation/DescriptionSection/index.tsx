"use client"

import React from "react"
import type { OpenAPI } from "types"
import type { TagsOperationDescriptionSectionSecurityProps } from "./Security"
import type { TagsOperationDescriptionSectionRequestProps } from "./RequestBody"
import type { TagsOperationDescriptionSectionResponsesProps } from "./Responses"
import dynamic from "next/dynamic"
import TagsOperationDescriptionSectionParameters from "./Parameters"
import MDXContentClient from "@/components/MDXContent/Client"
import {
  Badge,
  Link,
  FeatureFlagNotice,
  H2,
  Tooltip,
  MarkdownContent,
} from "docs-ui"
import { TagsOperationDescriptionSectionWorkflowBadgeProps } from "./WorkflowBadge"
import { TagsOperationDescriptionSectionEventsProps } from "./Events"
import { TagsOperationDescriptionSectionDeprecationNoticeProps } from "./DeprecationNotice"
import { Feedback } from "@/components/Feedback"

const TagsOperationDescriptionSectionSecurity =
  dynamic<TagsOperationDescriptionSectionSecurityProps>(
    async () => import("./Security")
  ) as React.FC<TagsOperationDescriptionSectionSecurityProps>

const TagsOperationDescriptionSectionRequest =
  dynamic<TagsOperationDescriptionSectionRequestProps>(
    async () => import("./RequestBody")
  ) as React.FC<TagsOperationDescriptionSectionRequestProps>

const TagsOperationDescriptionSectionResponses =
  dynamic<TagsOperationDescriptionSectionResponsesProps>(
    async () => import("./Responses")
  ) as React.FC<TagsOperationDescriptionSectionResponsesProps>

const TagsOperationDescriptionSectionWorkflowBadge =
  dynamic<TagsOperationDescriptionSectionWorkflowBadgeProps>(
    async () => import("./WorkflowBadge")
  ) as React.FC<TagsOperationDescriptionSectionWorkflowBadgeProps>

const TagsOperationDescriptionSectionEvents =
  dynamic<TagsOperationDescriptionSectionEventsProps>(
    async () => import("./Events")
  ) as React.FC<TagsOperationDescriptionSectionEventsProps>

const TagsOperationDescriptionSectionDeprecationNotice =
  dynamic<TagsOperationDescriptionSectionDeprecationNoticeProps>(
    async () => import("./DeprecationNotice")
  ) as React.FC<TagsOperationDescriptionSectionDeprecationNoticeProps>

type TagsOperationDescriptionSectionProps = {
  operation: OpenAPI.Operation
}
const TagsOperationDescriptionSection = ({
  operation,
}: TagsOperationDescriptionSectionProps) => {
  return (
    <>
      <H2>
        {operation.summary}
        {operation.deprecated && (
          <TagsOperationDescriptionSectionDeprecationNotice
            deprecationMessage={operation["x-deprecated_message"]}
            className="ml-0.5"
          />
        )}
        {operation["x-featureFlag"] && (
          <FeatureFlagNotice
            featureFlag={operation["x-featureFlag"]}
            tooltipTextClassName="font-normal text-medusa-fg-base"
            badgeClassName="ml-0.5"
          />
        )}
        {operation["x-since"] && (
          <Tooltip
            text={`This API route is available since v${operation["x-since"]}`}
          >
            <Badge variant="blue" className="ml-0.5" data-testid="since-badge">
              v{operation["x-since"]}
            </Badge>
          </Tooltip>
        )}
        {operation["x-badges"]?.map((badge, index) => (
          <Tooltip
            key={index}
            tooltipChildren={
              <MarkdownContent
                allowedElements={["a", "strong", "em", "br"]}
                unwrapDisallowed={true}
              >
                {badge.description}
              </MarkdownContent>
            }
            clickable={true}
          >
            <Badge
              variant={badge.variant || "neutral"}
              className="ml-0.5"
              data-testid="custom-badge"
            >
              {badge.text}
            </Badge>
          </Tooltip>
        ))}
      </H2>
      <div className="my-1">
        <MDXContentClient content={operation.description} />
      </div>
      {operation["x-workflow"] && (
        <TagsOperationDescriptionSectionWorkflowBadge
          workflow={operation["x-workflow"]}
        />
      )}
      {operation.externalDocs && (
        <>
          Related guide:{" "}
          <Link
            href={operation.externalDocs.url}
            target="_blank"
            variant="content"
            data-testid="related-guide-link"
          >
            {operation.externalDocs.description || "Read More"}
          </Link>
        </>
      )}
      <Feedback
        extraData={{
          section: operation.summary,
        }}
        className="!my-2"
        question="Did this API Route run successfully?"
      />
      {operation.security && (
        <TagsOperationDescriptionSectionSecurity
          security={operation.security}
        />
      )}
      {operation.parameters && operation.parameters.length > 0 && (
        <TagsOperationDescriptionSectionParameters
          parameters={operation.parameters}
        />
      )}
      {operation.requestBody?.content !== undefined &&
        Object.keys(operation.requestBody.content).length > 0 && (
          <TagsOperationDescriptionSectionRequest
            requestBody={operation.requestBody}
          />
        )}
      <TagsOperationDescriptionSectionResponses
        responses={operation.responses}
      />
      {(operation["x-events"]?.length || 0) > 0 && (
        <TagsOperationDescriptionSectionEvents
          events={operation["x-events"]!}
        />
      )}
    </>
  )
}

export default TagsOperationDescriptionSection
