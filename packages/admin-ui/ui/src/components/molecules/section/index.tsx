import React from "react"
import IconTooltip from "../icon-tooltip"

type SectionProps = {
  title: string
  description: string
  tooltip?: string
}

const Section: React.FC<SectionProps> = ({
  title,
  description,
  tooltip,
  children,
}) => {
  return (
    <div>
      <div className="flex items-center mb-2xsmall">
        <h3 className="inter-base-semibold">{title}</h3>
        {tooltip && (
          <div className="flex items-center ml-1.5">
            <IconTooltip content={tooltip} />
          </div>
        )}
      </div>
      <p className="inter-small-regular text-grey-50 mb-base">{description}</p>
      {children}
    </div>
  )
}

export default Section
