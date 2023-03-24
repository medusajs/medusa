import React from "react"
import icons from "@site/src/theme/Icon"
import BorderedIcon from "@site/src/components/BorderedIcon"

type DocSidebarItemIconProps = {
  icon?: string
  is_title?: boolean
} & React.HTMLAttributes<HTMLSpanElement>

const DocSidebarItemIcon: React.FC<DocSidebarItemIconProps> = ({
  icon,
  is_title,
}) => {
  const IconComponent = icons[icon]

  return (
    <>
      {is_title && (
        <BorderedIcon
          icon={null}
          IconComponent={IconComponent}
          wrapperClassName={"sidebar-title-icon-wrapper"}
          iconClassName={"sidebar-item-icon"}
        />
      )}
      {!is_title && <IconComponent className="sidebar-item-icon" />}
    </>
  )
}

export default DocSidebarItemIcon
