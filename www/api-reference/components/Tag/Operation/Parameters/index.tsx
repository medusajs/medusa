import Loading from "@/app/loading"
import { SchemaObject } from "@/types/openapi"
import clsx from "clsx"
import dynamic from "next/dynamic"
import type { TagOperationParamatersObjectProps } from "./Types/Object"
import type { TagOperationParametersDefaultProps } from "./Types/Default"
import type { TagOperationParametersArrayProps } from "./Types/Array"
import type { TagOperationParametersUnionProps } from "./Types/Union"
import TagOperationParamatersOneOf from "./Types/OneOf"

const TagOperationParametersObject = dynamic<TagOperationParamatersObjectProps>(
  async () => import("./Types/Object"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParamatersObjectProps>

const TagOperationParametersDefault =
  dynamic<TagOperationParametersDefaultProps>(
    async () => import("./Types/Default"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagOperationParametersDefaultProps>
const TagOperationParametersArray = dynamic<TagOperationParametersArrayProps>(
  async () => import("./Types/Array"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersArrayProps>
const TagOperationParametersUnion = dynamic<TagOperationParametersUnionProps>(
  async () => import("./Types/Union"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersUnionProps>

export type TagOperationParametersProps = {
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
                content = (
                  <TagOperationParametersObject
                    schema={value}
                    name={key}
                    is_required={schemaObject.required?.includes(key)}
                  />
                )
                break
              case value.type === "array":
                content = (
                  <TagOperationParametersArray
                    schema={value}
                    name={key}
                    is_required={schemaObject.required?.includes(key)}
                  />
                )
                break
              case value.anyOf !== undefined || value.allOf !== undefined:
                content = (
                  <TagOperationParametersUnion
                    schema={value}
                    name={key}
                    is_required={schemaObject.required?.includes(key)}
                  />
                )
                break
              default:
                content = (
                  <TagOperationParametersDefault
                    schema={value}
                    name={key}
                    is_required={schemaObject.required?.includes(key)}
                  />
                )
            }

            return (
              <li className={clsx("mt-0.5")} key={key}>
                {content}
              </li>
            )
          })}
        </ul>
      )}
      {schemaObject.oneOf && (
        <TagOperationParamatersOneOf schema={schemaObject} />
      )}
      {!schemaObject.properties && (
        <TagOperationParametersDefault
          schema={schemaObject}
          name={schemaObject.title}
          is_required={false}
        />
      )}
    </div>
  )
}

export default TagOperationParameters
