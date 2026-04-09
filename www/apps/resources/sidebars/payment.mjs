/** @type {import('types').Sidebar.SidebarItem[]} */
export const paymentSidebar = [
  {
    type: "sidebar",
    sidebar_id: "payment",
    title: "Payment Module",
    children: [
      {
        type: "link",
        path: "/commerce-modules/payment",
        title: "Overview",
      },
      {
        type: "link",
        path: "/commerce-modules/payment/module-options",
        title: "Module Options",
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
            path: "/commerce-modules/payment/payment-collection",
            title: "Payment Collections",
          },
          {
            type: "link",
            path: "/commerce-modules/payment/payment-session",
            title: "Payment Session",
          },
          {
            type: "link",
            path: "/commerce-modules/payment/payment",
            title: "Payment",
          },
          {
            type: "link",
            path: "/commerce-modules/payment/payment-provider",
            title: "Payment Module Provider",
          },
          {
            type: "link",
            path: "/commerce-modules/payment/payment-checkout-flow",
            title: "Payment in Checkout",
          },
          {
            type: "link",
            path: "/commerce-modules/payment/account-holder",
            title: "Account Holder",
          },
          {
            type: "link",
            path: "/commerce-modules/payment/webhook-events",
            title: "Webhook Events",
          },
          {
            type: "link",
            path: "/commerce-modules/payment/links-to-other-modules",
            title: "Links to Other Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Server Guides",
        autogenerate_tags: "server+payment",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to use the Payment Module in your customizations on the Medusa application server.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/payment/payment-flow",
            title: "Accept Payment Flow",
          },
          {
            type: "link",
            path: "/references/payment/provider",
            title: "Create Payment Provider",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+payment,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to integrate the Payment Module's features into your storefront.",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+payment,-jsSdk",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize administative features of the Payment Module.",
      },
      {
        type: "category",
        title: "Admin User Guides",
        autogenerate_tags: "userGuide+payment",
        autogenerate_as_ref: true,
        sort_sidebar: "alphabetize",
        description:
          "Learn how to utilize and manage Payment features in the Medusa Admin dashboard.",
      },
      {
        type: "category",
        title: "Providers",
        children: [
          {
            type: "link",
            path: "/commerce-modules/payment/payment-provider/stripe",
            title: "Stripe",
          },
          {
            type: "ref",
            path: "/integrations/guides/paypal",
            title: "PayPal",
          },
        ],
      },
      {
        type: "category",
        title: "References",
        description:
          "Find references for tools and resources related to the Payment Module, such as data models, methods, and more. These are useful for your customizations.",
        children: [
          {
            type: "link",
            path: "/commerce-modules/payment/workflows",
            title: "Workflows",
            hideChildren: true,
            children: [
              {
                type: "category",
                title: "Workflows",
                autogenerate_tags: "workflow+payment",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "category",
                title: "Steps",
                autogenerate_tags: "step+payment",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/commerce-modules/payment/js-sdk",
            title: "JS SDK",
            hideChildren: true,
            children: [
              {
                type: "sub-category",
                title: "Store",
                autogenerate_tags: "jsSdk+storefront+payment",
                description:
                  "The following methods or properties are used to send requests to Store API Routes related to the Payment Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
              {
                type: "sub-category",
                title: "Admin",
                autogenerate_tags: "jsSdk+admin+payment",
                description:
                  "The following methods or properties are used to send requests to Admin API Routes related to the Payment Module.",
                autogenerate_as_ref: true,
                sort_sidebar: "alphabetize",
              },
            ],
          },
          {
            type: "link",
            path: "/references/payment/events",
            title: "Events Reference",
          },
          {
            type: "sidebar",
            sidebar_id: "payment-service-reference",
            title: "Main Service Reference",
            childSidebarTitle: "Payment Module's Main Service Reference",
            children: [
              {
                type: "link",
                path: "/references/payment",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Methods",
                autogenerate_path:
                  "/references/payment/IPaymentModuleService/methods",
              },
            ],
          },
          {
            type: "sidebar",
            sidebar_id: "payment-models-reference",
            title: "Data Models Reference",
            childSidebarTitle: "Payment Module Data Models Reference",
            children: [
              {
                type: "link",
                path: "/references/payment/models",
                title: "Reference Overview",
              },
              {
                type: "separator",
              },
              {
                type: "category",
                title: "Data Models",
                autogenerate_path: "/references/payment_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]
