import type { Operation } from "@/types/openapi"
import clsx from "clsx"
import dynamic from "next/dynamic"
import type { TagsOperationCodeSectionResponsesSampleProps } from "./Sample"

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
    <>
      <h3>
        Response{" "}
        <span
          className={clsx(
            "bg-medusa-tag-green-bg dark:bg-medusa-tag-green-bg-dark text-medusa-tag-green-text dark:text-medusa-tag-green-text-dark",
            "border-medusa-tag-green-border dark:border-medusa-tag-green-border-dark w-[min-content] rounded border p-0.5",
            "text-label-small"
          )}
        >
          {responseCode}
        </span>
      </h3>

      <TagsOperationCodeSectionResponsesSample response={response} />
    </>
  )
}

export default TagsOperationCodeSectionResponses
