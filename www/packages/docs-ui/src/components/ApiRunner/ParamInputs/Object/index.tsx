import React from "react"
import { ApiRunnerParamInput, ApiRunnerParamInputProps } from "../Default"
import clsx from "clsx"

export const ApiRunnerParamObjectInput = ({
  paramName,
  paramValue,
  objPath,
  ...props
}: ApiRunnerParamInputProps) => {
  if (typeof paramValue !== "object") {
    return (
      <ApiRunnerParamInput
        paramName={paramName}
        paramValue={paramValue}
        objPath={objPath}
        {...props}
      />
    )
  }

  return (
    <fieldset
      className={clsx(
        "border border-medusa-border-strong rounded",
        "p-docs_0.5"
      )}
    >
      <legend className="px-docs_0.5">
        <code>{paramName}</code> Properties
      </legend>
      {Object.entries(paramValue as Record<string, unknown>).map(
        ([key, value], index) => (
          <ApiRunnerParamInput
            paramName={key}
            paramValue={value}
            objPath={`${objPath.length ? `${objPath}.` : ""}${paramName}`}
            key={index}
            {...props}
          />
        )
      )}
    </fieldset>
  )
}
