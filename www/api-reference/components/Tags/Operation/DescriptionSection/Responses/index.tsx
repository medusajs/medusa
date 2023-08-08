import type { ResponsesObject } from "@/types/openapi"
import clsx from "clsx"
import Details from "@/components/Details"
import DetailsSummary from "../../../../Details/Summary"
import Badge from "../../../../Badge"
import TagOperationParameters from "../../Parameters"

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
          return (
            <>
              {response.content && (
                <>
                  {(code === "200" || code === "201") && (
                    <>
                      <DetailsSummary
                        title={`${code} ${response.description}`}
                        subtitle={Object.keys(response.content)[0]}
                        badge={<Badge variant="green">Success</Badge>}
                        expandable={false}
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
                  {code !== "200" && code !== "201" && (
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
                    <Badge
                      variant={
                        code === "200" || code === "201" ? "green" : "red"
                      }
                    >
                      {code === "200" || code === "201" ? "Success" : "Error"}
                    </Badge>
                  }
                  expandable={false}
                />
              )}
            </>
          )
        })}
      </div>
    </>
  )
}

export default TagsOperationDescriptionSectionResponses
