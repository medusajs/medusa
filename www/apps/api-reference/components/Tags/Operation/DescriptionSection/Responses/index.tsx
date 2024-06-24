import type { ResponsesObject } from "@/types/openapi"
import clsx from "clsx"
import TagOperationParameters from "../../Parameters"
import { Fragment } from "react"
import { Badge, Details, DetailsSummary } from "docs-ui"

export type TagsOperationDescriptionSectionResponsesProps = {
  responses: ResponsesObject
}

const TagsOperationDescriptionSectionResponses = ({
  responses,
}: TagsOperationDescriptionSectionResponsesProps) => {
  return (
    <>
      <h3 className="my-1.5">Responses</h3>
      <div
        className={clsx("[&>details:not(:first-of-type)>summary]:border-t-0")}
      >
        {Object.entries(responses).map(([code, response], index) => {
          const successCode = code.startsWith("20")
          return (
            <Fragment key={index}>
              {response.content && (
                <>
                  {successCode && (
                    <>
                      <DetailsSummary
                        title={`${code} ${response.description}`}
                        subtitle={Object.keys(response.content)[0]}
                        badge={<Badge variant="green">Success</Badge>}
                        expandable={false}
                        className={clsx(
                          index !== 0 && "border-t-0",
                          index === 0 && "border-b-0"
                        )}
                      />
                      <TagOperationParameters
                        schemaObject={
                          response.content[Object.keys(response.content)[0]]
                            .schema
                        }
                        topLevel={true}
                      />
                    </>
                  )}
                  {!successCode && (
                    <Details
                      summaryElm={
                        <DetailsSummary
                          title={`${code} ${response.description}`}
                          subtitle={Object.keys(response.content)[0]}
                          badge={<Badge variant="red">Error</Badge>}
                          open={index === 0}
                        />
                      }
                      openInitial={index === 0}
                      className={clsx(index > 1 && "border-t-0")}
                    >
                      <TagOperationParameters
                        schemaObject={
                          response.content[Object.keys(response.content)[0]]
                            .schema
                        }
                        topLevel={true}
                      />
                    </Details>
                  )}
                </>
              )}
              {!response.content && (
                <DetailsSummary
                  title={`${code} ${response.description}`}
                  subtitle={"Empty response"}
                  badge={
                    <Badge variant={successCode ? "green" : "red"}>
                      {successCode ? "Success" : "Error"}
                    </Badge>
                  }
                  expandable={false}
                  className={clsx(
                    index !== 0 && "border-t-0",
                    index === 0 &&
                      Object.entries(responses).length > 1 &&
                      "border-b-0"
                  )}
                />
              )}
            </Fragment>
          )
        })}
      </div>
    </>
  )
}

export default TagsOperationDescriptionSectionResponses
