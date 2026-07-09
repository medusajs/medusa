/** @type {import('types').Sidebar.SidebarItem[]} */
export const rbacSidebar = [
  {
    type: "sidebar",
    sidebar_id: "rbac",
    title: "RBAC Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/rbac",
        title: "Overview",
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
            path: "/commerce-modules/rbac/concepts",
            title: "RBAC Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/rbac/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        children: [
          {
            type: "link",
            path: "/commerce-modules/rbac/define-policies",
            title: "Define Custom Policies",
          },
        ],
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+rbac",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to manage roles and policies in the Medusa Admin dashboard.",
      },

      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+rbac,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administrative features of the RBAC Module.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the RBAC Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/rbac/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+rbac",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+rbac",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/rbac/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+rbac",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the RBAC Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+rbac",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the RBAC Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "rbac-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "RBAC Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/rbac",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/rbac/IRbacModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "rbac-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "RBAC Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/rbac/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/rbac_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
