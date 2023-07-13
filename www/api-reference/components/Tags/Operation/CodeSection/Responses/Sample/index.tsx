import Button from "@/components/Button"
import type { CodeBlockProps } from "@/components/CodeBlock"
import Loading from "@/components/Loading"
import type { ExampleObject, ResponseObject } from "@/types/openapi"
import type { JSONSchema7 } from "json-schema"
import stringify from "json-stringify-pretty-compact"
import dynamic from "next/dynamic"
import { sample } from "openapi-sampler"
import { Suspense, useEffect, useState } from "react"

const CodeBlock = dynamic<CodeBlockProps>(
  async () => import("../../../../../CodeBlock"),
  {
    loading: () => <Loading />,
  }
) as React.FC<CodeBlockProps>

export type TagsOperationCodeSectionResponsesSampleProps = {
  response: ResponseObject
} & React.AllHTMLAttributes<HTMLDivElement>

const TagsOperationCodeSectionResponsesSample = ({
  response,
  className,
}: TagsOperationCodeSectionResponsesSampleProps) => {
  if (!response.content) {
    return <>Empty Response</>
  }

  const initExamples = () => {
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
      const contentSample = sample({
        ...contentSchema.schema,
      } as JSONSchema7,
      {
        skipNonRequired: true
      })
  
      const contentSampleDetailed = sample({
        ...contentSchema.schema,
      } as JSONSchema7)
  
      tempExamples.push({
        title: "",
        value: "",
        content: stringify(contentSample, {
          maxLength: 50,
        }),
        contentDetailed: stringify(contentSampleDetailed, {
          maxLength: 50
        })
      })
    }

    return tempExamples
  }

  const [shortVersion, setShortVersion] = useState(true)
  const [examples, setExamples] = useState<ExampleObject[]>([])
  const [selectedExample, setSelectedExample] = useState<ExampleObject | undefined>()

  useEffect(() => {
    const tempExamples = initExamples()
    setExamples(tempExamples)
    setSelectedExample(tempExamples[0])
  }, [])

  console.log(examples, selectedExample)

  return (
    <>
      <div className={className}>
        <fieldset className="border-medusa-border-base dark:border-medusa-border-base-dark rounded border p-0.5">
          <legend>Content type</legend>
          <span>{Object.keys(response.content)[0]}</span>
        </fieldset>
        <div>
          {examples.length > 1 && (
            <select
              onChange={(event) => setSelectedExample(examples.find((ex) => ex.value === event.target.value))}
              className="border-medusa-border-base dark:border-medusa-border-base-dark my-1 w-full rounded border p-0.5"
            >
              {examples.map((example, index) => (
                <option value={example.value} key={index}>
                  {example.title}
                </option>
              ))}
            </select>
          )}
          {selectedExample?.contentDetailed && (
            <div className="flex gap-1 my-1">
              <Button
                isSelected={shortVersion}
                onClick={() => setShortVersion(!shortVersion)}
              >
                Minimal Response
              </Button>
              <Button
                isSelected={!shortVersion}
                onClick={() => setShortVersion(!shortVersion)}
              >
                Detailed Response
              </Button>
            </div>
          )}
          {selectedExample && (
            <CodeBlock
              code={selectedExample.contentDetailed && !shortVersion ? selectedExample.contentDetailed : selectedExample.content}
              language={getLanguageFromMedia(
                Object.keys(response.content)[0]
              )}
              preClassName="max-h-[400px]"
            />
          )}
        </div>
      </div>
    </>
  )
}

export default TagsOperationCodeSectionResponsesSample

const getLanguageFromMedia = (media: string) => {
  return media.substring(media.indexOf("/"))
}
