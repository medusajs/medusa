import type { SchemaObject } from "@/types/openapi"
import clsx from "clsx"
import type { TagOperationParametersProps } from ".."
import dynamic from "next/dynamic"
import { Loading } from "docs-ui"

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import(".."),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersProps>

type TagsOperationParametersSectionProps = {
  header?: string
  contentType?: string
  schema: SchemaObject
}

const TagsOperationParametersSection = ({
  header,
  contentType,
  schema,
}: TagsOperationParametersSectionProps) => {
  return (
    <>
      {header && (
        <h3
          className={clsx(!contentType && "my-2", contentType && "mt-2 mb-0")}
        >
          {header}
        </h3>
      )}
      {contentType && (
        <span className={clsx("mb-2 inline-block")}>
          Content type: {contentType}
        </span>
      )}
      <TagOperationParameters schemaObject={schema} topLevel={true} />
    </>
  )
}

export default TagsOperationParametersSection
