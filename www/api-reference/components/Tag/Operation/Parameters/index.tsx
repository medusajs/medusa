import Loading from "@/app/loading"
import { SchemaObject } from "@/types/openapi"
import clsx from "clsx"
import dynamic from "next/dynamic"

const TagOperationParametersObject = dynamic(() => import("./Types/Object"), {
  loading: () => <Loading />
})
const TagOperationParametersDefault = dynamic(() => import("./Types/Default"), {
  loading: () => <Loading />
})
const TagOperationParametersArray = dynamic(() => import("./Types/Array"), {
  loading: () => <Loading />
})
const TagOperationParametersUnion = dynamic(() => import("./Types/Union"), {
  loading: () => <Loading />
})

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
          {Object.entries(schemaObject.properties).map(([key, value]) => {
            let content = <></>

            switch (true) {
              case value.type === "object":
                content = <TagOperationParametersObject
                  schema={value}
                  name={key}
                  is_required={schemaObject.required?.includes(key)}
                />
                break
              case value.type === "array":
                content = <TagOperationParametersArray schema={value} name={key} is_required={schemaObject.required?.includes(key)} />
                break
              case value.anyOf !== undefined || value.allOf !== undefined:
                content = <TagOperationParametersUnion schema={value} name={key} is_required={schemaObject.required?.includes(key)} />
                break
              default:
                content = <TagOperationParametersDefault
                  schema={value}
                  name={key}
                  is_required={schemaObject.required?.includes(key)}
                />
            }

            return (
              <li className={clsx("mt-0.5")} key={key}>
                {content}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default TagOperationParameters
