import { DropdownMenu, IconButton, clx } from "@zjedene-medusa/ui"

import { EllipsisHorizontal } from "@zjedene-medusa/icons"
import { PropsWithChildren, ReactNode } from "react"
import { Link } from "react-router-dom"
import { ConditionalTooltip } from "./conditional-tooltip"

export type Action = {
  icon: ReactNode
  label: string
  disabled?: boolean
  /**
   * Optional tooltip to display when a disabled action is hovered.
   */
  disabledTooltip?: string | ReactNode
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

export type ActionGroup = {
  actions: Action[]
}

type ActionMenuProps = PropsWithChildren<{
  groups: ActionGroup[]
  variant?: "transparent" | "primary"
}>

export const ActionMenu = ({
  groups,
  variant = "transparent",
  children,
}: ActionMenuProps) => {
  const inner = children ?? (
    <IconButton size="small" variant={variant}>
      <EllipsisHorizontal />
    </IconButton>
  )

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{inner}</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {groups.map((group, index) => {
          if (!group.actions.length) {
            return null
          }

          const isLast = index === groups.length - 1

          return (
            <DropdownMenu.Group key={index}>
              {group.actions.map((action, index) => {
                const Wrapper = action.disabledTooltip
                  ? ({ children }: { children: ReactNode }) => (
                      <ConditionalTooltip
                        showTooltip={action.disabled}
                        content={action.disabledTooltip}
                        side="right"
                      >
                        <div>{children}</div>
                      </ConditionalTooltip>
                    )
                  : "div"

                if (action.onClick) {
                  return (
                    <Wrapper key={index}>
                      <DropdownMenu.Item
                        disabled={action.disabled}
                        onClick={(e) => {
                          e.stopPropagation()
                          action.onClick()
                        }}
                        className={clx(
                          "[&_svg]:text-ui-fg-subtle flex items-center gap-x-2",
                          {
                            "[&_svg]:text-ui-fg-disabled": action.disabled,
                          }
                        )}
                      >
                        {action.icon}
                        <span>{action.label}</span>
                      </DropdownMenu.Item>
                    </Wrapper>
                  )
                }

                return (
                  <Wrapper key={index}>
                    <DropdownMenu.Item
                      className={clx(
                        "[&_svg]:text-ui-fg-subtle flex items-center gap-x-2",
                        {
                          "[&_svg]:text-ui-fg-disabled": action.disabled,
                        }
                      )}
                      asChild
                      disabled={action.disabled}
                    >
                      <Link to={action.to} onClick={(e) => e.stopPropagation()}>
                        {action.icon}
                        <span>{action.label}</span>
                      </Link>
                    </DropdownMenu.Item>
                  </Wrapper>
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
