import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import type { TagOperationParametersObjectProps } from "./Types/Object"
import type { TagOperationParametersDefaultProps } from "./Types/Default"
import type { TagOperationParametersArrayProps } from "./Types/Array"
import type { TagOperationParametersUnionProps } from "./Types/Union"
import type { TagOperationParamatersOneOfProps } from "./Types/OneOf"
import checkRequired from "@/utils/check-required"
import { Loading } from "docs-ui"

const TagOperationParametersObject = dynamic<TagOperationParametersObjectProps>(
  async () => import("./Types/Object"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersObjectProps>
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
const TagOperationParamatersOneOf = dynamic<TagOperationParamatersOneOfProps>(
  async () => import("./Types/OneOf"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParamatersOneOfProps>

export type TagOperationParametersProps = {
  schemaObject: SchemaObject
  topLevel?: boolean
  className?: string
  isRequired?: boolean
}

const TagOperationParameters = ({
  schemaObject,
  className,
  topLevel = false,
  isRequired: originalIsRequired = false,
}: TagOperationParametersProps) => {
  const isRequired =
    originalIsRequired || checkRequired(schemaObject, schemaObject.title)
  const propertyName = schemaObject.parameterName || schemaObject.title || ""

  const getElement = () => {
    if (schemaObject["x-ignore"]) {
      return <></>
    }

    if (schemaObject.anyOf || schemaObject.allOf) {
      return (
        <TagOperationParametersUnion
          schema={schemaObject}
          name={propertyName}
          isRequired={isRequired}
          topLevel={topLevel}
        />
      )
    }

    if (schemaObject.oneOf) {
      return (
        <TagOperationParamatersOneOf
          schema={schemaObject}
          isNested={!topLevel}
        />
      )
    }

    if (schemaObject.type === "array") {
      return (
        <TagOperationParametersArray
          name={propertyName}
          schema={schemaObject}
          isRequired={isRequired}
        />
      )
    }

    if (schemaObject.type === "object" || !schemaObject.type) {
      return (
        <TagOperationParametersObject
          name={propertyName}
          schema={schemaObject}
          topLevel={topLevel}
          isRequired={isRequired}
        />
      )
    }

    return (
      <TagOperationParametersDefault
        schema={schemaObject}
        name={propertyName}
        isRequired={isRequired}
      />
    )
  }

  return <div className={className}>{getElement()}</div>
}

export default TagOperationParameters
