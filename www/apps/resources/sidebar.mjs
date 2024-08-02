import { sidebarAttachHrefCommonOptions } from "./utils/sidebar-attach-common-options.mjs"

/** @type {import('types').RawSidebarItem[]} */
export const sidebar = sidebarAttachHrefCommonOptions([
  {
    type: "link",
    path: "/",
    title: "Overview",
  },
  {
    type: "link",
    path: "/commerce-modules",
    title: "Commerce Modules",
    isChildSidebar: true,
    children: [
      {
        type: "category",
        title: "API Key Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/api-key",
            title: "Overview",
          },
          {
            type: "link",
            path: "/commerce-modules/api-key/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/api-key/concepts",
                title: "API Key Concepts",
              },
              {
                type: "link",
                path: "/commerce-modules/api-key/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/api-key",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "API Key Module's Main Service Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/api_key/IApiKeyModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/api-key/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "API Key Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/api_key_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/api-key/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Auth Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/api-key",
            title: "Overview",
          },
          {
            type: "link",
            path: "/commerce-modules/auth/module-options",
            title: "Module Options",
          },
          {
            type: "link",
            path: "/commerce-modules/auth/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/auth/auth-identity-and-actor-types",
                title: "Identity and Actor Types",
              },
              {
                type: "link",
                path: "/commerce-modules/auth/auth-providers",
                title: "Auth Providers",
                children: [
                  {
                    type: "link",
                    path: "/commerce-modules/auth/auth-providers/emailpass",
                    title: "Emailpass Auth Provider Module",
                  },
                ],
              },
              {
                type: "link",
                path: "/commerce-modules/auth/authentication-route",
                title: "Authentication Route",
              },
              {
                type: "link",
                path: "/commerce-modules/auth/auth-flows",
                title: "Auth Flows",
              },
            ],
          },
          {
            type: "sub-category",
            title: "Guides",
            children: [
              {
                type: "link",
                path: "/commerce-modules/auth/create-actor-type",
                title: "Create an Actor Type",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/auth/provider",
                title: "Create Auth Provider Module",
              },
              {
                type: "link",
                path: "/references/auth",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Auth Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/auth/IAuthModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/auth/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Auth Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path: "/references/auth_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/auth/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Cart Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/cart",
            title: "Overview",
          },
          {
            type: "link",
            path: "/commerce-modules/cart/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/cart/concepts",
                title: "Cart Concepts",
              },
              {
                type: "link",
                path: "/commerce-modules/cart/promotions",
                title: "Promotion Adjustments",
              },
              {
                type: "link",
                path: "/commerce-modules/cart/tax-lines",
                title: "Tax Lines",
              },
              {
                type: "link",
                path: "/commerce-modules/cart/relations-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/cart",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Cart Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/cart/ICartModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/cart/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Cart Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path: "/references/cart_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/cart/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Currency",
        children: [
          {
            type: "link",
            path: "/commerce-modules/currency",
            title: "Overview",
          },
          {
            type: "link",
            path: "/commerce-modules/currency/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/currency/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/currency",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Cart Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/currency/ICurrencyModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/currency/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Currency Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path: "/references/currency_models/variables",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/currency/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Customer",
        children: [
          {
            type: "link",
            path: "/commerce-modules/customer",
            title: "Overview",
          },
          {
            type: "link",
            path: "/commerce-modules/customer/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/customer/customer-accounts",
                title: "Customer Accounts",
              },
              {
                type: "link",
                path: "/commerce-modules/customer/relations-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/customer",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Customer Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/customer/ICustomerModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/customer/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Customer Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path: "/references/customer_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/customer/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
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
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/fulfillment/concepts",
                title: "Fulfillment Concepts",
              },
              {
                type: "link",
                path: "/commerce-modules/fulfillment/fulfillment-provider",
                title: "Fulfillment Provider",
              },
              {
                type: "link",
                path: "/commerce-modules/fulfillment/shipping-option",
                title: "Shipping Option",
              },
              {
                type: "link",
                path: "/commerce-modules/fulfillment/item-fulfillment",
                title: "Item Fulfillment",
              },
              {
                type: "link",
                path: "/commerce-modules/fulfillment/relations-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/fulfillment/provider",
                title: "Create Fulfillment Provider Module",
              },
              {
                type: "link",
                path: "/references/fulfillment",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle:
                  "Fulfillment Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/fulfillment/IFulfillmentModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/fulfillment/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Fulfillment Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/fulfillment_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/fulfillment/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Inventory Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/inventory",
            title: "Inventory Module",
          },
          {
            type: "link",
            path: "/commerce-modules/inventory/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/inventory/concepts",
                title: "Inventory Concepts",
              },
              {
                type: "link",
                path: "/commerce-modules/inventory/inventory-in-flows",
                title: "Inventory in Flows",
              },
              {
                type: "link",
                path: "/commerce-modules/inventory/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/inventory_next",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Inventory Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/inventory_next/IInventoryService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/inventory_next/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Inventory Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path:
                      "/references/inventory_next_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/inventory/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Order Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/order",
            title: "Order Module",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/order/concepts",
                title: "Order Concepts",
              },
              {
                type: "link",
                path: "/commerce-modules/order/promotion-adjustments",
                title: "Promotions Adjustments",
              },
              {
                type: "link",
                path: "/commerce-modules/order/tax-lines",
                title: "Tax Lines",
              },
              {
                type: "link",
                path: "/commerce-modules/order/transactions",
                title: "Transactions",
              },
              {
                type: "link",
                path: "/commerce-modules/order/order-versioning",
                title: "Order Versioning",
              },
              {
                type: "link",
                path: "/commerce-modules/order/return",
                title: "Return",
              },
              {
                type: "link",
                path: "/commerce-modules/order/exchange",
                title: "Exchange",
              },
              {
                type: "link",
                path: "/commerce-modules/order/claim",
                title: "Claim",
              },
              {
                type: "link",
                path: "/commerce-modules/order/relations-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/order",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Order Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/order/IOrderModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/order/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Order Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/order_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/order/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
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
            type: "link",
            path: "/commerce-modules/payment/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
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
                title: "Payment Provider Module",
                children: [
                  {
                    type: "link",
                    path: "/commerce-modules/payment/payment-provider/stripe",
                    title: "Stripe",
                  },
                ],
              },
              {
                type: "link",
                path: "/commerce-modules/payment/webhook-events",
                title: "Webhook Events",
              },
              {
                type: "link",
                path: "/commerce-modules/payment/relation-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "Guides",
            children: [
              {
                type: "link",
                path: "/commerce-modules/payment/payment-flow",
                title: "Accept Payment Flow",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/payment/provider",
                title: "Payment Provider Reference",
              },
              {
                type: "link",
                path: "/references/payment",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Payment Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/payment/IPaymentModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/payment/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Payment Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path: "/references/payment_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/payment/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Pricing Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/pricing",
            title: "Pricing Module",
          },
          {
            type: "link",
            path: "/commerce-modules/pricing/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
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
                title: "Price Rules",
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
                path: "/commerce-modules/pricing/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/pricing",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Pricing Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/pricing/IPricingModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/pricing/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Pricing Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/pricing_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/pricing/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Product Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/product",
            title: "Overview",
          },
          {
            type: "link",
            path: "/commerce-modules/product/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/product/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "Guides",
            autogenerate_path: "/commerce-modules/product/guides",
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/product",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Product Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/product/IProductModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/product/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Product Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/product_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/product/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Promotion Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/promotion",
            title: "Promotion Module",
          },
          {
            type: "link",
            path: "/commerce-modules/promotion/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/promotion/concepts",
                title: "Promotion",
              },
              {
                type: "link",
                path: "/commerce-modules/promotion/application-method",
                title: "Application Method",
              },
              {
                type: "link",
                path: "/commerce-modules/promotion/campaign",
                title: "Campaign",
              },
              {
                type: "link",
                path: "/commerce-modules/promotion/actions",
                title: "Promotion Actions",
              },
              {
                type: "link",
                path: "/commerce-modules/promotion/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/promotion",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Promotion Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/promotion/IPromotionModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/promotion/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Promotion Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/promotion_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/promotion/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Region Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/region",
            title: "Overview",
          },
          {
            type: "link",
            path: "/commerce-modules/region/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/region/relations-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/region",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Region Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/region/IRegionModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/region/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Region Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path: "/references/region_models/variables",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/region/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Sales Channel Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/sales-channel",
            title: "Overview",
          },
          {
            type: "link",
            path: "/commerce-modules/sales-channel/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/sales-channel/publishable-api-keys",
                title: "Publishable API Keys",
              },
              {
                type: "link",
                path: "/commerce-modules/sales-channel/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/sales-channel",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle:
                  "Sales Channel Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/sales_channel/ISalesChannelModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/sales-channel/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Sales Channel Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path:
                      "/references/sales_channel_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/sales-channel/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Stock Location Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/stock-location",
            title: "Stock Location Module",
          },
          {
            type: "link",
            path: "/commerce-modules/stock-location/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/stock-location/concepts",
                title: "Stock Location Concepts",
              },
              {
                type: "link",
                path: "/commerce-modules/stock-location/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/stock-location",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle:
                  "Stock Location Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/stock_location_next/IStockLocationService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/stock-location/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle:
                  "Stock Location Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path:
                      "/references/stock_location_next_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/stock-location/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Store Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/store",
            title: "Store Module",
          },
          {
            type: "link",
            path: "/commerce-modules/store/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/store/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/store",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Store Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/store/IStoreModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/store/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Store Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path: "/references/store_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/store/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Tax Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/tax",
            title: "Overview",
          },
          {
            type: "link",
            path: "/commerce-modules/tax/module-options",
            title: "Module Options",
          },
          {
            type: "link",
            path: "/commerce-modules/tax/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/tax/tax-region",
                title: "Tax Region",
              },
              {
                type: "link",
                path: "/commerce-modules/tax/tax-rates-and-rules",
                title: "Tax Rates and Rules",
              },
              {
                type: "link",
                path: "/commerce-modules/tax/tax-calculation-with-provider",
                title: "Tax Calculation and Providers",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/tax/provider",
                title: "Tax Provider Reference",
              },
              {
                type: "link",
                path: "/references/tax",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "Tax Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/tax/ITaxModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/tax/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Tax Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    autogenerate_path: "/references/tax_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/tax/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "User Module",
        children: [
          {
            type: "link",
            path: "/commerce-modules/user",
            title: "User Module",
          },
          {
            type: "link",
            path: "/commerce-modules/user/module-options",
            title: "Module Options",
          },
          {
            type: "link",
            path: "/commerce-modules/user/examples",
            title: "Examples",
          },
          {
            type: "sub-category",
            title: "Concepts",
            children: [
              {
                type: "link",
                path: "/commerce-modules/user/user-creation-flows",
                title: "User Creation Flows",
              },
            ],
          },
          {
            type: "sub-category",
            title: "References",
            children: [
              {
                type: "link",
                path: "/references/user",
                title: "Main Service Reference",
                isChildSidebar: true,
                childSidebarTitle: "User Module's Main Service Reference",
                children: [
                  {
                    type: "category",
                    title: "Methods",
                    autogenerate_path:
                      "/references/user/IUserModuleService/methods",
                  },
                ],
              },
              {
                type: "link",
                path: "/references/user/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "User Module Data Models Reference",
                children: [
                  {
                    type: "category",
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/user_models/classes",
                  },
                ],
              },
              // {
              //   path: "/commerce-modules/user/events",
              //   title: "Events Reference",
              // },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "link",
    path: "/integrations",
    title: "Integrations",
    isChildSidebar: true,
    children: [
      {
        type: "category",
        title: "File",
        children: [
          {
            type: "link",
            path: "/architectural-modules/file/s3",
            title: "AWS S3 (and Compatible APIs)",
          },
        ],
      },
      {
        type: "category",
        title: "Notification",
        children: [
          {
            type: "link",
            path: "/architectural-modules/notification/sendgrid",
            title: "SendGrid",
          },
        ],
      },
      {
        type: "category",
        title: "Payment",
        children: [
          {
            type: "link",
            path: "/commerce-modules/payment/payment-provider/stripe",
            title: "Stripe",
          },
        ],
      },
    ],
  },
  {
    type: "link",
    path: "/recipes",
    title: "Recipes",
    isChildSidebar: true,
    children: [
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
        path: "/recipes/b2b",
        title: "B2B",
      },
      {
        type: "link",
        path: "/recipes/commerce-automation",
        title: "Commerce Automation",
      },
      {
        type: "link",
        path: "/recipes/digital-products",
        title: "Digital Products",
      },
      {
        type: "link",
        path: "/recipes/ecommerce",
        title: "Ecommerce",
      },
      {
        type: "link",
        path: "/recipes/integrate-ecommerce-stack",
        title: "Integrate Ecommerce Stack",
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
      },
      {
        type: "link",
        path: "/recipes/oms",
        title: "OMS",
      },
      {
        type: "link",
        path: "/recipes/personalized-products",
        title: "Personalized Products",
      },
      {
        type: "link",
        path: "/recipes/pos",
        title: "POS",
      },
    ],
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "SDKs and Tools",
    children: [
      {
        type: "link",
        path: "/create-medusa-app",
        title: "create-medusa-app",
      },
      {
        type: "link",
        path: "/medusa-cli",
        title: "Medusa CLI",
      },
      {
        type: "link",
        path: "/nextjs-starter",
        title: "Next.js Starter",
      },
    ],
  },
  {
    type: "link",
    path: "/architectural-modules",
    title: "Architectural Modules",
    isChildSidebar: true,
    children: [
      {
        type: "category",
        title: "Cache Modules",
        children: [
          {
            type: "link",
            path: "/architectural-modules/cache",
            title: "Overview",
          },
          {
            type: "link",
            path: "/architectural-modules/cache/in-memory",
            title: "In-Memory",
          },
          {
            type: "link",
            path: "/architectural-modules/cache/redis",
            title: "Redis",
          },
          {
            type: "sub-category",
            title: "Guides",
            children: [
              {
                type: "link",
                path: "/architectural-modules/cache/create",
                title: "Create Cache Module",
              },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Event Modules",
        children: [
          {
            type: "link",
            path: "/architectural-modules/event",
            title: "Overview",
          },
          {
            type: "link",
            path: "/architectural-modules/event/local",
            title: "Local",
          },
          {
            type: "link",
            path: "/architectural-modules/event/redis",
            title: "Redis",
          },
          {
            type: "sub-category",
            title: "Guides",
            children: [
              {
                type: "link",
                path: "/architectural-modules/event/create",
                title: "Create Event Module",
              },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "File Provider Modules",
        children: [
          {
            type: "link",
            path: "/architectural-modules/file",
            title: "Overview",
          },
          {
            type: "link",
            path: "/architectural-modules/file/local",
            title: "Local",
          },
          {
            type: "link",
            path: "/architectural-modules/file/s3",
            title: "AWS S3 (and Compatible APIs)",
          },
          {
            type: "sub-category",
            title: "Guides",
            children: [
              {
                type: "link",
                path: "/references/file-provider-module",
                title: "Create File Provider",
              },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Notification Provider Modules",
        children: [
          {
            type: "link",
            path: "/architectural-modules/notification",
            title: "Overview",
          },
          {
            type: "link",
            path: "/architectural-modules/notification/local",
            title: "Local",
          },
          {
            type: "link",
            path: "/architectural-modules/notification/sendgrid",
            title: "SendGrid",
          },
          {
            type: "sub-category",
            title: "Guides",
            children: [
              {
                type: "link",
                path: "/architectural-modules/notification/send-notification",
                title: "Send Notification",
              },
              {
                type: "link",
                path: "/references/notification-provider-module",
                title: "Create Notification Provider",
              },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Workflow Engine Modules",
        children: [
          {
            type: "link",
            path: "/architectural-modules/workflow-engine",
            title: "Overview",
          },
          {
            type: "link",
            path: "/architectural-modules/workflow-engine/in-memory",
            title: "In-Memory",
          },
          {
            type: "link",
            path: "/architectural-modules/workflow-engine/redis",
            title: "Redis",
          },
        ],
      },
    ],
  },
  {
    type: "link",
    path: "/storefront-development",
    title: "Storefront Development",
    isChildSidebar: true,
    children: [
      {
        type: "link",
        path: "/storefront-development/tips",
        title: "Tips",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Regions",
        children: [
          {
            type: "link",
            path: "/storefront-development/regions",
            title: "Overview",
          },
          {
            type: "link",
            path: "/storefront-development/regions/list",
            title: "List Regions",
          },
          {
            type: "link",
            path: "/storefront-development/regions/store-retrieve-region",
            title: "Store and Retrieve Regions",
          },
          {
            type: "link",
            path: "/storefront-development/regions/context",
            title: "Region React Context",
          },
        ],
      },
      {
        type: "category",
        title: "Products",
        children: [
          {
            type: "link",
            path: "/storefront-development/products",
            title: "Overview",
          },
          {
            type: "link",
            path: "/storefront-development/products/list",
            title: "List Products",
          },
          {
            type: "link",
            path: "/storefront-development/products/retrieve",
            title: "Retrieve a Product",
          },
          {
            type: "link",
            path: "/storefront-development/products/variants",
            title: "Select a Variant",
          },
          {
            type: "link",
            path: "/storefront-development/products/price",
            title: "Retrieve Variant Prices",
            autogenerate_path: "storefront-development/products/price/examples",
          },
          {
            type: "link",
            path: "/storefront-development/products/categories",
            title: "Categories",
            children: [
              {
                type: "link",
                path: "/storefront-development/products/categories/list",
                title: "List Categories",
              },
              {
                type: "link",
                path: "/storefront-development/products/categories/retrieve",
                title: "Retrieve a Category",
              },
              {
                type: "link",
                path: "/storefront-development/products/categories/products",
                title: "Retrieve a Category's Products",
              },
              {
                type: "link",
                path: "/storefront-development/products/categories/nested-categories",
                title: "Retrieve Nested Categories",
              },
            ],
          },
          {
            type: "link",
            path: "/storefront-development/products/collections",
            title: "Collections",
            children: [
              {
                type: "link",
                path: "/storefront-development/products/collections/list",
                title: "List Collections",
              },
              {
                type: "link",
                path: "/storefront-development/products/collections/retrieve",
                title: "Retrieve a Collection",
              },
              {
                type: "link",
                path: "/storefront-development/products/collections/products",
                title: "Retrieve a Collection's Products",
              },
            ],
          },
        ],
      },
      {
        type: "category",
        title: "Carts",
        children: [
          {
            type: "link",
            path: "/storefront-development/cart",
            title: "Overview",
          },
          {
            type: "link",
            path: "/storefront-development/cart/create",
            title: "Create Cart",
          },
          {
            type: "link",
            path: "/storefront-development/cart/retrieve",
            title: "Retrieve Cart",
          },
          {
            type: "link",
            path: "/storefront-development/cart/context",
            title: "Cart React Context",
          },
          {
            type: "link",
            path: "/storefront-development/cart/update",
            title: "Update Cart",
          },
          {
            type: "link",
            path: "/storefront-development/cart/manage-items",
            title: "Manage Line Items",
          },
        ],
      },
      {
        type: "category",
        title: "Checkout",
        children: [
          {
            type: "link",
            path: "/storefront-development/checkout",
            title: "Overview",
          },
          {
            type: "link",
            path: "/storefront-development/checkout/email",
            title: "1. Enter Email",
          },
          {
            type: "link",
            path: "/storefront-development/checkout/address",
            title: "2. Enter Address",
          },
          {
            type: "link",
            path: "/storefront-development/checkout/shipping",
            title: "3. Choose Shipping Method",
          },
          {
            type: "link",
            path: "/storefront-development/checkout/payment",
            title: "4. Choose Payment Provider",
            children: [
              {
                type: "link",
                path: "/storefront-development/checkout/payment/stripe",
                title: "Example: Stripe",
              },
            ],
          },
          {
            type: "link",
            path: "/storefront-development/checkout/complete-cart",
            title: "5. Complete Cart",
          },
        ],
      },
      {
        type: "category",
        title: "Customers",
        children: [
          {
            type: "link",
            path: "/storefront-development/customers",
            title: "Overview",
          },
          {
            type: "link",
            path: "/storefront-development/customers/register",
            title: "Register Customer",
          },
          {
            type: "link",
            path: "/storefront-development/customers/login",
            title: "Login Customer",
          },
          {
            type: "link",
            path: "/storefront-development/customers/retrieve",
            title: "Retrieve Customer",
          },
          {
            type: "link",
            path: "/storefront-development/customers/context",
            title: "Customer React Context",
          },
          {
            type: "link",
            path: "/storefront-development/customers/profile",
            title: "Edit Customer Profile",
          },
          {
            type: "link",
            path: "/storefront-development/customers/addresses",
            title: "Manage Customer Addresses",
          },
          {
            type: "link",
            path: "/storefront-development/customers/log-out",
            title: "Log-out Customer",
          },
        ],
      },
    ],
  },
  {
    type: "link",
    path: "/references/medusa-config",
    title: "Medusa Configurations",
  },
  {
    type: "separator",
  },
  {
    type: "category",
    title: "General",
    children: [
      {
        type: "link",
        path: "/upgrade-guides",
        title: "Upgrade Guides",
      },
      {
        type: "link",
        path: "/deployment",
        title: "Deployment Guides",
        isChildSidebar: true,
        children: [
          {
            type: "category",
            title: "Medusa Application",
            autogenerate_path: "/deployment/medusa-application",
          },
          {
            type: "category",
            title: "Medusa Admin",
            autogenerate_path: "/deployment/admin",
          },
          {
            type: "category",
            title: "Next.js Starter",
            autogenerate_path: "/deployment/storefront",
          },
        ],
      },
      {
        type: "link",
        path: "/troubleshooting",
        title: "Troubleshooting Guides",
        isChildSidebar: true,
        children: [
          {
            type: "category",
            title: "Installation",
            children: [
              {
                type: "link",
                path: "/troubleshooting/create-medusa-app-errors",
                title: "Create Medusa App Errors",
              },
              {
                type: "link",
                path: "/troubleshooting/errors-installing-cli",
                title: "Errors Installing CLI",
              },
              {
                type: "link",
                path: "/troubleshooting/general-errors",
                title: "General Errors",
              },
            ],
          },
          {
            type: "category",
            title: "Medusa Application",
            children: [
              {
                type: "link",
                path: "/troubleshooting/eaddrinuse",
                title: "EADDRINUSE Error",
              },
              {
                type: "link",
                path: "/troubleshooting/database-errors",
                title: "Database Errors",
              },
            ],
          },
          {
            type: "category",
            title: "Upgrade",
            children: [
              {
                type: "link",
                path: "/troubleshooting/errors-after-upgrading",
                title: "Errors After Upgrading",
              },
            ],
          },
          {
            type: "category",
            title: "Frontend",
            children: [
              {
                type: "link",
                path: "/troubleshooting/cors-errors",
                title: "CORS Errors",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    type: "category",
    title: "Lists",
    children: [
      {
        type: "link",
        path: "/medusa-container-resources",
        title: "Medusa Container Resources",
      },
      // {
      //   path: "/events-reference",
      //   title: "Events",
      // },
      {
        type: "link",
        path: "/admin-widget-injection-zones",
        title: "Admin Widget Injection Zones",
      },
    ],
  },
  {
    type: "category",
    title: "References",
    children: [
      {
        type: "link",
        path: "/references/workflows",
        title: "Workflow API",
        isChildSidebar: true,
        children: [
          {
            type: "category",
            title: "Functions",
            autogenerate_path: "/references/workflows/functions",
          },
        ],
      },
      {
        type: "link",
        path: "/references/data-model",
        title: "Data Model API",
        childSidebarTitle: "Data Model API Reference",
        isChildSidebar: true,
        children: [
          {
            type: "link",
            path: "/references/data-model/define",
            title: "Define Method",
          },
          {
            type: "separator",
          },
          {
            type: "category",
            title: "Property Types",
            autogenerate_path: "/references/dml/Property_Types/methods",
          },
          {
            type: "category",
            title: "Relationship Methods",
            autogenerate_path: "/references/dml/Relationship_Methods/methods",
          },
          {
            type: "category",
            title: "Model Methods",
            autogenerate_path: "/references/dml/Model_Methods/methods",
          },
          {
            type: "category",
            title: "Property Configuration Methods",
            autogenerate_path:
              "/references/dml/Property_Configuration_Methods/methods",
          },
        ],
      },
      {
        type: "link",
        path: "/service-factory-reference",
        title: "Service Factory Reference",
        isChildSidebar: true,
        children: [
          {
            type: "category",
            title: "Methods",
            autogenerate_path: "/service-factory-reference/methods",
          },
          {
            type: "category",
            title: "Tips",
            autogenerate_path: "/service-factory-reference/tips",
          },
        ],
      },
      {
        path: "/references/helper-steps",
        title: "Helper Steps Reference",
        isChildSidebar: true,
        autogenerate_path: "/references/helper_steps/functions",
      },
    ],
  },
  {
    type: "category",
    title: "Other",
    children: [
      {
        type: "sub-category",
        title: "Contribution Guidelines",
        children: [
          {
            type: "link",
            path: "/contribution-guidelines/docs",
            title: "Docs",
          },
          // {
          //   path: "/contribution-guidelines/admin-translations",
          //   title: "Admin Translations",
          // },
        ],
      },
      {
        type: "link",
        path: "/usage",
        title: "Usage",
      },
    ],
  },
])
