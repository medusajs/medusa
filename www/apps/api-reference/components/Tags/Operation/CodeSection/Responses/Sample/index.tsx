import { CodeBlock } from "docs-ui"
import type { ExampleObject, ResponseObject } from "@/types/openapi"
import type { JSONSchema7 } from "json-schema"
import stringify from "json-stringify-pretty-compact"
import { sample } from "openapi-sampler"
import { useCallback, useEffect, useState } from "react"

export type TagsOperationCodeSectionResponsesSampleProps = {
  response: ResponseObject
} & React.AllHTMLAttributes<HTMLDivElement>

const TagsOperationCodeSectionResponsesSample = ({
  response,
  className,
}: TagsOperationCodeSectionResponsesSampleProps) => {
  const [examples, setExamples] = useState<ExampleObject[]>([])
  const [selectedExample, setSelectedExample] = useState<
    ExampleObject | undefined
  >()

  const initExamples = useCallback(() => {
    if (!response.content) {
      return []
    }
    const contentSchema = Object.values(response.content)[0]
    const tempExamples = []
    if (contentSchema.examples) {
      Object.entries(contentSchema.examples).forEach(([value, example]) => {
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
    } else if (contentSchema.example) {
      tempExamples.push({
        title: "",
        value: "",
        content: stringify(contentSchema.example, {
          maxLength: 50,
        }),
      })
    } else {
      const contentSample = stringify(
        sample(
          {
            ...contentSchema.schema,
          } as JSONSchema7,
          {
            skipNonRequired: true,
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
  }, [response.content])

  useEffect(() => {
    const tempExamples = initExamples()
    setExamples(tempExamples)
    setSelectedExample(tempExamples[0])
  }, [initExamples])

  return (
    <>
      <div className={className}>
        {response.content && (
          <span>Content type: {Object.keys(response.content)[0]}</span>
        )}
        <>
          {examples.length > 1 && (
            <select
              onChange={(event) =>
                setSelectedExample(
                  examples.find((ex) => ex.value === event.target.value)
                )
              }
              className="border-medusa-border-base my-1 w-full rounded-sm border p-0.5"
            >
              {examples.map((example, index) => (
                <option value={example.value} key={index}>
                  {example.title}
                </option>
              ))}
            </select>
          )}
          {selectedExample && (
            <CodeBlock
              source={selectedExample.content}
              lang={getLanguageFromMedia(Object.keys(response.content)[0])}
              collapsed={true}
              className="mt-2 mb-0"
            />
          )}
          {!selectedExample && <>Empty Response</>}
        </>
      </div>
    </>
  )
}

export default TagsOperationCodeSectionResponsesSample

const getLanguageFromMedia = (media: string) => {
  return media.substring(media.indexOf("/"))
}
