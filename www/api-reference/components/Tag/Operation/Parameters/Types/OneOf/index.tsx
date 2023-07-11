import { SchemaObject } from "@/types/openapi"
import clsx from "clsx"
import { useState } from "react"
import TagOperationParameters from "../.."

export type TagOperationParamatersOneOfProps = {
  schema: SchemaObject
}

const TagOperationParamatersOneOf = ({
  schema,
}: TagOperationParamatersOneOfProps) => {
  const [activeTab, setActiveTab] = useState<string | undefined>(
    schema.oneOf?.[0].title
  )
  return (
    <div>
      <ul className="flex list-none gap-1">
        {schema.oneOf?.map((item, index) => (
          <li
            key={index}
            className={clsx(
              "cursor-pointer rounded-sm p-0.5",
              "border border-solid",
              activeTab === item.title &&
                "bg-medusa-bg-subtle dark:bg-medusa-bg-subtle-dark border-medusa-border-strong dark:border-medusa-border-strong-dark",
              activeTab !== item.title &&
                "bg-medusa-bg-base dark:bg-medusa-bg-base-dark border-medusa-border-base dark:border-medusa-border-base-dark"
            )}
            onClick={() => setActiveTab(item.title)}
          >
            {item.title}
          </li>
        ))}
      </ul>

      {schema.oneOf?.map((item, index) => (
        <div className={clsx(activeTab !== item.title && "hidden")} key={index}>
          <TagOperationParameters schemaObject={item} />
        </div>
      ))}
    </div>
  )
}

export default TagOperationParamatersOneOf
