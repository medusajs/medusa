import type { RequestObject } from "@/types/openapi"
import Loading from "@/components/Loading"
import { Suspense } from "react"
import TagsOperationParametersSection from "../../Parameters/Section"

export type TagsOperationDescriptionSectionRequestProps = {
  requestBody: RequestObject
}

const TagsOperationDescriptionSectionRequest = ({
  requestBody,
}: TagsOperationDescriptionSectionRequestProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <TagsOperationParametersSection
        header="Request Body Schema"
        subheader={Object.keys(requestBody.content)[0]}
        schema={requestBody.content[Object.keys(requestBody.content)[0]].schema}
      />
    </Suspense>
  )
}

export default TagsOperationDescriptionSectionRequest
