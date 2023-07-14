import type { SchemaObject } from "@/types/openapi"
import dynamic from "next/dynamic"
import Loading from "@/components/Loading"
import type { TagOperationParametersDefaultProps } from "../Default"
import type { TagOperationParametersProps } from "../.."
import Details from "@/components/Details"
import TagsOperationParametersNested from "../../Nested"

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
  is_required?: boolean
}

const TagOperationParametersArray = ({
  name,
  schema,
  is_required,
}: TagOperationParametersArrayProps) => {
  if (schema.type !== "array") {
    return <></>
  }

  if (
    !schema.items ||
    (schema.items.type !== "object" && schema.items.type !== "array") ||
    (schema.items.type === "object" && !schema.items.properties)
  ) {
    return (
      <TagOperationParametersDefault
        name={name}
        schema={schema}
        is_required={is_required}
        className="pl-1.5"
      />
    )
  }

  return (
    <Details
      summaryContent={
        <TagOperationParametersDefault
          name={name}
          schema={schema}
          is_required={is_required}
        />
      }
    >
      <TagsOperationParametersNested>
        <TagOperationParameters schemaObject={schema.items} topLevel={true} />
      </TagsOperationParametersNested>
    </Details>
  )
}

export default TagOperationParametersArray
