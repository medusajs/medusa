import React from "react"
import Tooltip, { TooltipProps } from "../../atoms/tooltip"

type TooltipIconProps = TooltipProps & {
  icon: React.ReactNode
}

const TooltipIcon: React.FC<TooltipIconProps> = ({
  content,
  icon,
  ...props
}) => {
  return (
    <Tooltip content={content} side="top" {...props}>
      {icon}
    </Tooltip>
  )
}

export default TooltipIcon
