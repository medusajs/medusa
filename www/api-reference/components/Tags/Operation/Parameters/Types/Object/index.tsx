import type { SchemaObject } from "@/types/openapi"
import TagOperationParametersDefault from "../Default"
import dynamic from "next/dynamic"
import Loading from "@/components/Loading"
import type { TagOperationParametersProps } from "../.."
import clsx from "clsx"
import Details from "@/components/Details"

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("../.."),
  {
    loading: () => <Loading />,
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
  topLevel = false,
}: TagOperationParametersObjectProps) => {
  if (schema.type !== "object" || (!schema.properties && !name)) {
    return <></>
  }

  const getPropertyDescriptionElm = (className?: string) => {
    return (
      <TagOperationParametersDefault
        name={name}
        schema={schema}
        is_required={isRequired}
        className={className}
      />
    )
  }

  const getPropertyParameterElms = (isNested = false) => {
    return (
      <div
        className={clsx(
          isNested &&
            "bg-medusa-bg-subtle dark:bg-medusa-bg-subtle-dark pt-1 pl-2",
          isNested &&
            "border-medusa-border-base dark:border-medusa-border-base-dark my-1 rounded border"
        )}
      >
        {Object.entries(schema.properties).map(([key, value], index) => (
          <TagOperationParameters
            schemaObject={{
              ...value,
              title: key || value.title,
            }}
            key={index}
          />
        ))}
      </div>
    )
  }

  if (!schema.properties) {
    return getPropertyDescriptionElm("pl-1.5")
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
