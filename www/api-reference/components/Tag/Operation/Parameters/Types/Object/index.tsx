import { SchemaObject } from "@/types/openapi"
import TagOperationParametersDefault from "../Default"
import TagOperationParametersProperties from "../Properties"

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

      <TagOperationParametersProperties schema={schema} />
    </details>
  )
}

export default TagOperationParametersObject
