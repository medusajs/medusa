import type { CodeBlockProps } from "@/components/CodeBlock"
import Loading from "@/components/Loading"
import type { ExampleObject, ResponseObject } from "@/types/openapi"
import clsx from "clsx"
import type { JSONSchema7 } from "json-schema"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

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
  const [examples, setExamples] = useState<ExampleObject[]>([])
  const [selectedExample, setSelectedExample] = useState("")

  useEffect(() => {
    async function initExamples() {
      if (!response.content) {
        return
      }

      const contentSchema = Object.values(response.content)[0]
      const tempExamples = []

      const stringify = (await import("json-stringify-pretty-compact")).default

      if (contentSchema.examples) {
        Object.entries(contentSchema.examples).forEach(([value, example]) => {
          if ("$ref" in example) {
            return
          }

          tempExamples.push({
            title: example.summary,
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
        const sample = (await import("openapi-sampler")).sample
        const contentSample = sample({
          ...contentSchema.schema,
        } as JSONSchema7)

        tempExamples.push({
          title: "",
          value: "",
          content: stringify(contentSample, {
            maxLength: 50,
          }),
        })
      }

      setExamples(tempExamples)
      setSelectedExample(tempExamples[0].value)
    }

    void initExamples()
  }, [response])

  return (
    <div className={className}>
      <fieldset className="border-medusa-border-base dark:border-medusa-border-base-dark rounded border p-0.5">
        <legend>Content type</legend>
        <span>{Object.keys(response.content)[0]}</span>
      </fieldset>
      {examples.length > 0 && (
        <div>
          {examples.length > 1 && (
            <select
              onChange={(event) => setSelectedExample(event.target.value)}
              className="border-medusa-border-base dark:border-medusa-border-base-dark my-1 w-full rounded border p-0.5"
            >
              {examples.map((example, index) => (
                <option value={example.value} key={index}>
                  {example.title}
                </option>
              ))}
            </select>
          )}
          {examples.map((example, index) => (
            <div
              className={clsx(selectedExample !== example.value && "hidden")}
              key={index}
            >
              <CodeBlock
                code={example.content}
                language={getLanguageFromMedia(
                  Object.keys(response.content)[0]
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TagsOperationCodeSectionResponsesSample

const getLanguageFromMedia = (media: string) => {
  return media.substring(media.indexOf("/"))
}
