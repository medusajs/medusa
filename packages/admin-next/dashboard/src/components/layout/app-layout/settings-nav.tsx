import { ChevronDownMini, CogSixTooth, MinusMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"

import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { NavItem, NavItemProps } from "./nav-item"
import { Spacer } from "./spacer"

const useSettingRoutes = (): NavItemProps[] => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      {
        label: t("profile.domain"),
        to: "/settings/profile",
      },
      {
        label: t("store.domain"),
        to: "/settings/store",
      },
      {
        label: t("users.domain"),
        to: "/settings/users",
      },
      {
        label: t("regions.domain"),
        to: "/settings/regions",
      },
      {
        label: t("currencies.domain"),
        to: "/settings/currencies",
      },
      {
        label: "Taxes",
        to: "/settings/taxes",
      },
      {
        label: "Locations",
        to: "/settings/locations",
      },
      {
        label: t("salesChannels.domain"),
        to: "/settings/sales-channels",
      },
      {
        label: t("apiKeyManagement.domain"),
        to: "/settings/api-key-management",
      },
    ],
    [t]
  )
}

export const SettingsNav = () => {
  const routes = useSettingRoutes()
  const { t } = useTranslation()

  return (
    <div className="border-ui-border-base box-content flex h-full max-h-screen w-full max-w-[240px] flex-col overflow-hidden border-x max-md:hidden">
      <div className="p-4">
        <div className="flex h-10 items-center gap-x-3 p-1">
          <CogSixTooth className="text-ui-fg-subtle" />
          <Text leading="compact" weight="plus" size="small">
            {t("general.settings")}
          </Text>
        </div>
      </div>
      <Spacer />
      <div className="flex flex-1 flex-col gap-y-4 overflow-y-auto py-4">
        <Collapsible.Root defaultOpen>
          <div className="px-4">
            <Collapsible.Trigger asChild className="group/trigger">
              <button className="text-ui-fg-subtle flex w-full items-center justify-between px-2">
                <Text size="xsmall" weight="plus" leading="compact">
                  {t("general.general")}
                </Text>
                <div className="text-ui-fg-muted">
                  <ChevronDownMini className="group-data-[state=open]/trigger:hidden" />
                  <MinusMini className="group-data-[state=closed]/trigger:hidden" />
                </div>
              </button>
            </Collapsible.Trigger>
          </div>
          <Collapsible.Content asChild>
            <nav className="flex flex-col gap-y-1 py-1">
              {routes.map((setting) => (
                <NavItem key={setting.to} {...setting} />
              ))}
            </nav>
          </Collapsible.Content>
        </Collapsible.Root>
        <Collapsible.Root>
          <div className="px-4">
            <Collapsible.Trigger asChild className="group/trigger">
              <button className="text-ui-fg-subtle flex w-full items-center justify-between px-2">
                <Text size="xsmall" weight="plus" leading="compact">
                  {t("general.extensions")}
                </Text>
                <div className="text-ui-fg-muted">
                  <ChevronDownMini className="group-data-[state=open]/trigger:hidden" />
                  <MinusMini className="group-data-[state=closed]/trigger:hidden" />
                </div>
              </button>
            </Collapsible.Trigger>
          </div>
          <Collapsible.Content asChild>
            <nav className="flex flex-col gap-y-1 py-1">
              {routes.map((setting) => (
                <NavItem key={setting.to} {...setting} />
              ))}
            </nav>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  )
}
