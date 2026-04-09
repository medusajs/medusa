import clsx from "clsx"
import React, { Suspense, lazy } from "react"
import { Loading } from "@/components/Loading"

export type CommonProps = {
  expandUrl?: string
  sectionTitle?: string
  openedLevel?: number
}

export type Type = {
  name: string
  type: string
  optional?: boolean
  defaultValue?: string
  example?: string
  description?: string
  featureFlag?: string
  expandable: boolean
  children?: Type[]
  deprecated?: {
    is_deprecated: boolean
    description?: string
  }
  since?: string
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
  openedLevel,
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
          openedLevel={openedLevel}
        />
      </Suspense>
    </div>
  )
}
