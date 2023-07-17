import type { SchemaObject } from "@/types/openapi"
import TagOperationParametersDefault from "../Default"
import dynamic from "next/dynamic"
import Loading from "@/components/Loading"
import type { TagOperationParametersProps } from "../.."
import type { TagsOperationParametersNestedProps } from "../../Nested"
import type { DetailsProps } from "@/components/Details"
import checkRequired from "@/utils/check-required"

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("../.."),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersProps>

const TagsOperationParametersNested =
  dynamic<TagsOperationParametersNestedProps>(
    async () => import("../../Nested"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagsOperationParametersNestedProps>

const Details = dynamic<DetailsProps>(
  async () => import("../../../../../Details"),
  {
    loading: () => <Loading />,
  }
) as React.FC<DetailsProps>

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
        isRequired={isRequired}
        className={className}
      />
    )
  }

  const getPropertyParameterElms = (isNested = false) => {
    const content = (
      <>
        {Object.entries(schema.properties).map(([key, value], index) => (
          <TagOperationParameters
            schemaObject={{
              ...value,
              title: key,
            }}
            key={index}
            isRequired={checkRequired(schema, key)}
          />
        ))}
      </>
    )
    return (
      <>
        {isNested && (
          <TagsOperationParametersNested>
            {content}
          </TagsOperationParametersNested>
        )}
        {!isNested && <div>{content}</div>}
      </>
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
