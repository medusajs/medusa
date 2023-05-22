import React from "react"
import Tooltip from "@site/src/components/Tooltip"
import { NavbarAction } from "@medusajs/docs"
import Icon from "@site/src/theme/Icon"
import clsx from "clsx"

type NavbarActionsProps = {
  items: NavbarAction[]
} & React.HTMLAttributes<HTMLDivElement>

const NavbarActions: React.FC<NavbarActionsProps> = ({ items = [] }) => {
  return (
    <div className="lg:tw-block tw-hidden">
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
                  // className={`${ItemIcon ? "navbar-link-icon" : ""} ${
                  //   item.className || ""
                  // }`}
                  className={clsx(
                    ItemIcon &&
                      "tw-bg-medusa-button-secondary dark:tw-bg-medusa-button-secondary-dark tw-border tw-border-solid tw-border-medusa-border-base dark:tw-border-medusa-border-base-dark tw-rounded tw-w-2 tw-h-2 tw-flex tw-justify-center tw-items-center hover:tw-bg-medusa-button-secondary-hover dark:hover:tw-bg-medusa-button-secondary-hover-dark",
                    item.className
                  )}
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
