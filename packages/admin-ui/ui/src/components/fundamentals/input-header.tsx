import clsx from "clsx"
import React from "react"
import IconTooltip from "../molecules/icon-tooltip"

export type InputHeaderProps = {
  label?: string
  required?: boolean
  tooltipContent?: string
  tooltip?: React.ReactNode
  className?: string
}

const InputHeader: React.FC<InputHeaderProps> = ({
  label,
  required = false,
  tooltipContent,
  tooltip,
  className,
}) => {
  return (
    <div
      className={clsx(
        "w-full flex inter-small-semibold text-grey-50 items-center",
        className
      )}
    >
      <label>{label}</label>
      {required && <div className="text-rose-50 "> *</div>}
      {tooltip || tooltipContent ? (
        <div className="flex ml-1.5">
          {tooltip || <IconTooltip content={tooltipContent} />}
        </div>
      ) : null}
    </div>
  )
}

export default InputHeader
