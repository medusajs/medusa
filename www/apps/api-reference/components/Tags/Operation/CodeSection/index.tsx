import MethodLabel from "@/components/MethodLabel"
import type { Operation } from "@/types/openapi"
import TagsOperationCodeSectionResponses from "./Responses"
import type { TagOperationCodeSectionRequestSamplesProps } from "./RequestSamples"
import dynamic from "next/dynamic"
import clsx from "clsx"
import CopyButton from "../../../CopyButton"
import IconCopyOutline from "../../../Icons/CopyOutline"

const TagOperationCodeSectionRequestSamples =
  dynamic<TagOperationCodeSectionRequestSamplesProps>(
    async () => import("./RequestSamples")
  ) as React.FC<TagOperationCodeSectionRequestSamplesProps>

export type TagOperationCodeSectionProps = {
  operation: Operation
  method: string
  endpointPath: string
} & React.HTMLAttributes<HTMLDivElement>

const TagOperationCodeSection = ({
  operation,
  method,
  endpointPath,
  className,
}: TagOperationCodeSectionProps) => {
  return (
    <div className={clsx("mt-2 flex flex-col gap-2", className)}>
      <div
        className={clsx(
          "bg-medusa-bg-subtle dark:bg-medusa-code-bg-base-dark border-medusa-border-base dark:border-medusa-border-base-dark px-0.75 rounded border py-0.5",
          "text-code-body flex w-full justify-between gap-1"
        )}
      >
        <div className={clsx("flex w-[calc(100%-36px)] gap-1")}>
          <MethodLabel method={method} className="h-fit" />
          <code className="text-medusa-fg-subtle dark:text-medusa-code-text-base-dark break-words break-all">
            {endpointPath}
          </code>
        </div>
        <CopyButton text={endpointPath} tooltipClassName="font-base">
          <IconCopyOutline iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
        </CopyButton>
      </div>
      {operation["x-codeSamples"] && (
        <TagOperationCodeSectionRequestSamples
          codeSamples={operation["x-codeSamples"]}
        />
      )}
      <TagsOperationCodeSectionResponses operation={operation} />
    </div>
  )
}

export default TagOperationCodeSection
