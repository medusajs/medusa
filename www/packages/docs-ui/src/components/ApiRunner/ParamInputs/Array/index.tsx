"use client"

import React, { useEffect, useState } from "react"
import { ApiRunnerParamInput, ApiRunnerParamInputProps } from "../Default"
import clsx from "clsx"
import setObjValue from "@/utils/set-obj-value"
import { Button } from "../../../.."
import { Minus, Plus } from "@medusajs/icons"

export const ApiRunnerParamArrayInput = ({
  paramName,
  paramValue,
  objPath,
  setValue,
}: ApiRunnerParamInputProps) => {
  const [itemsValue, setItemsValue] = useState<typeof paramValue>(paramValue)

  useEffect(() => {
    setValue((prev: unknown) => {
      return typeof prev === "object"
        ? setObjValue({
            obj: { ...prev },
            value: itemsValue,
            path: `${objPath.length ? `${objPath}.` : ""}${paramName}`,
          })
        : itemsValue
    })
  }, [itemsValue])

  if (!Array.isArray(paramValue)) {
    return (
      <ApiRunnerParamInput
        paramName={paramName}
        paramValue={paramValue}
        objPath={objPath}
        setValue={setValue}
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
        <code>{paramName}</code> Array Items
      </legend>
      {(itemsValue as unknown[]).map((value, index) => (
        <div
          key={index}
          className={clsx(
            index > 0 &&
              "flex gap-docs_0.5 items-center justify-center mt-docs_0.5"
          )}
        >
          <ApiRunnerParamInput
            paramName={`[${index}]`}
            paramValue={value}
            objPath={""}
            setValue={setItemsValue}
          />
          {index > 0 && (
            <Button
              buttonType="icon"
              variant="secondary"
              onClick={() => {
                setItemsValue((prev: unknown[]) => prev.splice(index, 1))
              }}
              className="mt-0.5"
            >
              <Minus />
            </Button>
          )}
        </div>
      ))}
      <Button
        buttonType="icon"
        variant="secondary"
        onClick={() => {
          setItemsValue((prev: unknown[]) => [
            ...prev,
            Array.isArray(prev[0])
              ? [...prev[0]]
              : typeof prev[0] === "object"
              ? Object.assign({}, prev[0])
              : prev[0],
          ])
        }}
        className="mt-0.5"
      >
        <Plus />
      </Button>
    </fieldset>
  )
}
