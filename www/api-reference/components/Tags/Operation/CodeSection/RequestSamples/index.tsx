import Loading from "@/components/Loading"
import type { CodeSample } from "@/types/openapi"
import { Suspense, useState } from "react"
import dynamic from "next/dynamic"
import type { CodeBlockProps } from "@/components/CodeBlock"
import Button from "@/components/Button"

const CodeBlock = dynamic<CodeBlockProps>(
  async () => import("../../../../CodeBlock"),
  {
    loading: () => <Loading />,
  }
) as React.FC<CodeBlockProps>

export type TagOperationCodeSectionRequestSamplesProps = {
  codeSamples: CodeSample[]
}

const TagOperationCodeSectionRequestSamples = ({
  codeSamples,
}: TagOperationCodeSectionRequestSamplesProps) => {
  const [selectedRequestTab, setSelectedRequestTab] = useState(0)

  return (
    <Suspense fallback={<Loading />}>
      <h3>Request samples</h3>
      <div className="flex gap-1">
        {codeSamples.map((codeSample, index) => (
          <Button
            onClick={() => setSelectedRequestTab(index)}
            isSelected={selectedRequestTab === index}
            key={index}
          >
            {codeSample.label}
          </Button>
        ))}
      </div>
      <div>
        <CodeBlock
          code={codeSamples[selectedRequestTab].source}
          language={codeSamples[selectedRequestTab].lang}
        />
      </div>
    </Suspense>
  )
}

export default TagOperationCodeSectionRequestSamples
