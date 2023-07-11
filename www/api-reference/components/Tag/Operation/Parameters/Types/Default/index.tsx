import { SchemaObject } from "@/types/openapi"
import TagOperationParametersName from "../../Name"
import TagOperationParametersDescription from "../../Description"

export type TagOperationParametersDefaultProps = {
  name: string
  schema: SchemaObject
  is_required?: boolean
}

const TagOperationParametersDefault = ({
  name,
  schema,
  is_required,
}: TagOperationParametersDefaultProps) => {
  return (
    <div className="flex">
      <TagOperationParametersName name={name} is_required={is_required} />
      <TagOperationParametersDescription schema={schema} />
    </div>
  )
}

export default TagOperationParametersDefault
