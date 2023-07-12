import { SchemaObject } from "@/types/openapi"
import TagOperationParametersDefault from "../Default"
import dynamic from "next/dynamic"
import Loading from "@/app/loading"
import type { TagOperationParametersPropertiesProps } from "../Properties"

const TagOperationParametersProperties =
  dynamic<TagOperationParametersPropertiesProps>(
    async () => import("../Properties"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagOperationParametersPropertiesProps>

export type TagOperationParametersUnionProps = {
  name: string
  schema: SchemaObject
  is_required?: boolean
}

const TagOperationParametersUnion = ({
  name,
  schema,
  is_required,
}: TagOperationParametersUnionProps) => {
  const objectSchema = schema.anyOf
    ? schema.anyOf.find((item) => item.type === "object" && item.properties)
    : schema.allOf?.find((item) => item.type === "object" && item.properties)

  return (
    <>
      {objectSchema && (
        <details>
          <summary>
            <TagOperationParametersDefault
              name={name}
              schema={schema}
              is_required={is_required}
              className="inline-flex w-11/12"
            />
          </summary>

          <TagOperationParametersProperties
            schema={objectSchema}
            className="bg-medusa-bg-subtle dark:bg-medusa-bg-subtle-dark pl-1"
          />
        </details>
      )}
      {!objectSchema && (
        <TagOperationParametersDefault
          name={name}
          schema={schema}
          is_required={is_required}
        />
      )}
    </>
  )
}

export default TagOperationParametersUnion
