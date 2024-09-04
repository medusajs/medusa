import { Kbd, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { NavLink, useLocation } from "react-router-dom"
import { useGlobalShortcuts } from "../../../providers/keybind-provider/hooks"
import { ConditionalTooltip } from "../../common/conditional-tooltip"

type ItemType = "core" | "extension" | "setting"

type NestedItemProps = {
  label: string
  to: string
}

export type NavItemProps = {
  icon?: ReactNode
  label: string
  to: string
  items?: NestedItemProps[]
  type?: ItemType
  from?: string
}

const BASE_NAV_LINK_CLASSES =
  "text-ui-fg-subtle transition-fg hover:bg-ui-bg-subtle-hover flex items-center gap-x-2 rounded-md py-1 pl-0.5 pr-2 outline-none [&>svg]:text-ui-fg-subtle focus-visible:shadow-borders-focus"
const ACTIVE_NAV_LINK_CLASSES =
  "bg-ui-bg-base shadow-elevation-card-rest text-ui-fg-base hover:bg-ui-bg-base"
const NESTED_NAV_LINK_CLASSES = "pl-[34px] pr-2 w-full text-ui-fg-muted"
const SETTING_NAV_LINK_CLASSES = "pl-2"

const getIsOpen = (
  to: string,
  items: NestedItemProps[] | undefined,
  pathname: string
) => {
  return [to, ...(items?.map((i) => i.to) ?? [])].some((p) =>
    pathname.startsWith(p)
  )
}

const NavItemTooltip = ({
  to,
  children,
}: PropsWithChildren<{ to: string }>) => {
  const { t } = useTranslation()
  const globalShortcuts = useGlobalShortcuts()
  const shortcut = globalShortcuts.find((s) => s.to === to)

  return (
    <ConditionalTooltip
      showTooltip={!!shortcut}
      maxWidth={9999} // Don't limit the width of the tooltip
      content={
        <div className="txt-compact-xsmall flex h-5 items-center justify-between gap-x-2 whitespace-nowrap">
          <span>{shortcut?.label}</span>
          <div className="flex items-center gap-x-1">
            {shortcut?.keys.Mac?.map((key, index) => (
              <div className="flex items-center gap-x-1" key={index}>
                <Kbd key={key}>{key}</Kbd>
                {index < (shortcut.keys.Mac?.length || 0) - 1 && (
                  <span className="text-ui-fg-muted txt-compact-xsmall">
                    {t("app.keyboardShortcuts.then")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      }
      side="right"
      delayDuration={1500}
    >
      <div className="w-full">{children}</div>
    </ConditionalTooltip>
  )
}

export const NavItem = ({
  icon,
  label,
  to,
  items,
  type = "core",
  from,
}: NavItemProps) => {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(getIsOpen(to, items, pathname))

  useEffect(() => {
    setOpen(getIsOpen(to, items, pathname))
  }, [pathname, to, items])

  const navLinkClassNames = useCallback(
    ({
      isActive,
      isNested = false,
      isSetting = false,
    }: {
      isActive: boolean
      isNested?: boolean
      isSetting?: boolean
    }) =>
      clx(BASE_NAV_LINK_CLASSES, {
        [NESTED_NAV_LINK_CLASSES]: isNested,
        [ACTIVE_NAV_LINK_CLASSES]: isActive,
        [SETTING_NAV_LINK_CLASSES]: isSetting,
      }),
    []
  )

  const isSetting = type === "setting"

  return (
    <div className="px-3">
      <NavItemTooltip to={to}>
        <NavLink
          to={to}
          state={
            from
              ? {
                  from,
                }
              : undefined
          }
          className={(props) =>
            clx(navLinkClassNames({ ...props, isSetting }), {
              "max-lg:hidden": !!items?.length,
            })
          }
        >
          {type !== "setting" && (
            <div className="flex size-6 items-center justify-center">
              <Icon icon={icon} type={type} />
            </div>
          )}
          <Text size="small" weight="plus" leading="compact">
            {label}
          </Text>
        </NavLink>
      </NavItemTooltip>
      {items && items.length > 0 && (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger
            className={clx(
              "text-ui-fg-subtle hover:text-ui-fg-base transition-fg hover:bg-ui-bg-subtle-hover flex w-full items-center gap-x-2 rounded-md py-1 pl-0.5 pr-2 outline-none lg:hidden",
              { "pl-2": isSetting }
            )}
          >
            <div className="flex size-6 items-center justify-center">
              <Icon icon={icon} type={type} />
            </div>
            <Text size="small" weight="plus" leading="compact">
              {label}
            </Text>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <div className="flex flex-col gap-y-0.5 pb-2 pt-0.5">
              <ul className="flex flex-col gap-y-0.5">
                <li className="flex w-full items-center gap-x-1 lg:hidden">
                  <NavItemTooltip to={to}>
                    <NavLink
                      to={to}
                      className={(props) =>
                        clx(
                          navLinkClassNames({
                            ...props,
                            isNested: true,
                            isSetting,
                          })
                        )
                      }
                    >
                      <Text size="small" weight="plus" leading="compact">
                        {label}
                      </Text>
                    </NavLink>
                  </NavItemTooltip>
                </li>
                {items.map((item) => {
                  return (
                    <li key={item.to} className="flex h-7 items-center">
                      <NavItemTooltip to={item.to}>
                        <NavLink
                          to={item.to}
                          className={(props) =>
                            clx(
                              navLinkClassNames({
                                ...props,
                                isNested: true,
                                isSetting,
                              })
                            )
                          }
                        >
                          <Text size="small" weight="plus" leading="compact">
                            {item.label}
                          </Text>
                        </NavLink>
                      </NavItemTooltip>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </div>
  )
}

const Icon = ({ icon, type }: { icon?: ReactNode; type: ItemType }) => {
  if (!icon) {
    return null
  }

  return type === "extension" ? (
    <div className="shadow-borders-base bg-ui-bg-base flex h-5 w-5 items-center justify-center rounded-[4px]">
      <div className="h-[15px] w-[15px] overflow-hidden rounded-sm">{icon}</div>
    </div>
  ) : (
    icon
  )
}
