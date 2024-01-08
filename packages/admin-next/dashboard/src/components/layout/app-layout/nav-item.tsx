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
}

export const NavItem = ({
  icon,
  label,
  to,
  items,
  type = "core",
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
    <div className="px-4">
      <Link
        to={to}
        className={clx(
          "text-ui-fg-subtle hover:text-ui-fg-base transition-fg hover:bg-ui-bg-subtle-hover flex items-center gap-x-2 rounded-md px-2 py-2.5 outline-none md:py-1.5",
          {
            "bg-ui-bg-base shadow-elevation-card-rest":
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
              "text-ui-fg-subtle hover:text-ui-fg-base transition-fg hover:bg-ui-bg-subtle-hover flex w-full items-center gap-x-2 rounded-md px-2 py-2.5 outline-none md:hidden md:py-1.5"
            )}
          >
            <Icon icon={icon} type={type} />
            <Text size="small" weight="plus" leading="compact">
              {label}
            </Text>
          </Collapsible.Trigger>
          <Collapsible.Content className="flex flex-col gap-y-1 pt-1">
            <Link
              to={to}
              className={clx(
                "text-ui-fg-subtle hover:text-ui-fg-base transition-fg hover:bg-ui-bg-subtle-hover flex items-center gap-x-2 rounded-md px-2 py-2.5 outline-none md:hidden md:py-1.5",
                {
                  "bg-ui-bg-base shadow-elevation-card-rest":
                    location.pathname.startsWith(to),
                }
              )}
            >
              <div className="flex h-5 w-5 items-center justify-center">
                <div
                  className={clx(
                    "border-ui-fg-muted transition-fg h-1.5 w-1.5 rounded-full border-[1.5px]",
                    {
                      "border-ui-fg-base border-2": location.pathname === to,
                    }
                  )}
                />
              </div>
              <Text size="small" weight="plus" leading="compact">
                {label}
              </Text>
            </Link>
            <ul>
              {items.map((item) => {
                return (
                  <li
                    key={item.to}
                    className="flex h-[36px] items-center gap-x-1 px-2 "
                  >
                    <div
                      role="presentation"
                      className="flex h-full w-5 items-center justify-center"
                    >
                      <div className="bg-ui-border-strong h-full w-px" />
                    </div>
                    <Link
                      to={item.to}
                      className={clx(
                        "text-ui-fg-subtle hover:text-ui-fg-base transition-fg hover:bg-ui-bg-subtle-hover flex flex-1 items-center gap-x-2 rounded-md px-2 py-2.5 outline-none first-of-type:mt-1 last-of-type:mb-2 md:py-1.5",
                        {
                          "bg-ui-bg-base shadow-elevation-card-rest":
                            location.pathname === item.to,
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
