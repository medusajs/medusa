/** @type {import('types').Sidebar.SidebarItem[]} */
export const userSidebar = [
  {
    type: "sidebar",
    sidebar_id: "user",
    title: "User Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/user",
        title: "Overview",
      },
      {
        type: "link",
        path: "/commerce-modules/user/module-options",
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
            path: "/commerce-modules/user/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+user",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the User Module in your customizations on the Medusa application server.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/user/user-creation-flows",
            title: "User Creation Flows",
          },
          {
            type: "link",
            path: "/commerce-modules/user/invite-user-subscriber",
            title: "Invite User Email",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+user,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the User Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+user,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the User Module.",
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+user",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage User features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the User Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/user/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+user",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+user",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/user/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+user",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the User Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+user",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the User Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/references/user/events",
            title: "Events Reference",
          },
          {
            type: "link",
            path: "/commerce-modules/user/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "user-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "User Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/user",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/user/IUserModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "user-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "User Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/user/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/user_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
