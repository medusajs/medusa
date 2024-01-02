import {
  ArrowRightOnRectangle,
  BookOpen,
  BuildingStorefront,
  Calendar,
  ChevronDownMini,
  CircleHalfSolid,
  CogSixTooth,
  CurrencyDollar,
  EllipsisHorizontal,
  MinusMini,
  ReceiptPercent,
  ShoppingCart,
  Sidebar,
  SquaresPlus,
  Tag,
  Users,
} from "@medusajs/icons";
import { Avatar, DropdownMenu, IconButton, Text } from "@medusajs/ui";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as Dialog from "@radix-ui/react-dialog";
import { useAdminStore } from "medusa-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../../providers/auth-provider";
import { useTheme } from "../../../providers/theme-provider";

import { Fragment, useEffect, useState } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { NavItem, NavItemProps } from "./nav-item";
import { Notifications } from "./notifications";
import { Search } from "./search";
import { Spacer } from "./spacer";

import extensions from "medusa-admin:routes/links";
import { useTranslation } from "react-i18next";

export const MainNav = () => {
  return (
    <Fragment>
      <DesktopNav />
      <MobileNav />
    </Fragment>
  );
};

const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // If the user navigates to a new route, we want to close the menu
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-ui-bg-base border-b border-ui-border-base h-[57px] w-full flex items-center justify-between px-4 md:hidden">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-x-2">
          <Dialog.Trigger asChild>
            <IconButton variant="transparent">
              <Sidebar />
            </IconButton>
          </Dialog.Trigger>
          <Breadcrumbs />
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-ui-bg-overlay fixed inset-0 lg:hidden" />
          <Dialog.Content className="fixed left-0 inset-y-0 w-full sm:max-w-[240px] bg-ui-bg-subtle lg:hidden flex flex-col overflow-y-auto">
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0">
                <Header />
                <Spacer />
              </div>
              <CoreRouteSection />
              <ExtensionRouteSection />
            </div>
            <div className="sticky bottom-0 w-full flex flex-col">
              <SettingsSection />
              <Spacer />
              <UserSection />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="flex items-center gap-x-2">
        <Search />
        <Notifications />
      </div>
    </div>
  );
};

const DesktopNav = () => {
  return (
    <aside className="max-w-[240px] w-full h-full max-h-screen flex flex-col justify-between max-md:hidden overflow-y-auto">
      <div className="flex flex-col flex-1">
        <div className="sticky top-0 bg-ui-bg-subtle">
          <Header />
          <Spacer />
        </div>
        <CoreRouteSection />
        <ExtensionRouteSection />
      </div>
      <div className="flex flex-col sticky bottom-0 bg-ui-bg-subtle">
        <SettingsSection />
        <Spacer />
        <UserSection />
      </div>
    </aside>
  );
};

