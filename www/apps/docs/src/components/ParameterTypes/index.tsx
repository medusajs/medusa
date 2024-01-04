import clsx from "clsx"
import React from "react"
import ParameterTypesItems from "./Items"

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
} & React.HTMLAttributes<HTMLDivElement>

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
      <ParameterTypesItems
        parameters={parameters}
        expandUrl={props.expandUrl}
      />
    </div>
  )
}

export default ParameterTypes
