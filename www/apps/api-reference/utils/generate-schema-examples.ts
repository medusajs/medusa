import { OpenAPI } from "types"
import type { JSONSchema7 } from "json-schema"
import stringify from "json-stringify-pretty-compact"
import { sample } from "openapi-sampler"

export type GenerateSchemaExamplesOptions = {
  schema?: OpenAPI.SchemaObject
  schemaExamples?: OpenAPI.OpenAPIV3.ExampleObject
  schemaExample?: any
  options?: {
    skipNonRequired?: boolean
  }
}

/**
 * Pure (non-hook) generator of schema examples, shared by the client
 * `use-schema-example` hook and the server-side Markdown converters. Produces
 * the same `ExampleObject[]` the UI renders in code blocks.
 */
export default function generateSchemaExamples({
  schema,
  schemaExamples,
  schemaExample,
  options = {},
}: GenerateSchemaExamplesOptions): OpenAPI.ExampleObject[] {
  const { skipNonRequired = true } = options
  const tempExamples: OpenAPI.ExampleObject[] = []

  if (!schema) {
    return tempExamples
  }

  if (schemaExamples) {
    Object.entries(schemaExamples).forEach(([value, example]) => {
      if ("$ref" in example) {
        return
      }

      tempExamples.push({
        title: example.summary || "",
        value,
        content: stringify(example.value, {
          maxLength: 50,
        }),
      })
    })
  } else if (schemaExample) {
    tempExamples.push({
      title: "",
      value: "",
      content: stringify(schemaExample, {
        maxLength: 50,
      }),
    })
  } else {
    const contentSample = stringify(
      sample(
        {
          ...schema,
        } as JSONSchema7,
        {
          skipNonRequired,
        }
      ),
      {
        maxLength: 50,
      }
    )

    tempExamples.push({
      title: "",
      value: "",
      content: contentSample,
    })
  }

  return tempExamples
}
