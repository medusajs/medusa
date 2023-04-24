import React, { FC } from "react"
import { Link } from "react-router-dom"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import ChevronRightIcon from "../../fundamentals/icons/chevron-right-icon"
import LogoProps from "../../fundamentals/logos/types/logo-type"

type SettingsCardProps = {
  icon?: React.ReactNode
  logo?: FC<LogoProps> | null
  heading: string
  description: string
  to?: string
  externalLink?: string
  disabled?: boolean
  active?: boolean
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  icon,
  logo: Logo,
  heading,
  description,
  to = null,
  externalLink = null,
  disabled = false,
  active,
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
        {icon && (
          <div className="h-2xlarge w-2xlarge min-w-[40px] bg-violet-20 rounded-circle flex justify-center items-center text-violet-60 group-disabled:bg-grey-10 group-disabled:text-grey-40 mr-large">
            {icon}
          </div>
        )}

        <div className="text-left mr-large">
          <h3 className="inter-large-semibold text-grey-90 group-disabled:text-grey-40 m-0">
            {heading}
          </h3>

          {Logo && (
            <div className="flex items-center h-8 group-disabled:opacity-50 flex-grow-0">
              <Logo height="24" width="auto" />
            </div>
          )}

          <p className="inter-base-regular text-grey-50 group-disabled:text-grey-40 m-0">
            {description}
          </p>
        </div>
        <div className="flex-1" />

        {active && (
          <div className="mr-3">
            <div className="flex pl-3 pr-1 py-1 rounded-full bg-green-100 items-center gap-1">
              <span className="text-[12px] text-green-800">Active</span>
              <CheckCircleIcon className="text-green-500" />
            </div>
          </div>
        )}

        <div className="text-grey-40 group-disabled:text-grey-30">
          <ChevronRightIcon />
        </div>
      </button>
    </Link>
  )
}

export default SettingsCard
