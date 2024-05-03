import type { RequestObject } from "@/types/openapi"
import TagOperationParameters from "../../Parameters"
import { DetailsSummary } from "docs-ui"

export type TagsOperationDescriptionSectionRequestProps = {
  requestBody: RequestObject
}

const TagsOperationDescriptionSectionRequest = ({
  requestBody,
}: TagsOperationDescriptionSectionRequestProps) => {
  return (
    <>
      <DetailsSummary
        title="Request Body"
        subtitle={Object.keys(requestBody.content)[0]}
        expandable={false}
        className="border-t-0"
        titleClassName="text-h3"
      />
      <TagOperationParameters
        schemaObject={
          requestBody.content[Object.keys(requestBody.content)[0]].schema
        }
        topLevel={true}
      />
    </>
  )
}

export default TagsOperationDescriptionSectionRequest
