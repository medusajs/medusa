/** @type {import('types').Sidebar.SidebarItem[]} */
export const customerSidebar = [
  {
    type: "sidebar",
    sidebar_id: "customer",
    title: "Customer Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/customer",
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
            path: "/commerce-modules/customer/customer-accounts",
            title: "Customer Accounts",
          },
          {
            type: "link",
            path: "/commerce-modules/customer/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "customer+server",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Customer Module in your customizations on the Medusa application server.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/customer/extend",
            title: "Extend Module",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+customer,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Customer Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+customer,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Customer Module.",
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+customer",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Customer features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Customer Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/customer/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+customer",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+customer",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/customer/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+customer",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Customer Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+customer",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Customer Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/references/customer/events",
            title: "Events Reference",
          },
          {
            type: "link",
            path: "/commerce-modules/customer/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "customer-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Customer Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/customer",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/customer/ICustomerModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "customer-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Customer Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/customer/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                autogenerate_path: "/references/customer_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
