import { SchemaObject } from "@/types/openapi"
import TagOperationParametersName from "../../Name"
import TagOperationParametersDescription from "../../Description"
import clsx from "clsx"

export type TagOperationParametersDefaultProps = {
  name?: string
  schema: SchemaObject
  is_required?: boolean
  className?: string
}

const TagOperationParametersDefault = ({
  name,
  schema,
  is_required,
  className,
}: TagOperationParametersDefaultProps) => {
  return (
    <div className={clsx("flex", className)}>
      {name && (
        <TagOperationParametersName name={name} is_required={is_required} />
      )}
      <TagOperationParametersDescription schema={schema} />
    </div>
  )
}

export default TagOperationParametersDefault
