import type { RequestObject } from "@/types/openapi"
import clsx from "clsx"
import type { TagOperationParametersProps } from "../../Parameters"
import Loading from "@/components/Loading"
import dynamic from "next/dynamic"

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("../../Parameters"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersProps>

export type TagsOperationDescriptionSectionRequestProps = {
  requestBody: RequestObject
}

const TagsOperationDescriptionSectionRequest = ({
  requestBody,
}: TagsOperationDescriptionSectionRequestProps) => {
  return (
    <>
      <div
        className={clsx(
          "border-medusa-border-base dark:border-medusa-border-base-dark border-b border-solid",
          "mb-1"
        )}
      >
        <span className={clsx("uppercase")}>Request Body Schema:</span>{" "}
        {Object.keys(requestBody.content)[0]}
      </div>
      <TagOperationParameters
        schemaObject={
          requestBody.content[Object.keys(requestBody.content)[0]].schema
        }
      />
    </>
  )
}

export default TagsOperationDescriptionSectionRequest
