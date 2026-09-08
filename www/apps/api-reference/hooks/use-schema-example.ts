"use client"

import { useMemo } from "react"
import generateSchemaExamples, {
  GenerateSchemaExamplesOptions,
} from "@/utils/generate-schema-examples"

const useSchemaExample = ({
  schema,
  schemaExamples,
  schemaExample,
  options = {},
}: GenerateSchemaExamplesOptions) => {
  const { skipNonRequired = true } = options
  const examples = useMemo(
    () =>
      generateSchemaExamples({
        schema,
        schemaExamples,
        schemaExample,
        options: { skipNonRequired },
      }),
    [schema, schemaExample, schemaExamples, skipNonRequired]
  )

  return {
    examples,
  }
}

export default useSchemaExample
