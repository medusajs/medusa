/** @type {import('types').Sidebar.SidebarItem[]} */
export const taxSidebar = [
  {
    type: "sidebar",
    sidebar_id: "tax",
    title: "Tax Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/tax",
        title: "Overview",
      },
      {
        type: "link",
        path: "/commerce-modules/tax/module-options",
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
            path: "/commerce-modules/tax/tax-region",
            title: "Tax Region",
          },
          {
            type: "link",
            path: "/commerce-modules/tax/tax-rates-and-rules",
            title: "Tax Rates and Rules",
          },
          {
            type: "link",
            path: "/commerce-modules/tax/tax-provider",
            title: "Tax Module Providers",
          },
          {
            type: "link",
            path: "/commerce-modules/tax/tax-calculation-with-provider",
            title: "Tax Calculation",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+tax",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Tax Module in your customizations on the Medusa application server.",
        children: [
          {
            type: "link",
            path: "/references/tax/provider",
            title: "Create Tax Provider",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+tax,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Tax Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+tax,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Tax Module.",
      },
      {
        type: "category",
        title: "Merchant Guides",
        autogenerate_tags: "userGuide+tax",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Tax features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Tax Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/tax/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+tax",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+tax",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/tax/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+tax",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Tax Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+tax",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Tax Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/tax/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "tax-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Tax Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/tax",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path: "/references/tax/ITaxModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "tax-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Tax Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/tax/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                autogenerate_path: "/references/tax_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
