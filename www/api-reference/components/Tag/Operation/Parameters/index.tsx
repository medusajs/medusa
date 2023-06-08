import { SchemaObject } from "@/types/openapi"
import clsx from "clsx"

type TagOperationParametersProps = {
  schemaObject: SchemaObject
}

const TagOperationParameters = ({
  schemaObject,
}: TagOperationParametersProps) => {
  console.log(schemaObject)
  return (
    <div>
      {schemaObject.properties && (
        <ul>
          {Object.entries(schemaObject.properties).map(([key, value]) => (
            <li className="mt-0.5 flex" key={key}>
              <span className="font-monospace w-1/3">
                {key}
                {schemaObject.required?.includes(key) && (
                  <>
                    <br />
                    <span className="text-medusa-tag-red-text text-[11px]">
                      required
                    </span>
                  </>
                )}
              </span>
              <span
                className={clsx(
                  "w-2/3 pb-0.5",
                  "border-medusa-border-base dark:border-medusa-border-base-dark border-b border-solid"
                )}
              >
                {value.type}
                {value.description && (
                  <>
                    <br />
                    <span>{value.description}</span>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TagOperationParameters
