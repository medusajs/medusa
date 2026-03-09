/** @type {import('types').Sidebar.RawSidebar} */
export const promptingSidebar = [
  {
    sidebar_id: "prompting",
    title: "Prompting",
    items: [
      {
        type: "link",
        title: "Store Design",
        path: "/prompting/store-design-prompting",
      },
      {
        type: "link",
        title: "Custom Features",
        path: "/prompting/custom-features-prompting",
      },
      {
        type: "link",
        title: "Ecommerce Operations",
        path: "/prompting/ecommerce-operations-prompting",
      },
      {
        type: "link",
        title: "Fix Errors",
        path: "/prompting/fix-errors-and-issues",
      },
      {
        type: "link",
        title: "Integrate Services",
        path: "/prompting/service-integrations-prompting",
        sort_sidebar: "alphabetize",
        children: [
          {
            type: "link",
            title: "Algolia",
            path: "/prompting/service-integrations-prompting/guides/algolia",
            description: "Add search and discovery features",
          },
          {
            type: "link",
            title: "Avalara",
            path: "/prompting/service-integrations-prompting/guides/avalara",
            description: "Add tax calculation features",
          },
          {
            type: "link",
            title: "ShipStation",
            path: "/prompting/service-integrations-prompting/guides/shipstation",
            description: "Add shipping and fulfillment features",
          },
          {
            type: "link",
            title: "Stripe",
            path: "/prompting/service-integrations-prompting/guides/stripe",
            description: "Add payment processing features",
          },
        ],
      },
    ],
  },
]
