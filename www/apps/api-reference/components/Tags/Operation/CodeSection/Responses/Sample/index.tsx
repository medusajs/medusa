import { CodeBlock } from "docs-ui"
import type { ExampleObject, ResponseObject } from "@/types/openapi"
import { useEffect, useState } from "react"
import useSchemaExample from "../../../../../../hooks/use-schema-example"

export type TagsOperationCodeSectionResponsesSampleProps = {
  response: ResponseObject
} & React.AllHTMLAttributes<HTMLDivElement>

const TagsOperationCodeSectionResponsesSample = ({
  response,
  className,
}: TagsOperationCodeSectionResponsesSampleProps) => {
  const contentSchema = response.content
    ? Object.values(response.content)[0]
    : undefined
  const { examples } = useSchemaExample({
    schema: contentSchema?.schema,
    schemaExample: contentSchema?.example,
    schemaExamples: contentSchema?.examples,
  })
  const [selectedExample, setSelectedExample] = useState<
    ExampleObject | undefined
  >()

  useEffect(() => {
    setSelectedExample(examples[0])
  }, [examples])

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
