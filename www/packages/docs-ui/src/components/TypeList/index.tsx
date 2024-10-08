import clsx from "clsx"
import React, { Suspense, lazy } from "react"
import { Loading } from "@/components"

export type CommonProps = {
  expandUrl?: string
  sectionTitle?: string
}

export type Type = {
  name: string
  type: string
  optional?: boolean
  defaultValue?: string
  description?: string
  featureFlag?: string
  expandable: boolean
  children?: Type[]
}

type ParameterTypesType = {
  types: Type[]
  sectionTitle?: string
} & CommonProps &
  React.HTMLAttributes<HTMLDivElement>

const TypeListItems = lazy(async () => import("./Items"))

export const TypeList = ({
  types,
  className,
  sectionTitle,
  expandUrl,
  ...props
}: ParameterTypesType) => {
  return (
    <div
      className={clsx(
        "bg-medusa-bg-subtle rounded my-docs_1",
        "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
        className
      )}
      {...props}
    >
      <Suspense fallback={<Loading />}>
        <TypeListItems
          types={types}
          expandUrl={expandUrl}
          sectionTitle={sectionTitle}
        />
      </Suspense>
    </div>
  )
}
