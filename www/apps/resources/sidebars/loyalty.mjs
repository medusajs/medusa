/** @type {import('types').Sidebar.SidebarItem[]} */
export const loyaltySidebar = [
  {
    type: "sidebar",
    sidebar_id: "loyalty",
    title: "Loyalty Plugin",
    children: [
      {
        type: "link",
        path: "/commerce-modules/loyalty",
        title: "Overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Gift Cards",
        children: [
          {
            type: "link",
            path: "/commerce-modules/loyalty/gift-cards/concepts",
            title: "Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/loyalty/gift-cards/admin-guide",
            title: "Admin Guide",
          },
          {
            type: "link",
            path: "/commerce-modules/loyalty/gift-cards/storefront-guide", 
            title: "Storefront Guide",
          },
        ],
      },
      {
        type: "category",
        title: "Store Credit",
        children: [
          {
            type: "link",
            path: "/commerce-modules/loyalty/store-credit/concepts",
            title: "Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/loyalty/store-credit/admin-guide",
            title: "Admin Guide", 
          },
          {
            type: "link",
            path: "/commerce-modules/loyalty/store-credit/storefront-guide",
            title: "Storefront Guide",
          },
        ],
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Loyalty Plugin, such as workflows, API routes, and more.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/loyalty/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Gift Card Workflows",
                children: [
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/create-gift-cards",
                    title: "createGiftCardsWorkflow",
                  },
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/update-gift-cards",
                    title: "updateGiftCardsWorkflow",
                  },
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/delete-gift-card",
                    title: "deleteGiftCardWorkflow",
                  },
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/redeem-gift-card",
                    title: "redeemGiftCardWorkflow",
                  },
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/claim-gift-card",
                    title: "claimGiftCardWorkflow",
                  },
                ],
              },
              {
                type: "category",
                title: "Store Credit Workflows", 
                children: [
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/create-store-credit-accounts",
                    title: "createStoreCreditAccountsWorkflow",
                  },
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/credit-store-credit-account",
                    title: "creditStoreCreditAccountWorkflow",
                  },
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/debit-accounts",
                    title: "debitAccountsWorkflow",
                  },
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/claim-store-credit-account",
                    title: "claimStoreCreditAccountWorkflow",
                  },
                ],
              },
              {
                type: "category",
                title: "Cart Integration Workflows",
                children: [
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/add-gift-card-to-cart",
                    title: "addGiftCardToCartWorkflow",
                  },
                  {
                    type: "link", 
                    path: "/commerce-modules/loyalty/workflows/add-store-credits-to-cart",
                    title: "addStoreCreditToCartWorkflow",
                  },
                  {
                    type: "link",
                    path: "/commerce-modules/loyalty/workflows/confirm-cart-credit-lines",
                    title: "confirmCartCreditLinesWorkflow",
                  },
                ],
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/loyalty/admin-widget-zones",
            title: "Admin Widget Zones",
          },
        ],
      },
    ],
  },
]