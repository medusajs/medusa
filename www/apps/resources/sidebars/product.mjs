/** @type {import('types').Sidebar.SidebarItem[]} */
export const productSidebar = [
  {
    type: "sidebar",
    sidebar_id: "product",
    title: "Product Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/product",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Concepts",
        autogenerate_tags: "product+concept",
        autogenerate_as_ref: true,
        children: [
          {
            type: "link",
            path: "/commerce-modules/product/variant-inventory",
            title: "Variant Inventory",
          },
          {
            type: "link",
            path: "/commerce-modules/product/selling-products",
            title: "Selling Use Cases",
          },
          {
            type: "link",
            path: "/commerce-modules/product/links-to-other-modules",
            title: "Links to Other Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "product+server",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Product Module in your customizations on the Medusa application server.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/product/extend",
            title: "Extend Module",
          },
          {
            type: "link",
            path: "/commerce-modules/product/guides/filter-products",
            title: "Filter Products",
          },
          {
            type: "link",
            path: "/commerce-modules/product/guides/price",
            title: "Get Variant Prices",
          },
          {
            type: "link",
            path: "/commerce-modules/product/guides/price-with-taxes",
            title: "Get Variant Price with Taxes",
          },
          {
            type: "link",
            path: "/commerce-modules/product/guides/variant-inventory",
            title: "Get Variant Inventory",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+product,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Product Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+product,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Product Module.",
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+product",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Product features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Product Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/product/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+product",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+product",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/product/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+product",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Product Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+product",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Product Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/references/product/events",
            title: "Events Reference",
          },
          {
            type: "link",
            path: "/commerce-modules/product/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "product-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Product Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/product",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/product/IProductModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "product-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Product Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/product/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/product_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
