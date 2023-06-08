import { SchemaObject } from "@/types/openapi"
import TagOperationParametersDefault from "../Default"

type TagOperationParamatersObject = {
  name: string
  schema: SchemaObject
  is_required?: boolean
}

const TagOperationParametersObject = ({
  name,
  schema,
  is_required,
}: TagOperationParamatersObject) => {
  if (schema.type !== "object" || !schema.properties) {
    return <></>
  }
  return (
    <details>
      <summary>
        <TagOperationParametersDefault
          name={name}
          schema={schema}
          is_required={is_required}
        />
      </summary>

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
    </details>
  )
}

export default TagOperationParametersObject
