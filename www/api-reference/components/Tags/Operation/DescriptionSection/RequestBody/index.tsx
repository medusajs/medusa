import type { RequestObject } from "@/types/openapi"
import TagsOperationParametersSection from "../../Parameters/Section"

export type TagsOperationDescriptionSectionRequestProps = {
  requestBody: RequestObject
}

const TagsOperationDescriptionSectionRequest = ({
  requestBody,
}: TagsOperationDescriptionSectionRequestProps) => {
  return (
    <>
      <TagsOperationParametersSection
        header="Request Body Schema"
        subheader={Object.keys(requestBody.content)[0]}
        schema={requestBody.content[Object.keys(requestBody.content)[0]].schema}
      />
    </>
  )
}

export default TagsOperationDescriptionSectionRequest
