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
              "tw-stroke-medusa-icon-disabled dark:tw-stroke-medusa-icon-disabled-dark"
          )}
        />
      )}
      {!is_title && (
        <IconComponent
          className={clsx("sidebar-item-icon")}
          iconColorClassName={
            is_disabled &&
            "tw-stroke-medusa-icon-disabled dark:tw-stroke-medusa-icon-disabled-dark"
          }
        />
      )}
    </>
  )
}

export default DocSidebarItemIcon
