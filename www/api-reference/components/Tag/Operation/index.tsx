"use client"

import { Operation } from "@/types/openapi"
import clsx from "clsx"
import { OpenAPIV3 } from "openapi-types"
import getSectionId from "@/utils/get-section-id"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import Loading from "@/app/loading"
import type { TagOperationParametersProps } from "./Parameters"
import { useInView } from "react-intersection-observer"
import { useSidebar } from "@/providers/sidebar"

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("./Parameters"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersProps>

export type TagOperationProps = {
  operation: Operation
  method?: string
  tag: OpenAPIV3.TagObject
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TagOperation = ({ operation, method }: TagOperationProps) => {
  const { setActivePath } = useSidebar()
  const path = getSectionId([operation.operationId])
  const { ref } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView) {
        // can't use router as it doesn't support
        // not scrolling
        history.pushState({}, "", `#${path}`)
        setActivePath(path)
      }
    },
  })
  console.log(operation.responses)
  return (
    <Suspense fallback={<Loading />}>
      <div className={clsx("flex min-h-screen")} id={path} ref={ref}>
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
          <h4>Responses</h4>
          {Object.entries(operation.responses).map(([code, response]) => (
            <div key={code}>
              {response.content && (
                <details open={code === "200"}>
                  <summary
                    className={clsx(
                      "mb-1 rounded-sm py-0.5 px-1",
                      code.match(/20[0-9]/) &&
                        "bg-medusa-tag-green-bg dark:bg-medusa-tag-green-bg-dark text-medusa-tag-green-text dark:text-medusa-tag-green-text-dark",
                      !code.match(/20[0-9]/) &&
                        "bg-medusa-tag-red-bg dark:bg-medusa-tag-red-bg-dark text-medusa-tag-red-text dark:text-medusa-tag-red-text-dark"
                    )}
                  >
                    {code} {response.description}
                  </summary>

                  <>
                    <div
                      className={clsx(
                        "border-medusa-border-base dark:border-medusa-border-base-dark border-b border-solid",
                        "mb-1"
                      )}
                    >
                      <span className={clsx("uppercase")}>
                        Response Schema:
                      </span>{" "}
                      {Object.keys(response.content)[0]}
                    </div>
                    <TagOperationParameters
                      schemaObject={
                        response.content[Object.keys(response.content)[0]]
                          .schema
                      }
                    />
                  </>
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
    </Suspense>
  )
}

export default TagOperation
