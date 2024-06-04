import type { Code } from "@/types/openapi"
import { CodeBlock, CodeTab, CodeTabs } from "docs-ui"
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
      <CodeTabs className="mt-2 !mb-0" group="request-examples">
        {codeSamples.map((codeSample, index) => (
          <CodeTab
            key={index}
            label={codeSample.label}
            value={slugify(codeSample.label)}
          >
            <CodeBlock {...codeSample} collapsed={true} className="!mb-0" />
          </CodeTab>
        ))}
      </CodeTabs>
    </div>
  )
}

export default TagOperationCodeSectionRequestSamples
