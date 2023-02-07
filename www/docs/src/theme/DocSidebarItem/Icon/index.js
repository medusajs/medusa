import React from "react"
import ThemedImage from '@theme/ThemedImage'

export default function DocSidebarItemIcon ({ icon, is_title }) {
  return (
    <>
      {is_title && (
        <span className='sidebar-title-icon-wrapper'>
          <ThemedImage sources={{
            light: icon.light,
            dark: icon.dark || icon.light
          }} className='sidebar-item-icon' />
        </span>
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