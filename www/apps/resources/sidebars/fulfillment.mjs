/** @type {import('types').Sidebar.SidebarItem[]} */
export const fulfillmentSidebar = [
  {
    type: "sidebar",
    sidebar_id: "fulfillment",
    title: "Fulfillment Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/fulfillment",
        title: "Overview",
      },
      {
        type: "link",
        path: "/commerce-modules/fulfillment/module-options",
        title: "Module Options",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Concepts",
        autogenerate_tags: "fulfillment+concept",
        autogenerate_as_ref: true,
        children: [
          {
            type: "link",
            path: "/commerce-modules/fulfillment/concepts",
            title: "General Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/fulfillment/item-fulfillment",
            title: "Item Fulfillment",
          },
          {
            type: "link",
            path: "/commerce-modules/fulfillment/fulfillment-provider",
            title: "Fulfillment Module Provider",
          },
          {
            type: "link",
            path: "/commerce-modules/fulfillment/shipping-option",
            title: "Shipping Option",
          },
          {
            type: "link",
            path: "/commerce-modules/fulfillment/links-to-other-modules",
            title: "Links to Other Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+fulfillment",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Fulfillment Module in your customizations on the Medusa application server.",
        children: [
          {
            type: "link",
            path: "/references/fulfillment/provider",
            title: "Create Fulfillment Provider",
          },
          {
            type: "ref",
            path: "/integrations/guides/shipstation",
            title: "Integrate ShipStation",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+fulfillment,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Fulfillment Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+fulfillment,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Fulfillment Module.",
      },
      {
        type: "category",
        title: "Merchant Guides",
        autogenerate_tags: "fulfillment+userGuide",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Fulfillment features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Fulfillment Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/fulfillment/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+fulfillment",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+fulfillment",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/fulfillment/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+fulfillment",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Fulfillment Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+fulfillment",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Fulfillment Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/references/fulfillment/events",
            title: "Events Reference",
          },
          {
            type: "link",
            path: "/commerce-modules/fulfillment/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "fulfillment-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Fulfillment Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/fulfillment",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/fulfillment/IFulfillmentModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "fulfillment-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Fulfillment Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/fulfillment/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/fulfillment_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
