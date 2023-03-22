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
      <div className="mb-2xsmall flex items-center">
        <h3 className="inter-base-semibold">{title}</h3>
        {tooltip && (
          <div className="ml-1.5 flex items-center">
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
