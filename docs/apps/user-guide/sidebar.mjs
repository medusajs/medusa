import { sidebarAttachHrefCommonOptions } from "build-scripts"

// TODO check the order of items based on the Medusa Admin's sidebar

/** @type {import('types').RawSidebarItemType[]} */
export const sidebar = sidebarAttachHrefCommonOptions([
  {
    path: "/",
    title: "Introduction",
  },
  {
    title: "Tips",
    hasTitleStyling: true,
    autogenerate_path: "/tips",
  },
  {
    path: "/orders",
    title: "Orders",
    hasTitleStyling: true,
    autogenerate_path: "/orders",
  },
  {
    path: "/products",
    title: "Products",
    hasTitleStyling: true,
    autogenerate_path: "/products",
  },
  {
    path: "/inventory",
    title: "Inventory",
    hasTitleStyling: true,
    autogenerate_path: "/inventory",
  },
  {
    path: "/customers",
    title: "Customers",
    hasTitleStyling: true,
    autogenerate_path: "/customers",
  },
  {
    path: "/discounts",
    title: "Discounts",
    hasTitleStyling: true,
    autogenerate_path: "/discounts",
  },
  {
    path: "/pricing",
    title: "Pricing",
    hasTitleStyling: true,
    autogenerate_path: "/pricing",
  },
  {
    path: "/settings",
    title: "Settings",
    hasTitleStyling: true,
    autogenerate_path: "/settings",
  },
])
