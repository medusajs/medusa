import React from "react"
import ThemedImage from '@theme/ThemedImage'
import BorderedIcon from "../../../components/BorderedIcon"

export default function DocSidebarItemIcon ({ icon, is_title }) {
  return (
    <>
      {is_title && (
        <BorderedIcon icon={icon} wrapperClassName={'sidebar-title-icon-wrapper'} iconClassName={'sidebar-item-icon'} />
      )}
      {!is_title && (
        <ThemedImage sources={{
          light: icon.light,
          dark: icon.dark || icon.light
        }} className='sidebar-item-icon' />
      )}
    </>
  )
}