import React from "react"
import icons from "../../theme/Icon"
import BorderedIcon from "../BorderedIcon"
import clsx from "clsx"

type DocSidebarItemIconProps = {
  icon?: string
  is_title?: boolean
  is_disabled?: boolean
} & React.HTMLAttributes<HTMLSpanElement>

const DocSidebarItemIcon: React.FC<DocSidebarItemIconProps> = ({
  icon,
  is_title,
  is_disabled,
}) => {
  const IconComponent = icons[icon]

  return (
    <>
      {is_title && (
        <BorderedIcon
          icon={null}
          IconComponent={IconComponent}
          iconClassName={clsx("sidebar-item-icon")}
          iconColorClassName={clsx(
            "text-medusa-fg-subtle",
            is_disabled && "text-medusa-fg-disabled"
          )}
        />
      )}
      {!is_title && (
        <IconComponent
          className={clsx(
            "sidebar-item-icon",
            "text-medusa-fg-subtle",
            is_disabled && "text-medusa-fg-disabled"
          )}
        />
      )}
    </>
  )
}

export default DocSidebarItemIcon
