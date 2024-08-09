import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import type { TagOperationParametersDefaultProps } from "../Default"
import { TagOperationParametersObjectProps } from "../Object"
import { Loading } from "docs-ui"
import mergeAllOfTypes from "../../../../../../utils/merge-all-of-types"

const TagOperationParametersObject = dynamic<TagOperationParametersObjectProps>(
  async () => import("../Object"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersObjectProps>

const TagOperationParametersDefault =
  dynamic<TagOperationParametersDefaultProps>(
    async () => import("../Default"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagOperationParametersDefaultProps>

export type TagOperationParametersUnionProps = {
  name: string
  schema: SchemaObject
  isRequired?: boolean
  topLevel?: boolean
}

const TagOperationParametersUnion = ({
  name,
  schema,
  isRequired,
  topLevel,
}: TagOperationParametersUnionProps) => {
  const objectSchema = schema.anyOf
    ? schema.anyOf.find((item) => item.type === "object" && item.properties)
    : schema.allOf
    ? mergeAllOfTypes(schema)
    : undefined

  if (!objectSchema) {
    return (
      <TagOperationParametersDefault
        schema={schema}
        name={name}
        isRequired={isRequired}
      />
    )
  }

  if (!objectSchema.description) {
    objectSchema.description = schema.anyOf
      ? schema.anyOf.find((item) => item.description !== undefined)?.description
      : schema.allOf?.find((item) => item.description !== undefined)
          ?.description
  }

  return (
    <TagOperationParametersObject
      schema={objectSchema}
      name={name}
      topLevel={topLevel}
    />
  )
}

export default TagOperationParametersUnion
