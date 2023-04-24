import clsx from "clsx"
import React from "react"
import { Toast } from "react-hot-toast"

export type TableToasterContainerProps = {
  children: React.ReactElement[] | React.ReactElement | React.ReactNode
  toast?: Toast
}

export const TableToasterContainer = ({
  children,
  toast,
}: TableToasterContainerProps) => {
  return (
    <div
      className={clsx({
        "animate-enter": toast?.visible,
        "animate-leave": !toast?.visible,
      })}
      {...toast?.ariaProps}
    >
      <div className="flex items-center rounded-rounded bg-grey-90 px-base py-3.5">
        {children}
      </div>
    </div>
  )
}
