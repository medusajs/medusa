import { SchemaObject } from "@/types/openapi"
import clsx from "clsx"

type TagOperationParametersDescriptionProps = {
  schema: SchemaObject
}

const TagOperationParametersDescription = ({
  schema,
}: TagOperationParametersDescriptionProps) => {
  return (
    <span
      className={clsx(
        "w-2/3 pb-0.5",
        "border-medusa-border-base dark:border-medusa-border-base-dark border-b border-solid"
      )}
    >
      {schema.type} {schema.type === "object" && `(${schema.title})`}{" "}
      {schema.anyOf &&
        schema.anyOf.map((type, index) => (
          <>
            {type.type}
            {index < (schema.anyOf?.length || 0) - 1 && " or "}
          </>
        ))}
      {schema.description && (
        <>
          <br />
          <span>{schema.description}</span>
        </>
      )}
    </span>
  )
}

export default TagOperationParametersDescription
