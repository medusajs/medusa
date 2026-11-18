/** @type {import('types').Sidebar.SidebarItem[]} */
export const stockLocationSidebar = [
  {
    type: "sidebar",
    sidebar_id: "stock-location",
    title: "Stock Location Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/stock-location",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Concepts",
        autogenerate_tags: "concept+stockLocation",
        autogenerate_as_ref: true,
        children: [
          {
            type: "link",
            path: "/commerce-modules/stock-location/concepts",
            title: "Stock Location Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/stock-location/links-to-other-modules",
            title: "Links to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+stockLocation",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Stock Location Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+stockLocation,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Stock Location Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+stockLocation,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Stock Location Module.",
      },
      {
        type: "category",
        title: "Merchant Guides",
        autogenerate_tags: "userGuide+stockLocation",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Stock Location features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Stock Location Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/stock-location/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+stockLocation",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+stockLocation",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/stock-location/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+stockLocation",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Stock Location Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+stockLocation",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Stock Location Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/stock-location/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "stock-location-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Stock Location Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/stock-location-next",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/stock_location_next/IStockLocationService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "stock-location-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Stock Location Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/stock-location-next/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                autogenerate_path:
                  "/references/stock_location_next_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
