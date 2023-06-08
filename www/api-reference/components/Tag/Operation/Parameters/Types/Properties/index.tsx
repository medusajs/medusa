import { SchemaObject } from "@/types/openapi"
import TagOperationParametersObject from "../Object"
import TagOperationParametersDefault from "../Default"

type TagOperationParametersPropertiesProps = {
  schema: SchemaObject
}

const TagOperationParametersProperties = ({
  schema
}: TagOperationParametersPropertiesProps) => {
  return (
    <>
      {Object.entries(schema.properties).map(([key, value]) => {
        const anyOfObject = value.anyOf?.find((type) => type.type === "object")
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