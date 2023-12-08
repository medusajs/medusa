import type { Operation } from "@/types/openapi"
import dynamic from "next/dynamic"
import type { TagsOperationCodeSectionResponsesSampleProps } from "./Sample"
import { Badge } from "docs-ui"

const TagsOperationCodeSectionResponsesSample =
  dynamic<TagsOperationCodeSectionResponsesSampleProps>(
    async () => import("./Sample")
  ) as React.FC<TagsOperationCodeSectionResponsesSampleProps>

type TagsOperationCodeSectionResponsesProps = {
  operation: Operation
}

const TagsOperationCodeSectionResponses = ({
  operation,
}: TagsOperationCodeSectionResponsesProps) => {
  const responseCodes = Object.keys(operation.responses)
  const responseCode = responseCodes.find((rc) => rc === "200" || rc === "201")
  const response = responseCode ? operation.responses[responseCode] : null

  if (!response) {
    return <></>
  }

  return (
    <div>
      <div className="mb-0.5 flex items-center gap-0.5">
        <h3 className="mb-0">Response </h3>
        <Badge variant="green">{responseCode}</Badge>
      </div>

      <TagsOperationCodeSectionResponsesSample response={response} />
    </div>
  )
}

export default TagsOperationCodeSectionResponses
