/** @type {import('types').Sidebar.SidebarItem[]} */
export const recipesSidebar = [
  {
    type: "link",
    path: "/recipes",
    title: "Overview",
  },
  {
    type: "separator",
  },
  {
    type: "link",
    path: "/recipes/marketplace",
    title: "Marketplace",
    children: [
      {
        type: "link",
        path: "/recipes/marketplace/examples/vendors",
        title: "Example: Vendors",
      },
      {
        type: "link",
        path: "/recipes/marketplace/examples/restaurant-delivery",
        title: "Example: Restaurant-Delivery",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/subscriptions",
    title: "Subscriptions",
    children: [
      {
        type: "link",
        path: "/recipes/subscriptions/examples/standard",
        title: "Example",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/digital-products",
    title: "Digital Products",
    children: [
      {
        type: "link",
        path: "/recipes/digital-products/examples/standard",
        title: "Example",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/erp",
    title: "Integrate ERP",
    children: [
      {
        type: "link",
        path: "/recipes/erp/odoo",
        title: "Example: Odoo Integration",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/b2b",
    title: "B2B",
    children: [
      {
        type: "link",
        path: "/examples/guides/quote-management",
        title: "Example: Quote Management",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/bundled-products",
    title: "Bundled Products",
    children: [
      {
        type: "link",
        path: "/recipes/bundled-products/examples/standard",
        title: "Example",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/commerce-automation",
    title: "Commerce Automation",
    children: [
      {
        type: "link",
        path: "/recipes/commerce-automation/restock-notification",
        title: "Example: Restock Notifications",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/personalized-products",
    title: "Personalized Products",
    children: [
      {
        type: "link",
        path: "/recipes/personalized-products/example",
        title: "Example",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/ticket-booking",
    title: "Ticket Booking",
    children: [
      {
        type: "link",
        path: "/recipes/ticket-booking/example",
        title: "Example",
      },
      {
        type: "link",
        path: "/recipes/ticket-booking/example/storefront",
        title: "Storefront Customizations",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/ecommerce",
    title: "Ecommerce",
  },
  {
    type: "link",
    path: "/recipes/multi-region-store",
    title: "Multi-Region Store",
  },
  {
    type: "link",
    path: "/recipes/omnichannel",
    title: "Omnichannel Store",
    children: [
      {
        type: "link",
        path: "/recipes/omnichannel/marketplaces",
        title: "Marketplace Integrations",
      },
    ],
  },
  {
    type: "link",
    path: "/recipes/oms",
    title: "OMS",
  },
  {
    type: "link",
    path: "/recipes/pos",
    title: "POS",
  },
]
