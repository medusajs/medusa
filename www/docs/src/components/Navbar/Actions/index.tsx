import React from "react"
import Tooltip from "@site/src/components/Tooltip"
import { NavbarAction } from "@medusajs/docs"
import Icon from "@site/src/theme/Icon"

type NavbarActionsProps = {
  items: NavbarAction[]
} & React.HTMLAttributes<HTMLDivElement>

const NavbarActions: React.FC<NavbarActionsProps> = ({ items = [] }) => {
  return (
    <div className="navbar-actions">
      {items.map((item, index) => {
        switch (item.type) {
          case "link":
            // eslint-disable-next-line no-case-declarations
            const ItemIcon = item.icon ? Icon[item.icon] : null
            return (
              <Tooltip text={item.title} key={index}>
                <a
                  href={item.href}
                  title={item.title}
                  className={`navbar-action ${
                    ItemIcon ? "navbar-link-icon" : ""
                  } ${item.className || ""}`}
                >
                  {item.label}
                  {ItemIcon && <ItemIcon />}
                </a>
              </Tooltip>
            )
          default:
            return <></>
        }
      })}
    </div>
  )
}

export default NavbarActions
