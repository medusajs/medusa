import { DropdownMenu, IconButton } from "@medusajs/ui"

import { EllipsisHorizontal } from "@medusajs/icons"
import { ReactNode } from "react"
import { Link } from "react-router-dom"

type Action = {
  icon: ReactNode
  label: string
  disabled?: boolean
} & (
  | {
      to: string
      onClick?: never
    }
  | {
      onClick: () => void
      to?: never
    }
)

type ActionGroup = {
  actions: Action[]
}

type ActionMenuProps = {
  groups: ActionGroup[]
}

export const ActionMenu = ({ groups }: ActionMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton size="small" variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {groups.map((group, index) => {
          if (!group.actions.length) {
            return null
          }

          const isLast = index === groups.length - 1

          return (
            <DropdownMenu.Group key={index}>
              {group.actions.map((action, index) => {
                if (action.onClick) {
                  return (
                    <DropdownMenu.Item
                      disabled={action.disabled}
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick()
                      }}
                      className="[&_svg]:text-ui-fg-subtle disabled:text-ui-fg-disabled disabled:[&_svg]:text-ui-fg-disabled flex items-center gap-x-2 disabled:cursor-not-allowed"
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </DropdownMenu.Item>
                  )
                }

                return (
                  <div key={index}>
                    <DropdownMenu.Item
                      className="[&_svg]:text-ui-fg-subtle flex items-center gap-x-2 disabled:cursor-not-allowed disabled:opacity-50"
                      asChild
                      disabled={action.disabled}
                    >
                      <Link to={action.to} onClick={(e) => e.stopPropagation()}>
                        {action.icon}
                        <span>{action.label}</span>
                      </Link>
                    </DropdownMenu.Item>
                  </div>
                )
              })}
              {!isLast && <DropdownMenu.Separator />}
            </DropdownMenu.Group>
          )
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
