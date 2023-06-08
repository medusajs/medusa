import { SchemaObject } from "@/types/openapi"
import TagOperationParametersDefault from "../Default"
import TagOperationParametersProperties from "../Properties"

type TagOperationParametersUnionProps = {
  name: string
  schema: SchemaObject
  is_required?: boolean
}

const TagOperationParametersUnion = ({
  name,
  schema,
  is_required,
}: TagOperationParametersUnionProps) => {
  const objectSchema = schema.anyOf ? schema.anyOf.find((item) => item.type === "object") : schema.allOf?.find((item) => item.type === "object")
  
  return (
    <>
      {objectSchema && (
        <details>
          <summary>
            <TagOperationParametersDefault
              name={name}
              schema={schema}
              is_required={is_required}
            />
          </summary>

          <TagOperationParametersProperties schema={objectSchema} />
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