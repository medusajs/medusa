import { rbacSidebar } from "./rbac.mjs"
import { ssoSidebar } from "./sso.mjs"

/** @type {import('types').Sidebar.SidebarItem[]} */
export const enterpriseSidebar = [
  {
    type: "link",
    path: "/enterprise",
    title: "Overview",
  },
  {
    type: "separator",
  },
  ...rbacSidebar,
  {
    type: "separator",
  },
  ...ssoSidebar,
]
