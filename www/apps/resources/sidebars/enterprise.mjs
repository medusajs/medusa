import { auditSidebar } from "./audit.mjs"
import { rbacSidebar } from "./rbac.mjs"
import { ssoSidebar } from "./sso.mjs"

/** @type {import('types').Sidebar.SidebarItem[]} */
export const enterpriseSidebar = [
  {
    type: "link",
    path: "https://docs.medusajs.com/cloud/enterprise",
    title: "Overview",
  },
  {
    type: "separator",
  },
  ...auditSidebar,
  {
    type: "separator",
  },
  ...rbacSidebar,
  {
    type: "separator",
  },
  ...ssoSidebar,
]
