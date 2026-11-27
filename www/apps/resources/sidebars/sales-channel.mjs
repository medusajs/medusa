/** @type {import('types').Sidebar.SidebarItem[]} */
export const salesChannelSidebar = [
  {
    type: "sidebar",
    sidebar_id: "sales-channel",
    title: "Sales Channel Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/sales-channel",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Concepts",
        autogenerate_tags: "concept+salesChannel",
        autogenerate_as_ref: true,
        children: [
          {
            type: "link",
            path: "/commerce-modules/sales-channel/publishable-api-keys",
            title: "Publishable API Keys",
          },
          {
            type: "link",
            path: "/commerce-modules/sales-channel/links-to-other-modules",
            title: "Links to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+salesChannel",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Sales Channel Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+salesChannel,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Sales Channel Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+salesChannel,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Sales Channel Module.",
      },
      {
        type: "category",
        title: "Merchant Guides",
        autogenerate_tags: "userGuide+salesChannel",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Sales Channel features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Sales Channel Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/sales-channel/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+salesChannel",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+salesChannel",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/sales-channel/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+salesChannel",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Sales Channel Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+salesChannel",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Sales Channel Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/references/sales-channel/events",
            title: "Events Reference",
          },
          {
            type: "link",
            path: "/commerce-modules/sales-channel/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "sales-channel-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Sales Channel Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/sales-channel",
                title: "Reference Overview",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/sales_channel/ISalesChannelModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "sales-channel-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Sales Channel Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/sales-channel/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                autogenerate_path: "/references/sales_channel_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
