import React from "react"
import { ApiRunnerParamInput } from "./Default"

export type ApiRunnerParamInputsProps = {
  data: Record<string, unknown>
  title: string
  baseObjPath: string
  setValue: React.Dispatch<React.SetStateAction<unknown>>
}

export const ApiRunnerParamInputs = ({
  data,
  title,
  baseObjPath,
  setValue,
}: ApiRunnerParamInputsProps) => {
  return (
    <div className="flex flex-col gap-docs_0.5">
      <span className="text-compact-medium-plus text-medusa-fg-base">
        {title}
      </span>
      <div className="flex gap-docs_0.5">
        {Object.keys(data).map((pathParam, index) => (
          <ApiRunnerParamInput
            paramName={pathParam}
            paramValue={data[pathParam]}
            objPath={baseObjPath}
            setValue={setValue}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}
