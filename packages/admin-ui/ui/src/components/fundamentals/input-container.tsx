import clsx from "clsx"
import React, { MouseEventHandler } from "react"

type InputContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  onFocusLost?: () => void
}

const InputContainer: React.FC<InputContainerProps> = ({
  onClick,
  onFocusLost,
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      tabIndex={-1}
      onClick={onClick}
      onBlur={(e) => {
        if (onFocusLost && !e.currentTarget.contains(e.relatedTarget)) {
          onFocusLost()
        }
      }}
      className={clsx([
        `bg-grey-5 inter-base-regular h-18 border-grey-20 focus-within:shadow-input focus-within:border-violet-60 rounded-rounded flex w-full cursor-text flex-col border p-3`,
        className,
      ])}
    >
      {children}
    </div>
  )
}

export default InputContainer
