import Loading from "@/components/Loading"
import type { Code } from "@/types/openapi"
import { Suspense, useState } from "react"
import CodeTabs from "@/components/CodeTabs"
import slugify from "slugify"

export type TagOperationCodeSectionRequestSamplesProps = {
  codeSamples: Code[]
}

const TagOperationCodeSectionRequestSamples = ({
  codeSamples,
}: TagOperationCodeSectionRequestSamplesProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <h3>Request samples</h3>
      <CodeTabs
        tabs={codeSamples.map((codeSample) => ({
          label: codeSample.label,
          value: slugify(codeSample.label),
          code: codeSample,
        }))}
      />
    </Suspense>
  )
}

export default TagOperationCodeSectionRequestSamples
