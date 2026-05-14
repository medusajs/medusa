"use client"

import React from "react"
import MethodLabel from "@/components/MethodLabel"
import type { OpenAPI } from "types"
import TagsOperationCodeSectionResponses from "./Responses"
import type { TagOperationCodeSectionRequestSamplesProps } from "./RequestSamples"
import dynamic from "next/dynamic"
import clsx from "clsx"
import { CopyButton } from "docs-ui"
import { SquareTwoStack } from "@medusajs/icons"

const TagOperationCodeSectionRequestSamples =
  dynamic<TagOperationCodeSectionRequestSamplesProps>(
    async () => import("./RequestSamples")
  ) as React.FC<TagOperationCodeSectionRequestSamplesProps>

export type TagOperationCodeSectionProps = {
  operation: OpenAPI.Operation
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
    <div
      className={clsx("mt-2 flex flex-col gap-2", className)}
      data-testid="code-section"
    >
      <div
        className={clsx(
          "bg-medusa-bg-subtle border-medusa-border-base px-0.75 rounded border py-0.5",
          "text-code-body flex w-full justify-between gap-1"
        )}
      >
        <div className={clsx("flex w-[calc(100%-36px)] gap-1")}>
          <MethodLabel method={method} className="h-fit" />
          <code
            className="text-medusa-fg-base =break-words break-all"
            data-testid="endpoint-path"
          >
            {endpointPath}
          </code>
        </div>
        <CopyButton text={endpointPath} tooltipClassName="font-base">
          <SquareTwoStack className="text-medusa-fg-muted" />
        </CopyButton>
      </div>
      {operation["x-codeSamples"] && operation["x-codeSamples"].length > 0 && (
        <TagOperationCodeSectionRequestSamples
          codeSamples={operation["x-codeSamples"]}
        />
      )}
      <TagsOperationCodeSectionResponses operation={operation} />
    </div>
  )
}

export default TagOperationCodeSection
