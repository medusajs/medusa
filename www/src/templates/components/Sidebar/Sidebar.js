import React from "react"
import Collapsible from "react-collapsible"
import { Link } from "gatsby"

const SidebarItem = ({ item, directory = "" }) => {
  const hasSubitems = !!item.items
  return (
    <li>
      {hasSubitems ? (
        <Collapsible trigger={item.title}>
          {item.items && (
            <Sidebar items={item.items} directory={`${directory}/${item.id}`} />
          )}
        </Collapsible>
      ) : (
        <li>
          <Link to={`${directory}/${item.id}`}>{item.title}</Link>
        </li>
      )}
    </li>
  )
}

const Sidebar = ({ items, directory }) => {
  return (
    <ul>
      {items.map(item => (
        <SidebarItem item={item} directory={directory} />
      ))}
    </ul>
  )
}

export default Sidebar
