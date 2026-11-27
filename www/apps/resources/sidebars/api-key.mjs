/** @type {import('types').Sidebar.SidebarItem[]} */
export const apiKeySidebar = [
  {
    type: "sidebar",
    sidebar_id: "api-key",
    title: "API Key Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/api-key",
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
            path: "/commerce-modules/api-key/concepts",
            title: "API Key Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/api-key/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+apiKey",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the API Key Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+apiKey,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the API Key Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+apiKey,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the API Key Module.",
      },
      {
        type: "category",
        title: "Merchant Guides",
        autogenerate_tags: "userGuide+apiKey",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage API Key features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the API Key Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/api-key/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+apiKey",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+apiKey",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/api-key/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+apiKey",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the API Key Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+apiKey",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the API Key Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/api-key/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "api-key-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "API Key Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/api-key",
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
                  "/references/api_key/IApiKeyModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "api-key-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "API Key Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/api-key/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/api_key_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
