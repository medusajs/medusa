import { Text, clx } from "@medusajs/ui";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

type ItemType = "core" | "extension";

type NestedItemProps = {
  label: string;
  to: string;
};

export type NavItemProps = {
  icon?: React.ReactNode;
  label: string;
  to: string;
  items?: NestedItemProps[];
  type?: ItemType;
};

export const NavItem = ({
  icon,
  label,
  to,
  items,
  type = "core",
}: NavItemProps) => {
  const location = useLocation();

  const [open, setOpen] = useState(
    [to, ...(items?.map((i) => i.to) ?? [])].some((p) =>
      location.pathname.startsWith(p)
    )
  );

  useEffect(() => {
    setOpen(
      [to, ...(items?.map((i) => i.to) ?? [])].some((p) =>
        location.pathname.startsWith(p)
      )
    );
  }, [location.pathname, to, items]);

  return (
    <div className="px-4">
      <Link
        to={to}
        className={clx(
          "text-ui-fg-subtle hover:text-ui-fg-base px-2 py-2.5 md:py-1.5 outline-none flex items-center gap-x-2 transition-fg rounded-md hover:bg-ui-bg-subtle-hover",
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
              "w-full md:hidden text-ui-fg-subtle hover:text-ui-fg-base px-2 py-2.5 md:py-1.5 outline-none flex items-center gap-x-2 transition-fg rounded-md hover:bg-ui-bg-subtle-hover"
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
                "md:hidden text-ui-fg-subtle hover:text-ui-fg-base px-2 py-2.5 md:py-1.5 outline-none flex items-center gap-x-2 transition-fg rounded-md hover:bg-ui-bg-subtle-hover",
                {
                  "bg-ui-bg-base shadow-elevation-card-rest":
                    location.pathname.startsWith(to),
                }
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <div
                  className={clx(
                    "w-1.5 h-1.5 border-[1.5px] border-ui-fg-muted transition-fg rounded-full",
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
            {items.map((item) => {
              return (
                <Link
                  to={item.to}
                  key={item.to}
                  className={clx(
                    "first-of-type:mt-1 last-of-type:mb-2 text-ui-fg-subtle hover:text-ui-fg-base px-2 py-2.5 md:py-1.5 outline-none flex items-center gap-x-2 transition-fg rounded-md hover:bg-ui-bg-subtle-hover",
                    {
                      "bg-ui-bg-base shadow-elevation-card-rest":
                        location.pathname === item.to,
                    }
                  )}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div
                      className={clx(
                        "w-1.5 h-1.5 border-[1.5px] border-ui-fg-muted transition-fg rounded-full",
                        {
                          "border-ui-fg-base border-2":
                            location.pathname === item.to,
                        }
                      )}
                    />
                  </div>
                  <Text size="small" weight="plus" leading="compact">
                    {item.label}
                  </Text>
                </Link>
              );
            })}
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </div>
  );
};

const Icon = ({ icon, type }: { icon?: React.ReactNode; type: ItemType }) => {
  if (!icon) {
    return null;
  }

  return type === "extension" ? (
    <div className="rounded-[4px] w-5 h-5 flex items-center justify-center shadow-borders-base bg-ui-bg-base">
      <div className="w-4 h-4 rounded-sm overflow-hidden">{icon}</div>
    </div>
  ) : (
    icon
  );
};
