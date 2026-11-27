/** @type {import('types').Sidebar.SidebarItem[]} */
export const pricingSidebar = [
  {
    type: "sidebar",
    sidebar_id: "pricing",
    title: "Pricing Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/pricing",
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
            path: "/commerce-modules/pricing/concepts",
            title: "Pricing Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/price-rules",
            title: "Price Tiers and Rules",
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/price-calculation",
            title: "Prices Calculation",
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/tax-inclusive-pricing",
            title: "Tax-Inclusive Pricing",
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/links-to-other-modules",
            title: "Links to Other Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+pricing",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Pricing Module in your customizations on the Medusa application server.",
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+pricing,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Pricing Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+pricing,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Pricing Module.",
      },
      {
        type: "category",
        title: "Merchant Guides",
        autogenerate_tags: "userGuide+pricing",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Pricing features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Pricing Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/pricing/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+pricing",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+pricing",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+pricing",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Pricing Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+pricing",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Pricing Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "sidebar",
            sidebar_id: "pricing-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Pricing Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/pricing",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/pricing/IPricingModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "pricing-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Pricing Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/pricing/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/pricing_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
