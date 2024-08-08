import React from "react"
import { BorderedIcon } from "@/components"
import { IconProps } from "@medusajs/icons/dist/types"

export type SidebarTopNavigationDropdownIconProps = {
  icon: React.FC<IconProps>
  inDropdown?: boolean
}

export const SidebarTopNavigationDropdownIcon = ({
  icon,
  inDropdown = false,
}: SidebarTopNavigationDropdownIconProps) => {
  return (
    <BorderedIcon
      IconComponent={icon}
      iconClassName={inDropdown ? "w-docs_1 h-docs_1" : ""}
      iconWrapperClassName="rounded-docs_xs"
    />
  )
}
