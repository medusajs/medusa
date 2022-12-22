import clsx from "clsx"
import React, { ChangeEvent, useImperativeHandle } from "react"

import CheckIcon from "../../fundamentals/icons/check-icon"

type IndeterminateCheckboxProps = {
  type?: "checkbox" | "radio"
  onChange?: (e: ChangeEvent) => void
  checked?: boolean
  title?: string
  indeterminate?: boolean
  className?: React.HTMLAttributes<HTMLInputElement>["className"]
  disabled?: boolean // NOTE: only visual, still have to filter disabled ids out
}

const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  IndeterminateCheckboxProps
>(({ indeterminate = false, className, checked, ...rest }, ref) => {
  const type = rest.type || "checkbox"
  const innerRef = React.useRef<HTMLInputElement | null>(null)

  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
    ref,
    () => innerRef.current
  )

  React.useEffect(() => {
    if (innerRef.current) {
      innerRef.current.indeterminate = indeterminate
    }
  }, [innerRef, indeterminate])

  const handleClick = () => {
    if (!rest.disabled && innerRef.current) {
      innerRef.current.click()
    }
  }

  if (type === "radio") {
    return (
      <div className="items-center h-full flex">
        <input
          className={clsx({ "accent-violet-60": checked })}
          type="radio"
          checked={checked}
          ref={innerRef}
          {...rest}
        />
      </div>
    )
  }

  return (
    <div className="items-center h-full flex">
      <div
        onClick={handleClick}
        className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border cursor-pointer rounded-base ${
          rest.disabled
            ? checked
              ? "bg-gray-300"
              : ""
            : checked && "bg-violet-60"
        }`}
      >
        <span className="self-center">
          {checked && <CheckIcon size={16} />}
        </span>
      </div>
      <input
        type="checkbox"
        className={clsx("hidden", className)}
        checked={checked}
        ref={innerRef}
        {...rest}
      />
    </div>
  )
})

export default IndeterminateCheckbox
