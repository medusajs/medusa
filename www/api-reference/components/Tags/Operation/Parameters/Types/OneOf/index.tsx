import type { SchemaObject } from "@/types/openapi"
import clsx from "clsx"
import dynamic from "next/dynamic"
import { Suspense, useState } from "react"
import type { TagOperationParametersProps } from "../.."
import Loading from "@/components/Loading"
import Details from "@/components/Details"
import { TagOperationParametersDefaultProps } from "../Default"

const TagOperationParameters = dynamic<TagOperationParametersProps>(
  async () => import("../.."),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationParametersProps>

const TagOperationParametersDefault =
  dynamic<TagOperationParametersDefaultProps>(
    async () => import("../Default"),
    {
      loading: () => <Loading />,
    }
  ) as React.FC<TagOperationParametersDefaultProps>

export type TagOperationParamatersOneOfProps = {
  schema: SchemaObject
  isNested?: boolean
}

const TagOperationParamatersOneOf = ({
  schema,
  isNested = false,
}: TagOperationParamatersOneOfProps) => {
  const [activeTab, setActiveTab] = useState<number>(0)

  const getContent = () => {
    return (
      <>
        <div className={clsx("flex items-center gap-1", isNested && "mt-1")}>
          <span className="my-2 inline-block pl-1.5">One of</span>
          <ul className="flex list-none gap-1">
            {schema.oneOf?.map((item, index) => (
              <li
                key={index}
                className={clsx(
                  "cursor-pointer rounded-sm p-0.5",
                  "border border-solid",
                  activeTab === index &&
                    "bg-medusa-bg-subtle dark:bg-medusa-bg-subtle-dark border-medusa-border-strong dark:border-medusa-border-strong-dark",
                  activeTab !== index &&
                    "bg-medusa-bg-base dark:bg-medusa-bg-base-dark border-medusa-border-base dark:border-medusa-border-base-dark"
                )}
                onClick={() => setActiveTab(index)}
              >
                {item.title || item.type}
              </li>
            ))}
          </ul>
        </div>

        {schema.oneOf && (
          <div>
            <TagOperationParameters
              schemaObject={schema.oneOf[activeTab]}
              topLevel={true}
            />
          </div>
        )}
      </>
    )
  }

  return (
    <Suspense fallback={<Loading />}>
      {isNested && (
        <Details
          summaryContent={
            <TagOperationParametersDefault
              schema={schema}
              name={schema.title || ""}
            />
          }
        >
          {getContent()}
        </Details>
      )}
      {!isNested && getContent()}
    </Suspense>
  )
}

export default TagOperationParamatersOneOf
