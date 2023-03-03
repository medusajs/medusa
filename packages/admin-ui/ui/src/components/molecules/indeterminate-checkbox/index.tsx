import clsx from "clsx"
import React, { useImperativeHandle } from "react"

import CheckIcon from "../../fundamentals/icons/check-icon"

type IndeterminateCheckboxProps = {
  type?: "checkbox" | "radio"
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  checked?: boolean
  title?: string
  indeterminate?: boolean
  className?: React.HTMLAttributes<HTMLInputElement>["className"]
  name?: string
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
      <div className="flex h-full items-center">
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
    <div className="flex h-full items-center">
      <div
        onClick={handleClick}
        className={`flex h-5 w-5 cursor-pointer justify-center rounded-base border border-grey-30 text-grey-0 ${
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
        defaultChecked={checked}
        ref={innerRef}
        {...rest}
      />
    </div>
  )
})

export default IndeterminateCheckbox
