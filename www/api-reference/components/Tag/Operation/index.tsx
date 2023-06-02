import { Operation } from "@/types/openapi"
import { OpenAPIV3 } from "openapi-types"

type TagOperationProps = {
  operation: Operation
  method?: string
  tag: OpenAPIV3.TagObject
}

const TagOperation = ({ operation, method }: TagOperationProps) => {
  return (
    <li>
      {method}: {operation.operationId}
    </li>
  )
}

export default TagOperation
