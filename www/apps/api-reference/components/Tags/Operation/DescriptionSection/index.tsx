import type { Operation } from "@/types/openapi"
import type { TagsOperationDescriptionSectionSecurityProps } from "./Security"
import type { TagsOperationDescriptionSectionRequestProps } from "./RequestBody"
import type { TagsOperationDescriptionSectionResponsesProps } from "./Responses"
import dynamic from "next/dynamic"
import TagsOperationDescriptionSectionParameters from "./Parameters"
import MDXContentClient from "@/components/MDXContent/Client"
import type { BadgeProps } from "../../../Badge"
import type { TagsOperationFeatureFlagNoticeProps } from "../FeatureFlagNotice"
import type { LinkProps } from "../../../MDXComponents/Link"
import Feedback from "../../../Feedback"
import { useArea } from "../../../../providers/area"

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

const Link = dynamic<LinkProps>(
  async () => import("../../../MDXComponents/Link")
) as React.FC<LinkProps>

const Badge = dynamic<BadgeProps>(
  async () => import("../../../Badge")
) as React.FC<BadgeProps>

const TagsOperationFeatureFlagNotice =
  dynamic<TagsOperationFeatureFlagNoticeProps>(
    async () => import("../FeatureFlagNotice")
  ) as React.FC<TagsOperationFeatureFlagNoticeProps>

type TagsOperationDescriptionSectionProps = {
  operation: Operation
}
const TagsOperationDescriptionSection = ({
  operation,
}: TagsOperationDescriptionSectionProps) => {
  const { area } = useArea()

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
          <TagsOperationFeatureFlagNotice
            featureFlag={operation["x-featureFlag"]}
            tooltipTextClassName="font-normal text-medusa-fg-subtle dark:text-medusa-fg-subtle-dark"
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
        sectionTitle={operation.summary}
        className="!my-2"
        vertical={true}
        question="Did this endpoint run successfully?"
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
