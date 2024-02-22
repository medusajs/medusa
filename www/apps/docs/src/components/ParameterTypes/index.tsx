import clsx from "clsx"
import React, { Suspense, lazy } from "react"
import { Loading } from "docs-ui"

export type Parameter = {
  name: string
  type: string
  optional?: boolean
  defaultValue?: string
  description?: string
  featureFlag?: string
  expandable: boolean
  children?: Parameter[]
}

type ParameterTypesType = {
  parameters: Parameter[]
  expandUrl?: string
  sectionTitle?: string
} & React.HTMLAttributes<HTMLDivElement>

const ParameterTypesItems = lazy(async () => import("./Items"))

const ParameterTypes = ({
  parameters,
  className,
  ...props
}: ParameterTypesType) => {
  return (
    <div
      className={clsx("bg-docs-bg-surface shadow-card-rest rounded", className)}
      {...props}
    >
      <Suspense fallback={<Loading />}>
        <ParameterTypesItems
          parameters={parameters}
          expandUrl={props.expandUrl}
          sectionTitle={props.sectionTitle}
        />
      </Suspense>
    </div>
  )
}

export default ParameterTypes