const Header = () => {
  const { store } = useAdminStore();
  const { setTheme, theme } = useTheme();

  if (!store) {
    return null;
  }

  return (
    <div className="p-4 w-full">
      <DropdownMenu>
        <DropdownMenu.Trigger className="outline-none rounded-md hover:bg-ui-bg-subtle-hover active:bg-ui-bg-subtle-pressed focus:bg-ui-bg-subtle-pressed transition-fg w-full">
          <div className="flex items-center justify-between p-1 md:pr-2">
            <div className="flex items-center gap-x-3">
              <div className="w-8 h-8 rounded-md bg-ui-bg-base shadow-borders-base flex items-center justify-center overflow-hidden">
                <div className="w-[28px] h-[28px] rounded-[4px] bg-ui-bg-component overflow-hidden flex items-center justify-center">
                  {store.name[0].toUpperCase()}
                </div>
              </div>
              <Text size="small" weight="plus" leading="compact">
                {store.name}
              </Text>
            </div>
            <div className="text-ui-fg-subtle">
              <EllipsisHorizontal />
            </div>
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>
            <BuildingStorefront className="text-ui-fg-subtle mr-2" />
            Store Settings
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <Link to="https://docs.medusajs.com/user-guide" target="_blank">
            <DropdownMenu.Item>
              <BookOpen className="text-ui-fg-subtle mr-2" />
              Documentation
            </DropdownMenu.Item>
          </Link>
          <Link to="https://medusajs.com/changelog/" target="_blank">
            <DropdownMenu.Item>
              <Calendar className="text-ui-fg-subtle mr-2" />
              Changelog
            </DropdownMenu.Item>
          </Link>
          <DropdownMenu.Separator />
          <DropdownMenu.SubMenu>
            <DropdownMenu.SubMenuTrigger className="rounded-md">
              <CircleHalfSolid className="text-ui-fg-subtle mr-2" />
              Theme
            </DropdownMenu.SubMenuTrigger>
            <DropdownMenu.SubMenuContent>
              <DropdownMenu.RadioGroup value={theme}>
                <DropdownMenu.RadioItem
                  value="light"
                  onClick={(e) => {
                    e.preventDefault();
                    setTheme("light");
                  }}
                >
                  Light
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem
                  value="dark"
                  onClick={(e) => {
                    e.preventDefault();
                    setTheme("dark");
                  }}
                >
                  Dark
                </DropdownMenu.RadioItem>
              </DropdownMenu.RadioGroup>
            </DropdownMenu.SubMenuContent>
          </DropdownMenu.SubMenu>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <ArrowRightOnRectangle className="text-ui-fg-subtle mr-2" />
            Logout
            <DropdownMenu.Shortcut>⌥⇧Q</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

const useCoreRoutes = (): Omit<NavItemProps, "pathname">[] => {
  const { t } = useTranslation();

  return [
    {
      icon: <ShoppingCart />,
      label: t("orders.domain"),
      to: "/orders",
      items: [
        {
          label: t("draftOrders.domain"),
          to: "/draft-orders",
        },
      ],
    },
    {
      icon: <Tag />,
      label: t("products.domain"),
      to: "/products",
      items: [
        {
          label: t("collections.domain"),
          to: "/collections",
        },
        {
          label: t("categories.domain"),
          to: "/categories",
        },
        {
          label: t("giftCards.domain"),
          to: "/gift-cards",
        },
        {
          label: t("inventory.domain"),
          to: "/inventory",
        },
      ],
    },
    {
      icon: <Users />,
      label: t("customers.domain"),
      to: "/customers",
      items: [
        {
          label: t("customerGroups.domain"),
          to: "/customer-groups",
        },
      ],
    },
    {
      icon: <ReceiptPercent />,
      label: t("discounts.domain"),
      to: "/discounts",
    },
    {
      icon: <CurrencyDollar />,
      label: t("pricing.domain"),
      to: "/pricing",
    },
  ];
};

const CoreRouteSection = () => {
  const coreRoutes = useCoreRoutes();

  return (
    <nav className="flex flex-col gap-y-1 py-4">
      {coreRoutes.map((route) => {
        return <NavItem key={route.to} {...route} />;
      })}
    </nav>
  );
};

const ExtensionRouteSection = () => {
  if (!extensions.links || extensions.links.length === 0) {
    return null;
  }

  return (
    <div>
      <Spacer />
      <div className="flex flex-col gap-y-4 py-4">
        <Collapsible.Root defaultOpen>
          <div className="px-4">
            <Collapsible.Trigger asChild className="group/trigger">
              <button className="flex items-center justify-between text-ui-fg-subtle px-2 w-full">
                <Text size="xsmall" weight="plus" leading="compact">
                  Extensions
                </Text>
                <div className="text-ui-fg-muted">
                  <ChevronDownMini className="group-data-[state=open]/trigger:hidden" />
                  <MinusMini className="group-data-[state=closed]/trigger:hidden" />
                </div>
              </button>
            </Collapsible.Trigger>
          </div>
          <Collapsible.Content>
            <div className="flex flex-col gap-y-1 py-1 pb-4">
              {extensions.links.map((link) => {
                return (
                  <NavItem
                    key={link.path}
                    to={link.path}
                    label={link.label}
                    icon={link.icon ? <link.icon /> : <SquaresPlus />}
                    type="extension"
                  />
                );
              })}
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      </div>
    </div>
  );
};

const SettingsSection = () => {
  return (
    <div className="py-4">
      <NavItem icon={<CogSixTooth />} label="Settings" to="/settings" />
    </div>
  );
};

const UserSection = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const fallback =
    user.first_name && user.last_name
      ? `${user.first_name[0]}${user.last_name[0]}`
      : user.first_name
        ? user.first_name[0]
        : user.email[0];

  return (
    <div className="p-4">
      <Link
        to="/settings/user"
        className="p-1 flex items-center gap-x-3 hover:bg-ui-bg-subtle-hover transition-fg active:bg-ui-bg-subtle-pressed focus:bg-ui-bg-subtle-pressed outline-none rounded-md"
      >
        <Avatar fallback={fallback.toUpperCase()} />
        <div className="flex flex-col flex-1">
          {(user.first_name || user.last_name) && (
            <Text
              size="xsmall"
              weight="plus"
              leading="compact"
              className="truncate max-w-[90%]"
            >{`${user.first_name && `${user.first_name} `}${
              user.last_name
            }`}</Text>
          )}
          <Text
            size="xsmall"
            leading="compact"
            className="text-ui-fg-subtle truncate max-w-[90%]"
          >
            {user.email}
          </Text>
        </div>
      </Link>
    </div>
  );
};
