import clsx from "clsx"
import React, { ReactNode, useImperativeHandle } from "react"

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode
}

const Checkbox = React.forwardRef(
  ({ label, value, className, id, ...rest }: CheckboxProps, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => checkboxRef.current)
    return (
      <label
        className={clsx(
          "flex items-center cursor-pointer gap-xsmall",
          className
        )}
        htmlFor={id}
      >
        <input
          type="checkbox"
          ref={checkboxRef}
          className="form-checkbox w-[20px] h-[20px] rounded-base text-violet-60 focus:ring-0 border-grey-30 cursor-pointer"
          value={value}
          id={id}
          {...rest}
        />
        <span>{label}</span>
      </label>
    )
  }
)

export default Checkbox
