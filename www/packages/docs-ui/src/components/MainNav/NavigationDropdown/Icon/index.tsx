import React from "react"
import { BorderedIcon } from "@/components"
import { IconProps } from "@medusajs/icons/dist/types"

export type MainNavigationDropdownIconProps = {
  icon: React.FC<IconProps>
  inDropdown?: boolean
}

export const MainNavigationDropdownIcon = ({
  icon,
  inDropdown = false,
}: MainNavigationDropdownIconProps) => {
  return (
    <BorderedIcon
      IconComponent={icon}
      iconClassName={inDropdown ? "w-docs_1 h-docs_1" : ""}
      iconWrapperClassName="rounded-docs_xs"
    />
  )
}
