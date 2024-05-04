import type { Code } from "@/types/openapi"
import { LegacyCodeTabs } from "docs-ui"
import slugify from "slugify"

export type TagOperationCodeSectionRequestSamplesProps = {
  codeSamples: Code[]
}

const TagOperationCodeSectionRequestSamples = ({
  codeSamples,
}: TagOperationCodeSectionRequestSamplesProps) => {
  return (
    <div>
      <h3>Request samples</h3>
      <LegacyCodeTabs
        tabs={codeSamples.map((codeSample) => ({
          label: codeSample.label,
          value: slugify(codeSample.label),
          code: {
            ...codeSample,
            collapsed: true,
            className: "!mb-0",
          },
        }))}
        className="mt-2 !mb-0"
      />
    </div>
  )
}

export default TagOperationCodeSectionRequestSamples
