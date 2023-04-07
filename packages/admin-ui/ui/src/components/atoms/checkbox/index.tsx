import clsx from "clsx"
import React, { ReactNode, useImperativeHandle } from "react"

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode
}

const Checkbox = React.forwardRef(
  ({ label, value, className, id, ...rest }: CheckboxProps, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => checkboxRef.current)
    return (
      <label
        className={clsx("flex cursor-pointer items-center", className)}
        htmlFor={id}
      >
        <input
          type="checkbox"
          ref={checkboxRef}
          className="form-checkbox rounded-base text-violet-60 mr-small border-grey-30 h-[20px] w-[20px] focus:ring-0"
          value={value}
          id={id}
          {...rest}
        />
        {label}
      </label>
    )
  }
)

export default Checkbox
