import Loading from "@/app/loading"
import { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import type { TagOperationParametersDefaultProps } from "../Default"
import type { TagOperationParamatersObjectProps } from "../Object"

const TagOperationParametersObject = dynamic<TagOperationParamatersObjectProps>(
  async () => import("../Object"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParamatersObjectProps>
const TagOperationParametersDefault =
  dynamic<TagOperationParametersDefaultProps>(
    async () => import("../Default"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagOperationParametersDefaultProps>

export type TagOperationParametersPropertiesProps = {
  schema: SchemaObject
}

const TagOperationParametersProperties = ({
  schema,
}: TagOperationParametersPropertiesProps) => {
  return (
    <>
      {Object.entries(schema.properties).map(([key, value]) => {
        return (
          <div key={key}>
            {value.type === "object" && value.properties && (
              <TagOperationParametersObject
                name={key}
                schema={value}
                is_required={schema.required?.includes(key)}
              />
            )}
            {value.type !== "object" && (
              <TagOperationParametersDefault name={key} schema={value} />
            )}
          </div>
        )
      })}
    </>
  )
}

export default TagOperationParametersProperties
