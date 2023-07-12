import type { SchemaObject } from "@/types/openapi"
import TagOperationParametersDescription from "../../Description"
import clsx from "clsx"
import dynamic from "next/dynamic"
import type { TagOperationParametersNameProps } from "../../Name"
import Loading from "@/components/Loading"

const TagOperationParametersName = dynamic<TagOperationParametersNameProps>(
  async () => import("../../Name"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersNameProps>

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
