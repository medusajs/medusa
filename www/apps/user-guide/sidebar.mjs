import { sidebarAttachHrefCommonOptions } from "build-scripts"

// TODO check the order of items based on the Medusa Admin's sidebar

/** @type {import('types').RawSidebarItemType[]} */
export const sidebar = sidebarAttachHrefCommonOptions([
  {
    type: "link",
    path: "/",
    title: "Introduction",
  },
  {
    type: "link",
    title: "Tips",
    hasTitleStyling: true,
    autogenerate_path: "/tips",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    path: "/orders",
    title: "Orders",
    hasTitleStyling: true,
    autogenerate_path: "/orders",
  },
  {
    type: "category",
    path: "/products",
    title: "Products",
    hasTitleStyling: true,
    autogenerate_path: "/products",
  },
  {
    type: "category",
    path: "/inventory",
    title: "Inventory",
    hasTitleStyling: true,
    autogenerate_path: "/inventory",
  },
  {
    type: "category",
    path: "/customers",
    title: "Customers",
    hasTitleStyling: true,
    autogenerate_path: "/customers",
  },
  {
    type: "category",
    path: "/discounts",
    title: "Discounts",
    hasTitleStyling: true,
    autogenerate_path: "/discounts",
  },
  {
    type: "category",
    path: "/pricing",
    title: "Pricing",
    hasTitleStyling: true,
    autogenerate_path: "/pricing",
  },
  {
    type: "category",
    path: "/settings",
    title: "Settings",
    hasTitleStyling: true,
    autogenerate_path: "/settings",
  },
])
