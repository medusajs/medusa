import { EllipsisHorizontal } from "@medusajs/icons"
import { DropdownMenu, IconButton } from "@medusajs/ui"
import { ReactNode } from "react"
import { Link } from "react-router-dom"

type TableRowAction = {
  icon: ReactNode
  label: string
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

type TableRowActionGroup = {
  actions: TableRowAction[]
}

type TableRowActionsProps = {
  groups: TableRowActionGroup[]
}

export const TableRowActions = ({ groups }: TableRowActionsProps) => {
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
            <div className="flex flex-col gap-y-1">
              {group.actions.map((action, index) => {
                if (action.onClick) {
                  return (
                    <DropdownMenu.Item
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick()
                      }}
                      className="[&_svg]:text-ui-fg-subtle flex items-center gap-x-2"
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </DropdownMenu.Item>
                  )
                }

                return (
                  <Link to={action.to} key={index}>
                    <DropdownMenu.Item
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="[&_svg]:text-ui-fg-subtle flex items-center gap-x-2"
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </DropdownMenu.Item>
                  </Link>
                )
              })}
              {!isLast && <DropdownMenu.Separator />}
            </div>
          )
        })}
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}
