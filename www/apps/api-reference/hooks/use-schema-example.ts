"use client"

import { useMemo } from "react"
import { ExampleObject, SchemaObject } from "../types/openapi"
import type { JSONSchema7 } from "json-schema"
import stringify from "json-stringify-pretty-compact"
import { sample } from "openapi-sampler"
import { OpenAPIV3 } from "openapi-types"

type Options = {
  schema?: SchemaObject
  schemaExamples?: OpenAPIV3.ExampleObject
  schemaExample?: any
  options?: {
    skipNonRequired?: boolean
  }
}

const useSchemaExample = ({
  schema,
  schemaExamples,
  schemaExample,
  options = {},
}: Options) => {
  const { skipNonRequired = true } = options
  const examples = useMemo(() => {
    const tempExamples: ExampleObject[] = []

    if (!schema) {
      return tempExamples
    }

    if (schemaExamples) {
      Object.entries(schemaExamples).forEach(([value, example]) => {
        if ("$ref" in example) {
          return []
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
  }, [schema, schemaExample, schemaExamples, skipNonRequired])

  return {
    examples,
  }
}

export default useSchemaExample
