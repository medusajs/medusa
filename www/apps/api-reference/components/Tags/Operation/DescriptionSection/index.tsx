"use client"

import type { Operation } from "@/types/openapi"
import type { TagsOperationDescriptionSectionSecurityProps } from "./Security"
import type { TagsOperationDescriptionSectionRequestProps } from "./RequestBody"
import type { TagsOperationDescriptionSectionResponsesProps } from "./Responses"
import dynamic from "next/dynamic"
import TagsOperationDescriptionSectionParameters from "./Parameters"
import MDXContentClient from "@/components/MDXContent/Client"
import { useArea } from "../../../../providers/area"
import { Feedback, Badge, Link, FeatureFlagNotice } from "docs-ui"
import { usePathname } from "next/navigation"
import formatReportLink from "../../../../utils/format-report-link"

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
type TagsOperationDescriptionSectionProps = {
  operation: Operation
}
const TagsOperationDescriptionSection = ({
  operation,
}: TagsOperationDescriptionSectionProps) => {
  const { area } = useArea()
  const pathname = usePathname()

  return (
    <>
      <h2>
        {operation.summary}
        {operation.deprecated && (
          <Badge variant="orange" className="ml-0.5">
            deprecated
          </Badge>
        )}
        {operation["x-featureFlag"] && (
          <FeatureFlagNotice
            featureFlag={operation["x-featureFlag"]}
            tooltipTextClassName="font-normal text-medusa-fg-subtle"
            badgeClassName="ml-0.5"
          />
        )}
      </h2>
      <div className="my-1">
        <MDXContentClient content={operation.description} />
      </div>
      <Feedback
        event="survey_api-ref"
        extraData={{
          area,
          section: operation.summary,
        }}
        pathName={pathname}
        reportLink={formatReportLink(area, operation.summary)}
        className="!my-2"
        vertical={true}
        question="Did this API Route run successfully?"
      />
      {operation.externalDocs && (
        <>
          Related guide:{" "}
          <Link href={operation.externalDocs.url} target="_blank">
            {operation.externalDocs.description || "Read More"}
          </Link>
        </>
      )}
      {operation.security && (
        <TagsOperationDescriptionSectionSecurity
          security={operation.security}
        />
      )}
      {operation.parameters && (
        <TagsOperationDescriptionSectionParameters
          parameters={operation.parameters}
        />
      )}
      {operation.requestBody && (
        <TagsOperationDescriptionSectionRequest
          requestBody={operation.requestBody}
        />
      )}
      <TagsOperationDescriptionSectionResponses
        responses={operation.responses}
      />
    </>
  )
}

export default TagsOperationDescriptionSection
