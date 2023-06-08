import { Operation } from "@/types/openapi"
import clsx from "clsx"
import { OpenAPIV3 } from "openapi-types"
import TagOperationParameters from "./Parameters"

type TagOperationProps = {
  operation: Operation
  method?: string
  tag: OpenAPIV3.TagObject
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TagOperation = ({ operation, method }: TagOperationProps) => {
  return (
    <div className={clsx("flex min-h-screen")}>
      <div className={clsx("w-api-ref-content")}>
        <h3>{operation.summary}</h3>
        <p>{operation.description}</p>
        {operation.requestBody && (
          <>
            <div
              className={clsx(
                "border-medusa-border-base dark:border-medusa-border-base-dark border-b border-solid",
                "mb-1"
              )}
            >
              <span className={clsx("uppercase")}>Request Body Schema:</span>{" "}
              {Object.keys(operation.requestBody.content)[0]}
            </div>
            <TagOperationParameters
              schemaObject={
                operation.requestBody.content[
                  Object.keys(operation.requestBody.content)[0]
                ].schema
              }
            />
          </>
        )}
      </div>
    </div>
  )
}

export default TagOperation
