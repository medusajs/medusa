import { ChevronDownMini, CogSixTooth, MinusMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";
import * as Collapsible from "@radix-ui/react-collapsible";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavItem, NavItemProps } from "./nav-item";
import { Spacer } from "./spacer";

const useSettingRoutes = (): NavItemProps[] => {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        label: "Profile",
        to: "/settings/profile",
      },
      {
        label: "Store",
        to: "/settings/store",
      },
      {
        label: t("users.domain"),
        to: "/settings/users",
      },
      {
        label: "Regions",
        to: "/settings/regions",
      },
      {
        label: "Currencies",
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
        label: "Sales Channels",
        to: "/settings/sales-channels",
      },
      {
        label: "Publishable API Keys",
        to: "/settings/publishable-api-keys",
      },
    ],
    [t]
  );
};

export const SettingsNav = () => {
  const routes = useSettingRoutes();

  return (
    <div className="max-w-[240px] box-content w-full h-full max-h-screen flex flex-col max-md:hidden overflow-y-auto border-x border-ui-border-base">
      <div className="p-4">
        <div className="flex items-center gap-x-3 p-1 h-10">
          <CogSixTooth className="text-ui-fg-subtle" />
          <Text leading="compact" weight="plus" size="small">
            Settings
          </Text>
        </div>
      </div>
      <Spacer />
      <div className="py-4">
        <Collapsible.Root defaultOpen>
          <div className="px-4">
            <Collapsible.Trigger asChild className="group/trigger">
              <button className="flex items-center justify-between text-ui-fg-subtle px-2 w-full">
                <Text size="xsmall" weight="plus" leading="compact">
                  General
                </Text>
                <div className="text-ui-fg-muted">
                  <ChevronDownMini className="group-data-[state=open]/trigger:hidden" />
                  <MinusMini className="group-data-[state=closed]/trigger:hidden" />
                </div>
              </button>
            </Collapsible.Trigger>
          </div>
          <Collapsible.Content asChild>
            <nav className="flex flex-col py-1 gap-y-1">
              {routes.map((setting) => (
                <NavItem key={setting.to} {...setting} />
              ))}
            </nav>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
      <div>
        <nav></nav>
      </div>
    </div>
  );
};
