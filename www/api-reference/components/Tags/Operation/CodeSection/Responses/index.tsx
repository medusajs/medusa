import type { Operation } from "@/types/openapi"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import type { TagsOperationCodeSectionResponsesSampleProps } from "./Sample"
import Loading from "@/components/Loading"

const TagsOperationCodeSectionResponsesSample =
  dynamic<TagsOperationCodeSectionResponsesSampleProps>(
    async () => import("./Sample"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagsOperationCodeSectionResponsesSampleProps>

type TagsOperationCodeSectionResponsesProps = {
  operation: Operation
}

const TagsOperationCodeSectionResponses = ({
  operation,
}: TagsOperationCodeSectionResponsesProps) => {
  const [responseCodes, setResponseCodes] = useState(
    Object.keys(operation.responses).filter(
      (responseCode) => operation.responses[responseCode].content
    )
  )
  const [selectedResponseTab, setSelectedResponseTab] = useState("")

  useEffect(() => {
    if (!selectedResponseTab && responseCodes.length) {
      setSelectedResponseTab(responseCodes[0])
    }
  }, [responseCodes])

  return (
    <div>
      <h3>Response samples</h3>
      <div className="mb-1 flex gap-1">
        {responseCodes.map((responseCode, index) => (
          <button
            key={index}
            onClick={() => setSelectedResponseTab(responseCode)}
            className={clsx(
              "text-medusa-text-base dark:text-medusa-text-base-dark border-medusa-border-base dark:border-medusa-border-base-dark cursor-pointer rounded border p-0.5",
              selectedResponseTab === responseCode &&
                "bg-medusa-bg-interactive dark:bg-medusa-bg-interactive-dark text-medusa-text-on-color",
              selectedResponseTab !== responseCode &&
                "bg-medusa-bg-base dark:bg-medusa-bg-base-dark"
            )}
          >
            {responseCode}
          </button>
        ))}
      </div>

      {responseCodes.map((responseCode, index) => (
        <TagsOperationCodeSectionResponsesSample
          response={operation.responses[responseCode]}
          key={index}
          className={clsx(responseCode !== selectedResponseTab && "hidden")}
        />
      ))}
    </div>
  )
}

export default TagsOperationCodeSectionResponses
