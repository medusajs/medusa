import clsx from "clsx"
import React from "react"

type ToasterContainerProps = {
  visible: boolean
} & React.HTMLAttributes<HTMLDivElement>

const ToasterContainer: React.FC<ToasterContainerProps> = ({
  children,
  visible,
  className,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        "bg-grey-90 p-base rounded-rounded shadow-toaster mb-xsmall flex items-start border last:mb-0",
        {
          "animate-enter": visible,
        },
        {
          "animate-leave": !visible,
        },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default ToasterContainer
