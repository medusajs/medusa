import type { SchemaObject } from "@/types/openapi"
import TagOperationParametersDescription from "../../Description"
import clsx from "clsx"
import TagOperationParametersName from "../../Name"

export type TagOperationParametersDefaultProps = {
  name?: string
  schema: SchemaObject
  isRequired?: boolean
  className?: string
}

const TagOperationParametersDefault = ({
  name,
  schema,
  isRequired,
  className,
}: TagOperationParametersDefaultProps) => {
  return (
    <div
      className={clsx(
        "my-0.5 inline-flex w-[calc(100%-16px)] justify-between pl-0.5",
        className
      )}
    >
      {name && (
        <TagOperationParametersName
          name={name}
          isRequired={isRequired}
          schema={schema}
        />
      )}
      <TagOperationParametersDescription schema={schema} />
    </div>
  )
}

export default TagOperationParametersDefault
