/** @type {import('types').Sidebar.SidebarItem[]} */
export const ssoSidebar = [
  {
    type: "sidebar",
    sidebar_id: "sso",
    title: "SSO with OIDC",
    children: [
      {
        type: "link",
        path: "/enterprise/sso",
        title: "Overview",
      },
      {
        type: "link",
        path: "/enterprise/sso/provider-options",
        title: "Provider Options",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Concepts",
        children: [
          {
            type: "link",
            path: "/enterprise/sso/how-it-works",
            title: "How SSO Works",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        children: [
          {
            type: "link",
            path: "/enterprise/sso/identity-providers",
            title: "Identity Providers",
          },
        ],
      },
      {
        type: "category",
        title: "Admin Guides",
        children: [
          {
            type: "link",
            path: "/enterprise/sso/admin-login",
            title: "Configure Admin SSO",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        children: [
          {
            type: "link",
            path: "/enterprise/sso/custom-frontend",
            title: "SSO in a Custom Frontend",
          },
        ],
      },
    ],
  },
]
