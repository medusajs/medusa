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

  return (
    <>
      {schema.items?.type === "object" && (
        <details>
          <summary>
            <TagOperationParametersDefault
              name={name}
              schema={schema}
              is_required={is_required}
              className="inline-flex w-[calc(100%-16px)]"
            />
          </summary>

          <TagOperationParametersProperties
            schema={schema.items}
            className="bg-medusa-bg-subtle dark:bg-medusa-bg-subtle-dark pl-1"
          />
        </details>
      )}
      {schema.items?.type !== "object" && (
        <TagOperationParametersDefault
          name={name}
          schema={schema}
          is_required={is_required}
        />
      )}
    </>
  )
}

export default TagOperationParametersArray
