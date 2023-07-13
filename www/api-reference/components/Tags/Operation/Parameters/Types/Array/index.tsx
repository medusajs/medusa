import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import Loading from "@/components/Loading"
import type { TagOperationParametersDefaultProps } from "../Default"
import type { TagOperationParametersProps } from "../.."
import Details from "@/components/Details"

const TagOperationParametersDefault =
  dynamic<TagOperationParametersDefaultProps>(
    async () => import("../Default"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagOperationParametersDefaultProps>

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("../.."),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersProps>

export type TagOperationParametersArrayProps = {
  name: string
  schema: SchemaObject
  is_required?: boolean
}

const TagOperationParametersArray = ({
  name,
  schema,
  is_required,
}: TagOperationParametersArrayProps) => {
  if (schema.type !== "array") {
    return <></>
  }

  if (!schema.items) {
    return (
      <TagOperationParametersDefault
        name={name}
        schema={schema}
        is_required={is_required}
        className="inline-flex w-[calc(100%-16px)]"
      />
    )
  }

  return (
    <Details summaryContent={(
      <TagOperationParametersDefault
          name={name}
          schema={schema}
          is_required={is_required}
          className="inline-flex w-[calc(100%-16px)]"
        />
    )}>
      <TagOperationParameters
        schemaObject={schema.items}
        className="bg-medusa-bg-subtle dark:bg-medusa-bg-subtle-dark pl-1"
        topLevel={true}
      />
    </Details>
  )
}

export default TagOperationParametersArray
