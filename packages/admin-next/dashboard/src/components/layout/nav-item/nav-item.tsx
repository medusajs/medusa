import { Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

type ItemType = "core" | "extension"

type NestedItemProps = {
  label: string
  to: string
}

export type NavItemProps = {
  icon?: React.ReactNode
  label: string
  to: string
  items?: NestedItemProps[]
  type?: ItemType
  from?: string
}

export const NavItem = ({
  icon,
  label,
  to,
  items,
  type = "core",
  from,
}: NavItemProps) => {
  const location = useLocation()

  const [open, setOpen] = useState(
    [to, ...(items?.map((i) => i.to) ?? [])].some((p) =>
      location.pathname.startsWith(p)
    )
  )

  useEffect(() => {
    setOpen(
      [to, ...(items?.map((i) => i.to) ?? [])].some((p) =>
        location.pathname.startsWith(p)
      )
    )
  }, [location.pathname, to, items])

  return (
    <div className="px-3">
      <Link
        to={to}
        state={
          from
            ? {
                from,
              }
            : undefined
        }
        className={clx(
          "text-ui-fg-subtle hover:text-ui-fg-base transition-fg hover:bg-ui-bg-subtle-hover flex items-center gap-x-2 rounded-md px-2 py-1 outline-none",
          {
            "bg-ui-bg-base hover:bg-ui-bg-base-hover shadow-elevation-card-rest":
              location.pathname.startsWith(to),
            "max-md:hidden": items && items.length > 0,
          }
        )}
      >
        <Icon icon={icon} type={type} />
        <Text size="small" weight="plus" leading="compact">
          {label}
        </Text>
      </Link>
      {items && items.length > 0 && (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Trigger
            className={clx(
              "text-ui-fg-subtle hover:text-ui-fg-base transition-fg hover:bg-ui-bg-subtle-hover flex w-full items-center gap-x-2 rounded-md px-2 py-1 outline-none md:hidden"
            )}
          >
            <Icon icon={icon} type={type} />
            <Text size="small" weight="plus" leading="compact">
              {label}
            </Text>
          </Collapsible.Trigger>
          <Collapsible.Content className="grid grid-cols-[28px_1fr] pt-0.5">
            <div className="flex-1 flex items-center justify-center pl-2">
              <span className="bg-ui-border-strong h-full w-px" />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <Link
                to={to}
                className={clx(
                  "text-ui-fg-subtle hover:text-ui-fg-base transition-fg hover:bg-ui-bg-subtle-hover flex flex-1 items-center gap-x-2 rounded-md px-2 py-1 outline-none md:hidden",
                  {
                    "bg-ui-bg-base hover:bg-ui-bg-base text-ui-fg-base shadow-elevation-card-rest":
                      location.pathname.startsWith(to),
                  }
                )}
              >
                <Text size="small" weight="plus" leading="compact">
                  {label}
                </Text>
              </Link>
              <ul className="pb-2 flex flex-col gap-y-0.5">
                {items.map((item) => {
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={clx(
                          "text-ui-fg-subtle hover:text-ui-fg-base transition-fg hover:bg-ui-bg-subtle-hover flex flex-1 items-center gap-x-2 rounded-md px-2 py-1 outline-none",
                          {
                            "bg-ui-bg-base text-ui-fg-base hover:bg-ui-bg-base shadow-elevation-card-rest":
                              location.pathname.startsWith(item.to),
                          }
                        )}
                      >
                        <Text size="small" weight="plus" leading="compact">
                          {item.label}
                        </Text>
                      </Link>
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

const Icon = ({ icon, type }: { icon?: React.ReactNode; type: ItemType }) => {
  if (!icon) {
    return null
  }

  return type === "extension" ? (
    <div className="shadow-borders-base bg-ui-bg-base flex h-5 w-5 items-center justify-center rounded-[4px]">
      <div className="h-4 w-4 overflow-hidden rounded-sm">{icon}</div>
    </div>
  ) : (
    icon
  )
}
