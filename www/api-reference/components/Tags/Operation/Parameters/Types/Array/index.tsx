import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import Loading from "@/components/Loading"
import type { TagOperationParamatersObjectProps } from "../Object"
import type { TagOperationParametersDefaultProps } from "../Default"

const TagOperationParametersDefault =
  dynamic<TagOperationParametersDefaultProps>(
    async () => import("../Default"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagOperationParametersDefaultProps>

const TagOperationParametersObject = dynamic<TagOperationParamatersObjectProps>(
  async () => import("../Object"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParamatersObjectProps>

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
        <TagOperationParametersObject
          name={name}
          schema={schema.items}
          is_required={is_required}
        />
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
