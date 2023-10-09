import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import type { TagOperationParametersDefaultProps } from "../Default"
import type { TagOperationParametersProps } from "../.."
import TagsOperationParametersNested from "../../Nested"
import { Details, Loading } from "docs-ui"

const TagOperationParametersDefault =
  dynamic<TagOperationParametersDefaultProps>(
    async () => import("../Default"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagOperationParametersDefaultProps>

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("../.."),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersProps>

export type TagOperationParametersArrayProps = {
  name: string
  schema: SchemaObject
  isRequired?: boolean
}

const TagOperationParametersArray = ({
  name,
  schema,
  isRequired,
}: TagOperationParametersArrayProps) => {
  if (schema.type !== "array") {
    return <></>
  }

  if (
    !schema.items ||
    (schema.items.type !== "object" &&
      schema.items.type !== "array" &&
      schema.items.type !== undefined) ||
    (schema.items.type === "object" &&
      !schema.items.properties &&
      !schema.items.allOf &&
      !schema.items.anyOf &&
      !schema.items.oneOf)
  ) {
    return (
      <TagOperationParametersDefault
        name={name}
        schema={schema}
        isRequired={isRequired}
      />
    )
  }

  return (
    <Details
      summaryElm={
        <summary className="cursor-pointer">
          <TagOperationParametersDefault
            name={name}
            schema={schema}
            isRequired={isRequired}
            expandable={true}
          />
        </summary>
      }
      className="!border-y-0"
    >
      <TagsOperationParametersNested>
        <TagOperationParameters schemaObject={schema.items} topLevel={true} />
      </TagsOperationParametersNested>
    </Details>
  )
}

export default TagOperationParametersArray
