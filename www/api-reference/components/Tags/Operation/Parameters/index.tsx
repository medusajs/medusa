import Loading from "@/components/Loading"
import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import type { TagOperationParametersObjectProps } from "./Types/Object"
import type { TagOperationParametersDefaultProps } from "./Types/Default"
import type { TagOperationParametersArrayProps } from "./Types/Array"
import type { TagOperationParametersUnionProps } from "./Types/Union"
import type { TagOperationParamatersOneOfProps } from "./Types/OneOf"
import { Suspense } from "react"

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
}

const TagOperationParameters = ({
  schemaObject,
  topLevel = false,
  className,
}: TagOperationParametersProps) => {
  const getElement = () => {
    if (schemaObject.type === "object") {
      return (
        <TagOperationParametersObject
          name={schemaObject.title || ""}
          schema={schemaObject}
          topLevel={topLevel}
        />
      )
    }

    if (schemaObject.type === "array") {
      return (
        <TagOperationParametersArray
          name={schemaObject.title || ""}
          schema={schemaObject}
        />
      )
    }

    if (schemaObject.anyOf || schemaObject.allOf) {
      return (
        <TagOperationParametersUnion
          schema={schemaObject}
          name={schemaObject.title || ""}
          is_required={false}
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

    return (
      <TagOperationParametersDefault
        schema={schemaObject}
        name={schemaObject.title}
        is_required={false}
      />
    )

    return <></>
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className={className}>{getElement()}</div>
    </Suspense>
  )
}

export default TagOperationParameters
