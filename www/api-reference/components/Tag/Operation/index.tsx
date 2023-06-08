import { Operation } from "@/types/openapi"
import clsx from "clsx"
import { OpenAPIV3 } from "openapi-types"
import TagOperationParameters from "./Parameters"
import getSectionId from "@/utils/get-section-id"

type TagOperationProps = {
  operation: Operation
  method?: string
  tag: OpenAPIV3.TagObject
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TagOperation = ({ operation, method }: TagOperationProps) => {
  return (
    <div className={clsx("flex min-h-screen")} id={getSectionId([operation.operationId])}>
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
        <h3>Responses</h3>
        {Object.entries(operation.responses).map(([code, response]) => (
          <div key={code}>
            {response.content && (
              <details>
                <summary
                  className={clsx(
                    "mb-1 rounded-sm p-0.5",
                    code.match(/20[0-9]/) &&
                      "bg-medusa-tag-green-bg dark:bg-medusa-tag-green-bg-dark text-medusa-tag-green-text dark:text-medusa-tag-green-text-dark",
                    !code.match(/20[0-9]/) &&
                      "bg-medusa-tag-red-bg dark:bg-medusa-tag-red-bg-dark text-medusa-tag-red-text dark:text-medusa-tag-red-text-dark"
                  )}
                >
                  {code} {response.description}
                </summary>

                <TagOperationParameters
                  schemaObject={
                    response.content[Object.keys(response.content)[0]].schema
                  }
                />
              </details>
            )}
            {!response.content && (
              <div>
                {code} {response.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TagOperation
