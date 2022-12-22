import React from "react"
import { Link } from "react-router-dom"
import ChevronRightIcon from "../../fundamentals/icons/chevron-right-icon"

type SettingsCardProps = {
  icon: React.ReactNode
  heading: string
  description: string
  to?: string
  externalLink?: string
  disabled: boolean
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  icon,
  heading,
  description,
  to = null,
  externalLink = null,
  disabled = false,
}) => {
  if (disabled) {
    to = null
  }

  return (
    <Link to={to ?? ""} className="flex items-center flex-1">
      <button
        className="flex items-center flex-1 group bg-grey-0 rounded-rounded p-large border border-grey-20 h-full"
        disabled={disabled}
        onClick={() => {
          if (externalLink) {
            window.location.href = externalLink
          }
        }}
      >
        <div className="h-2xlarge w-2xlarge bg-violet-20 rounded-circle flex justify-center items-center text-violet-60 group-disabled:bg-grey-10 group-disabled:text-grey-40">
          {icon}
        </div>
        <div className="text-left flex-1 mx-large">
          <h3 className="inter-large-semibold text-grey-90 group-disabled:text-grey-40 m-0">
            {heading}
          </h3>
          <p className="inter-base-regular text-grey-50 group-disabled:text-grey-40 m-0">
            {description}
          </p>
        </div>
        <div className="text-grey-40 group-disabled:text-grey-30">
          <ChevronRightIcon />
        </div>
      </button>
    </Link>
  )
}

export default SettingsCard
