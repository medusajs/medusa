import React from "react"
import { BorderedIcon } from "@/components"
import { IconProps } from "@medusajs/icons/dist/types"

export type SidebarTopNavigationDropdownIconProps = {
  icon: React.FC<IconProps>
}

export const SidebarTopNavigationDropdownIcon = ({
  icon,
}: SidebarTopNavigationDropdownIconProps) => {
  return <BorderedIcon IconComponent={icon} />
}
