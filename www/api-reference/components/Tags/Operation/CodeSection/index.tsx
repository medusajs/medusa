import MethodLabel from "@/components/MethodLabel"
import type { Operation } from "@/types/openapi"
import TagsOperationCodeSectionResponses from "./Responses"
import type { TagOperationCodeSectionRequestSamplesProps } from "./RequestSamples"
import dynamic from "next/dynamic"

const TagOperationCodeSectionRequestSamples =
  dynamic<TagOperationCodeSectionRequestSamplesProps>(
    async () => import("./RequestSamples")
  ) as React.FC<TagOperationCodeSectionRequestSamplesProps>

export type TagOperationCodeSectionProps = {
  operation: Operation
  method: string
  endpointPath: string
}

const TagOperationCodeSection = ({
  operation,
  method,
  endpointPath,
}: TagOperationCodeSectionProps) => {
  return (
    <>
      <div className="mt-2 flex flex-col gap-1 px-1">
        <div className="bg-medusa-bg-base dark:bg-medusa-bg-base-dark border-medusa-border-base dark:border-medusa-border-base-dark rounded border p-0.5">
          <MethodLabel method={method} />
          <code>{endpointPath}</code>
        </div>
        {operation["x-codeSamples"] && (
          <TagOperationCodeSectionRequestSamples
            codeSamples={operation["x-codeSamples"]}
          />
        )}
        <TagsOperationCodeSectionResponses operation={operation} />
      </div>
    </>
  )
}

export default TagOperationCodeSection
