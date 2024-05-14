import React from "react"
import { InputText } from "../../../.."
import setObjValue from "../../../../utils/set-obj-value"
import { ApiRunnerParamObjectInput } from "../Object"
import { ApiRunnerParamArrayInput } from "../Array"

export type ApiRunnerParamInputProps = {
  paramName: string
  paramValue: unknown
  objPath: string
  setValue: React.Dispatch<React.SetStateAction<unknown>>
}

export const ApiRunnerParamInput = ({
  paramName,
  paramValue,
  objPath,
  setValue,
}: ApiRunnerParamInputProps) => {
  if (Array.isArray(paramValue)) {
    return (
      <ApiRunnerParamArrayInput
        paramName={paramName}
        paramValue={paramValue}
        objPath={objPath}
        setValue={setValue}
      />
    )
  }
  if (typeof paramValue === "object") {
    return (
      <ApiRunnerParamObjectInput
        paramName={paramName}
        paramValue={paramValue}
        objPath={objPath}
        setValue={setValue}
      />
    )
  }

  return (
    <InputText
      name={paramName}
      onChange={(e) => {
        setValue((prev: unknown) => {
          if (Array.isArray(prev)) {
            // try to get index from param name
            const splitPath = objPath.split(".")
            // if param is in an object in the array, the index is
            // the last item of the `objPath`. Otherwise, it's in the param name
            const index = (
              objPath.length > 0 ? splitPath[splitPath.length - 1] : paramName
            )
              .replace("[", "")
              .replace("]", "")
            const intIndex = parseInt(index)

            // if we can't get the index from the param name or obj path
            // just insert the value to the end of the array.
            if (Number.isNaN(intIndex)) {
              return [...prev, e.target.value]
            }

            // if the param is within an object, the value to be set
            // is the updated value of the object. Otherwise, it's just the
            // value of the item.
            const transformedValue =
              prev.length > 0 && typeof prev[0] === "object"
                ? setObjValue({
                    obj: { ...prev[intIndex] },
                    value: e.target.value,
                    path: paramName,
                  })
                : e.target.value

            return [
              ...prev.slice(0, intIndex),
              transformedValue,
              ...prev.slice(intIndex + 1),
            ]
          }

          return typeof prev === "object"
            ? setObjValue({
                obj: { ...prev },
                value: e.target.value,
                path: `${objPath.length ? `${objPath}.` : ""}${paramName}`,
              })
            : e.target.value
        })
      }}
      placeholder={paramName}
      value={
        typeof paramValue === "string"
          ? (paramValue as string)
          : typeof paramValue === "number"
          ? (paramValue as number)
          : `${paramValue}`
      }
    />
  )
}
