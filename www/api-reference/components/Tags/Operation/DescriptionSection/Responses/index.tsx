import Loading from "@/components/Loading"
import type { ResponsesObject } from "@/types/openapi"
import clsx from "clsx"
import dynamic from "next/dynamic"
import type { TagOperationParametersProps } from "../../Parameters"
import { Suspense } from "react"
import Details from "@/components/Details"

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("../../Parameters"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersProps>

export type TagsOperationDescriptionSectionResponsesProps = {
  responses: ResponsesObject
}

const TagsOperationDescriptionSectionResponses = ({
  responses,
}: TagsOperationDescriptionSectionResponsesProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <h4>Responses</h4>
      {Object.entries(responses).map(([code, response]) => {
        return (
          <div key={code}>
            {response.content && (
              <Details
                summaryElm={
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
                }
              >
                <>
                  <div
                    className={clsx(
                      "border-medusa-border-base dark:border-medusa-border-base-dark border-b border-solid",
                      "mb-1"
                    )}
                  >
                    <span className={clsx("uppercase")}>Response Schema:</span>{" "}
                    {Object.keys(response.content)[0]}
                  </div>
                  <TagOperationParameters
                    schemaObject={
                      response.content[Object.keys(response.content)[0]].schema
                    }
                    topLevel={true}
                  />
                </>
              </Details>
            )}
            {!response.content && (
              <div
                className={clsx(
                  "mb-1 rounded-sm py-0.5 px-1",
                  code.match(/20[0-9]/) &&
                    "bg-medusa-tag-green-bg dark:bg-medusa-tag-green-bg-dark text-medusa-tag-green-text dark:text-medusa-tag-green-text-dark",
                  !code.match(/20[0-9]/) &&
                    "bg-medusa-tag-red-bg dark:bg-medusa-tag-red-bg-dark text-medusa-tag-red-text dark:text-medusa-tag-red-text-dark"
                )}
              >
                {code} {response.description}
              </div>
            )}
          </div>
        )
      })}
    </Suspense>
  )
}

export default TagsOperationDescriptionSectionResponses
