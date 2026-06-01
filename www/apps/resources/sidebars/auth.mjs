/** @type {import('types').Sidebar.SidebarItem[]} */
export const authSidebar = [
  {
    type: "sidebar",
    sidebar_id: "auth",
    title: "Auth Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/auth",
        title: "Overview",
      },
      {
        type: "link",
        path: "/commerce-modules/auth/module-options",
        title: "Module Options",
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
            path: "/commerce-modules/auth/auth-identity-and-actor-types",
            title: "Identity and Actor Types",
          },
          {
            type: "link",
            path: "/commerce-modules/auth/auth-providers",
            title: "Auth Module Provider",
          },
          {
            type: "link",
            path: "/commerce-modules/auth/auth-flows",
            title: "Auth Flow with Module",
          },
          {
            type: "link",
            path: "/commerce-modules/auth/authentication-route",
            title: "Auth Flow with Routes",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+auth",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Auth Module in your customizations on the Medusa application server.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/auth/create-actor-type",
            title: "Create Actor Type",
          },
          {
            type: "link",
            path: "/commerce-modules/auth/reset-password",
            title: "Handle Password Reset Event",
          },
          {
            type: "link",
            path: "/references/auth/provider",
            title: "Create Auth Provider",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+auth,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Auth Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+auth,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Auth Module.",
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+auth",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Auth features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "Providers",
        children: [
          {
            type: "link",
            path: "/commerce-modules/auth/auth-providers/emailpass",
            title: "Emailpass Provider",
          },
          {
            type: "link",
            path: "/commerce-modules/auth/auth-providers/google",
            title: "Google Provider",
          },
          {
            type: "link",
            path: "/commerce-modules/auth/auth-providers/github",
            title: "GitHub Provider",
          },
        ],
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Auth Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/auth/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+auth",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+auth",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/auth/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            autogenerate_tags: "jsSdk+auth",
            autogenerate_as_ref: true,
            sort_sidebar: "alphabetize",
          },
          {
            type: "link",
            path: "/references/auth/events",
            title: "Events Reference",
          },
          {
            type: "link",
            path: "/commerce-modules/auth/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "auth-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Auth Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/auth",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/auth/IAuthModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "auth-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Auth Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/auth/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                autogenerate_path: "/references/auth_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
