import React from "react"
import Collapsible from "react-collapsible"
import { Link } from "gatsby"
import { useLocation } from "@reach/router"

const isItemActive = (location, link) => {
  return location.pathname.includes(link)
}

const SidebarItem = ({ to, title }) => {
  const location = useLocation()
  const isActive = isItemActive(location, to)
  return (
    <li>
      <Link style={isActive ? { color: "green" } : {}} to={to}>
        {title}
      </Link>
    </li>
  )
}

const SidebarList = ({ item, directory = "" }) => {
  const hasSubitems = !!item.items
  const location = useLocation()
  const isActiveDirectory =
    hasSubitems && location.pathname.includes(`/${item.id}/`)
  return (
    <li>
      {hasSubitems ? (
        <Collapsible open={isActiveDirectory} trigger={item.title}>
          {item.items && (
            <Sidebar items={item.items} directory={`${directory}/${item.id}`} />
          )}
        </Collapsible>
      ) : (
        <SidebarItem title={item.title} to={`${directory}/${item.id}`} />
      )}
    </li>
  )
}

const Sidebar = ({ items, directory }) => {
  return (
    <ul>
      {items.map(item => (
        <SidebarList item={item} directory={directory} />
      ))}
    </ul>
  )
}

export default Sidebar
