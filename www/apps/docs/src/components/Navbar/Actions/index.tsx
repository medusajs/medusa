import React from "react"
import { NavbarAction } from "@medusajs/docs"
import Icon from "../../../theme/Icon"
import clsx from "clsx"
import { Button, Tooltip } from "docs-ui"

type NavbarActionsProps = {
  items: NavbarAction[]
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

const NavbarActions: React.FC<NavbarActionsProps> = ({
  items = [],
  className = "",
}) => {
  return (
    <div className={clsx("lg:block hidden", className)}>
      {items.map((item, index) => {
        // eslint-disable-next-line no-case-declarations
        const ItemIconElm = item.Icon
        const ItemIcon = item.icon ? Icon[item.icon] : null
        switch (item.type) {
          case "link":
            return (
              <Tooltip
                text={item.title}
                html={item.html}
                key={index}
                tooltipClassName="!text-compact-x-small-plus"
              >
                <a
                  href={item.href}
                  title={item.title}
                  className={clsx(
                    (ItemIcon || ItemIconElm) && "navbar-action-icon-item",
                    item.className
                  )}
                >
                  {item.label}
                  {ItemIconElm}
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
                tooltipClassName="!text-compact-x-small-plus"
              >
                <Button
                  className={clsx(item.href && "relative", item.className)}
                  variant={item.variant || "secondary"}
                  buttonType={item.buttonType || "default"}
                  {...item.events}
                >
                  {item.label}
                  {ItemIconElm}
                  {ItemIcon && <ItemIcon />}
                  {item.href && (
                    <a
                      href={item.href}
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  )}
                </Button>
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
