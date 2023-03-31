import React from "react"
import BorderedIcon from "../../../components/BorderedIcon"
import icons from '../../Icon'

export default function DocSidebarItemIcon ({ icon, is_title }) {
  const IconComponent = icons[icon]
  
  return (
    <>
      {is_title && (
        <BorderedIcon icon={null} IconComponent={IconComponent} wrapperClassName={'sidebar-title-icon-wrapper'} iconClassName={'sidebar-item-icon'} />
      )}
      {!is_title && <IconComponent className='sidebar-item-icon' />}
    </>
  )
}