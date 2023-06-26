import React from "react"
import Tooltip from "@site/src/components/Tooltip"
import { NavbarAction } from "@medusajs/docs"
import Icon from "@site/src/theme/Icon"
import clsx from "clsx"

type NavbarActionsProps = {
  items: NavbarAction[]
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const NavbarActions: React.FC<NavbarActionsProps> = ({
  items = [],
  className = "",
}) => {
  return (
    <div className={clsx("lg:tw-block tw-hidden", className)}>
      {items.map((item, index) => {
        // eslint-disable-next-line no-case-declarations
        const ItemIcon = item.icon ? Icon[item.icon] : null
        switch (item.type) {
          case "link":
            return (
              <Tooltip
                text={item.title}
                html={item.html}
                key={index}
                tooltipClassName="!tw-text-label-x-small-plus"
              >
                <a
                  href={item.href}
                  title={item.title}
                  className={clsx(
                    ItemIcon && "navbar-action-icon-item",
                    item.className
                  )}
                >
                  {item.label}
                  {ItemIcon && <ItemIcon />}
                </a>
              </Tooltip>
            )
          case "button":
            return (
              <Tooltip
                text={item.title}
                html={item.html}
                key={index}
                tooltipClassName="!tw-text-label-x-small-plus"
              >
                <button
                  className={clsx(
                    ItemIcon && "navbar-action-icon-item",
                    item.className
                  )}
                  {...item.events}
                >
                  {item.label}
                  {ItemIcon && <ItemIcon />}
                </button>
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
