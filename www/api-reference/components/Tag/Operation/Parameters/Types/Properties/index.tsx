import Loading from "@/app/loading"
import { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"

const TagOperationParametersObject = dynamic(() => import("../Object"), {
  loading: () => <Loading />
})
const TagOperationParametersDefault = dynamic(() => import("../Default"), {
  loading: () => <Loading />
})

type TagOperationParametersPropertiesProps = {
  schema: SchemaObject
}

const TagOperationParametersProperties = ({
  schema
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