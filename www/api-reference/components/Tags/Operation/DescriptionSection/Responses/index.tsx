import type { ResponsesObject } from "@/types/openapi"
import clsx from "clsx"
import Details from "@/components/Details"
import TagsOperationParametersSection from "../../Parameters/Section"

export type TagsOperationDescriptionSectionResponsesProps = {
  responses: ResponsesObject
}

const TagsOperationDescriptionSectionResponses = ({
  responses,
}: TagsOperationDescriptionSectionResponsesProps) => {
  const getHeaderClasses = (code: string): string => {
    return clsx(
      "mb-1 rounded-sm py-0.5 px-1",
      code.match(/20[0-9]/) &&
        "bg-medusa-tag-green-bg dark:bg-medusa-tag-green-bg-dark text-medusa-tag-green-text dark:text-medusa-tag-green-text-dark",
      !code.match(/20[0-9]/) &&
        "bg-medusa-tag-red-bg dark:bg-medusa-tag-red-bg-dark text-medusa-tag-red-text dark:text-medusa-tag-red-text-dark"
    )
  }

  return (
    <>
      <h4>Responses</h4>
      {Object.entries(responses).map(([code, response], index) => {
        return (
          <div key={code}>
            {response.content && (
              <>
                {(code === "200" || code === "201") && (
                  <>
                    <div className={getHeaderClasses(code)}>
                      {code} {response.description}
                    </div>
                    <TagsOperationParametersSection
                      header="Response Schema"
                      subheader={Object.keys(response.content)[0]}
                      schema={
                        response.content[Object.keys(response.content)[0]]
                          .schema
                      }
                    />
                  </>
                )}
                {code !== "200" && code !== "201" && (
                  <Details
                    summaryElm={
                      <summary className={getHeaderClasses(code)}>
                        {code} {response.description}
                      </summary>
                    }
                    openInitial={index === 0}
                  >
                    <TagsOperationParametersSection
                      header="Response Schema"
                      subheader={Object.keys(response.content)[0]}
                      schema={
                        response.content[Object.keys(response.content)[0]]
                          .schema
                      }
                    />
                  </Details>
                )}
              </>
            )}
            {!response.content && (
              <div className={getHeaderClasses(code)}>
                {code} {response.description}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}

export default TagsOperationDescriptionSectionResponses
