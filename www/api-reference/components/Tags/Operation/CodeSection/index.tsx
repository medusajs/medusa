import CodeBlock from "@/components/CodeBlock"
import MethodLabel from "@/components/MethodLabel"
import { Operation } from "@/types/openapi"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { sample } from "openapi-sampler"
import { JSONSchema7 } from "json-schema"
import stringify from "json-stringify-pretty-compact"
import TagsOperationCodeSectionResponses from "./Responses"

export type TagOperationCodeSectionProps = {
  operation: Operation
  method: string
  endpointPath: string
}

const TagOperationCodeSection = ({
  operation,
  method,
  endpointPath,
}: TagOperationCodeSectionProps) => {
  const [selectedRequestTab, setSelectedRequestTab] = useState(
    operation["x-codeSamples"] ? operation["x-codeSamples"][0].lang : ""
  )
  const [selectedResponseTab, setSelectedResponseTab] = useState("")

  useEffect(() => {
    if (operation.responses) {
      let firstResponseCode = ""
      Object.keys(operation.responses).forEach((responseCode) => {
        if (!operation.responses[responseCode].content) {
          return
        }
        const contentSample = sample(
          Object.values(operation.responses[responseCode].content)[0]
            .schema as JSONSchema7
        )

        operation.responses[responseCode].contentSample = contentSample
          ? stringify(contentSample, {
              maxLength: 50,
            })
          : ""

        if (
          operation.responses[responseCode].contentSample &&
          !firstResponseCode
        ) {
          firstResponseCode = responseCode
        }
      })
      if (firstResponseCode !== selectedResponseTab) {
        setSelectedResponseTab(firstResponseCode)
      }
    }
  }, [])

  return (
    <div className="mt-2 flex flex-col gap-1 px-1">
      <div className="bg-medusa-bg-base dark:bg-medusa-bg-base-dark border-medusa-border-base dark:border-medusa-border-base-dark rounded border p-0.5">
        <MethodLabel method={method} />
        <code>{endpointPath}</code>
      </div>
      {operation["x-codeSamples"] && (
        <div>
          <h3>Request samples</h3>
          <div className="flex gap-1">
            {operation["x-codeSamples"].map((codeSample, index) => (
              <button
                key={index}
                onClick={() => setSelectedRequestTab(codeSample.lang)}
                className={clsx(
                  "text-medusa-text-base dark:text-medusa-text-base-dark rounded border-0 p-0.5",
                  selectedRequestTab === codeSample.lang &&
                    "bg-medusa-bg-interactive dark:bg-medusa-bg-interactive-dark text-medusa-text-on-color",
                  selectedRequestTab !== codeSample.lang &&
                    "bg-medusa-bg-base dark:bg-medusa-bg-base-dark"
                )}
              >
                {codeSample.label}
              </button>
            ))}
          </div>
          <div>
            {operation["x-codeSamples"].map((codeSample, index) => (
              <div
                key={index}
                className={clsx(
                  selectedRequestTab !== codeSample.lang && "hidden"
                )}
              >
                <CodeBlock
                  code={codeSample.source}
                  language={codeSample.lang}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {operation.responses && (
        <TagsOperationCodeSectionResponses operation={operation} />
      )}
    </div>
  )
}

export default TagOperationCodeSection
