import React from "react"
import icons from "@site/src/theme/Icon"
import BorderedIcon from "@site/src/components/BorderedIcon"
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
            is_disabled &&
              "stroke-medusa-fg-disabled dark:stroke-medusa-fg-disabled-dark"
          )}
        />
      )}
      {!is_title && (
        <IconComponent
          className={clsx("sidebar-item-icon")}
          iconColorClassName={
            is_disabled &&
            "stroke-medusa-fg-disabled dark:stroke-medusa-fg-disabled-dark"
          }
        />
      )}
    </>
  )
}

export default DocSidebarItemIcon
