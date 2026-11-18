/** @type {import('types').Sidebar.SidebarItem[]} */
export const currencySidebar = [
  {
    type: "sidebar",
    sidebar_id: "currency",
    title: "Currency Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/currency",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "sub-category",
        title: "Concepts",
        children: [
          {
            type: "link",
            path: "/commerce-modules/currency/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+currency",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Currency Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+currency,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Currency Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+currency,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Currency Module.",
      },
      {
        type: "category",
        title: "Merchant Guides",
        autogenerate_tags: "userGuide+currency",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Currency features in the Medusa Admin dashboard.",
      },
      {
        type: "sub-category",
        title: "References",
        description:
          "Find references for tools and resources related to the Currency Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/currency/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+currency",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Currency Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+currency",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Currency Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "currency-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Currency Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/currency",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/currency/ICurrencyModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "currency-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Currency Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/currency/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                autogenerate_path: "/references/currency_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
