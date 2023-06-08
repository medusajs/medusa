import { SchemaObject } from "@/types/openapi"
import clsx from "clsx"
import TagOperationParametersObject from "./Types/Object"
import TagOperationParametersDefault from "./Types/Default"

type TagOperationParametersProps = {
  schemaObject: SchemaObject
}

const TagOperationParameters = ({
  schemaObject,
}: TagOperationParametersProps) => {
  return (
    <div>
      {schemaObject.properties && (
        <ul>
          {Object.entries(schemaObject.properties).map(([key, value]) => (
            <li className={clsx("mt-0.5")} key={key}>
              {value.type === "object" && (
                <TagOperationParametersObject
                  schema={value}
                  name={key}
                  is_required={schemaObject.required?.includes(key)}
                />
              )}
              {value.type === "array" && (
                <TagOperationParametersObject
                  schema={value.items}
                  name={key}
                  is_required={schemaObject.required?.includes(key)}
                />
              )}
              {value.type !== "object" && value.type !== "array" && (
                <TagOperationParametersDefault
                  schema={value}
                  name={key}
                  is_required={schemaObject.required?.includes(key)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TagOperationParameters
