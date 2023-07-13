import type { SchemaObject } from "@/types/openapi"
import TagOperationParametersDefault from "../Default"
import dynamic from "next/dynamic"
import Loading from "@/components/Loading"
import type { TagOperationParametersProps } from "../.."
import clsx from "clsx"
import { useState } from "react"
import Details from "@/components/Details"

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("../.."),
  {
    loading: () => <Loading />
  }
) as React.FC<TagOperationParametersProps>

export type TagOperationParametersObjectProps = {
  name?: string
  schema: SchemaObject
  isRequired?: boolean
  topLevel?: boolean
}

const TagOperationParametersObject = ({
  name,
  schema,
  isRequired,
  topLevel = false
}: TagOperationParametersObjectProps) => {
  if (schema.type !== "object" || (!schema.properties && !name)) {
    return <></>
  }

  const getPropertyDescriptionElm = () => {
    return (
      <TagOperationParametersDefault
        name={name}
        schema={schema}
        is_required={isRequired}
        className="inline-flex w-[calc(100%-16px)]"
      />
    )
  }

  const getPropertyParameterElms = (isNested = false) => {
    return (
      <>
        {Object.entries(schema.properties).map(([key, value], index) => (
          <TagOperationParameters
            schemaObject={{
              ...value,
              title: key || value.title
            }}
            key={index}
            className={clsx(
              isNested && "bg-medusa-bg-subtle dark:bg-medusa-bg-subtle-dark pl-1"
            )}
          />
        ))}
      </>
    )
  }

  if (!schema.properties) {
    return getPropertyDescriptionElm()
  }

  if (topLevel) {
    return getPropertyParameterElms()
  }

  return (
    <Details summaryContent={getPropertyDescriptionElm()}>
      {getPropertyParameterElms(true)}
    </Details>
  )
}

export default TagOperationParametersObject
