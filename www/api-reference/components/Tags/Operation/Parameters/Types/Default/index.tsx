import type { SchemaObject } from "@/types/openapi"
import TagOperationParametersDescription from "../../Description"
import clsx from "clsx"
import dynamic from "next/dynamic"
import type { TagOperationParametersNameProps } from "../../Name"

const TagOperationParametersName = dynamic<TagOperationParametersNameProps>(
  async () => import("../../Name")
) as React.FC<TagOperationParametersNameProps>

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
        <TagOperationParametersName name={name} isRequired={isRequired} />
      )}
      <TagOperationParametersDescription schema={schema} />
    </div>
  )
}

export default TagOperationParametersDefault
