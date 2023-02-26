import React from "react"
import clsx from "clsx"

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "placeholder:inter-base-regular placeholder-grey-40 focus:outline-none",
        className
      )}
      {...props}
    />
  )
)

export default TextInput
