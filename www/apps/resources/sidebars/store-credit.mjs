/** @type {import('types').Sidebar.SidebarItem[]} */
export const storeCreditSidebar = [
  {
    type: "sidebar",
    sidebar_id: "store-credit",
    title: "Store Credit Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/store-credit",
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
            path: "/commerce-modules/store-credit/concepts",
            title: "Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/store-credit/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+storeCredit",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Store Credit Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+storeCredit,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Store Credit Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+storeCredit,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administrative features of the Store Credit Module.",
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+storeCredit",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Store Credit features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Store Credit Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/store-credit/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+storeCredit",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+storeCredit",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/store-credit/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "store-credit-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Store Credit Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/store-credit",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                hasTitleStyling: true,
                autogenerate_path:
                  "/references/store_credit/IStoreCreditModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "store-credit-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Store Credit Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/store-credit/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/store_credit_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
