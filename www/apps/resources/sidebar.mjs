import { sidebarAttachHrefCommonOptions } from "./utils/sidebar-attach-common-options.mjs"

/** @type {import('types').RawSidebarItemType[]} */
export const sidebar = sidebarAttachHrefCommonOptions([
  {
    path: "/",
    title: "Overview",
    hasTitleStyling: true,
  },
  {
    path: "/commerce-modules",
    title: "Commerce Modules",
    isChildSidebar: true,
    hasTitleStyling: true,
    children: [
      {
        path: "/commerce-modules/api-key",
        title: "API Key Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/api-key/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/api-key/tokens",
                title: "Tokens",
              },
              {
                path: "/commerce-modules/api-key/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/api-key",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IApiKeyModuleService Reference",
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
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/auth",
        title: "Auth Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/auth/module-options",
            title: "Module Options",
          },
          {
            path: "/commerce-modules/auth/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/auth/auth-providers",
                title: "Auth Providers",
              },
              {
                path: "/commerce-modules/auth/auth-flows",
                title: "Auth Flows",
              },
              {
                path: "/commerce-modules/auth/user-creation",
                title: "User Creation",
              },
              {
                path: "/commerce-modules/auth/persisting-auth-user",
                title: "Persisting Auth User",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/auth",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IAuthModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/auth/IAuthModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/auth/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Auth Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/auth_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/cart",
        title: "Cart Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/cart/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/cart/concepts",
                title: "Cart Concepts",
              },
              {
                path: "/commerce-modules/cart/promotions",
                title: "Promotion Adjustments",
              },
              {
                path: "/commerce-modules/cart/tax-lines",
                title: "Tax Lines",
              },
              {
                path: "/commerce-modules/cart/relations-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/cart",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "ICartModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/cart/ICartModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/cart/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Cart Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/cart_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/currency",
        title: "Currency Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/currency/examples",
            title: "Examples",
          },
          {
            title: "References",
            children: [
              {
                path: "/references/currency",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "ICurrencyModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/currency/ICurrencyModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/currency/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Currency Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/currency_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/customer",
        title: "Customer Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/customer/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/customer/customer-accounts",
                title: "Customer Accounts",
              },
              {
                path: "/commerce-modules/customer/relations-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/customer",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "ICustomerModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/customer/ICustomerModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/customer/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Customer Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/customer_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/fulfillment",
        title: "Fulfillment Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/fulfillment/module-options",
            title: "Module Options",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/fulfillment/concepts",
                title: "Fulfillment Concepts",
              },
              {
                path: "/commerce-modules/fulfillment/fulfillment-provider",
                title: "Fulfillment Provider",
              },
              {
                path: "/commerce-modules/fulfillment/shipping-options",
                title: "Shipping Options",
              },
              {
                path: "/commerce-modules/fulfillment/item-fulfillment",
                title: "Item Fulfillment",
              },
              {
                path: "/commerce-modules/fulfillment/relation-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/fulfillment",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IFulfillmentModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/fulfillment/IFulfillmentModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/fulfillment/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Fulfillment Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/fulfillment_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/inventory",
        title: "Inventory Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/inventory/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/inventory/concepts",
                title: "Inventory Concepts",
              },
              {
                path: "/commerce-modules/inventory/inventory-in-flows",
                title: "Inventory in Flows",
              },
              {
                path: "/commerce-modules/inventory/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/inventory_next",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IInventoryServiceNext Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/inventory_next/IInventoryServiceNext/methods",
                  },
                ],
              },
              {
                path: "/references/inventory_next/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Inventory Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/inventory_next_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/order",
        title: "Order Module",
        hasTitleStyling: true,
        children: [
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/order/concepts",
                title: "Order Concepts",
              },
              {
                path: "/commerce-modules/order/order-items",
                title: "Order Title",
              },
              {
                path: "/commerce-modules/order/promotion-adjustments",
                title: "Promotions Adjustments",
              },
              {
                path: "/commerce-modules/order/tax-lines",
                title: "Tax Lines",
              },
              {
                path: "/commerce-modules/order/transactions",
                title: "Transactions",
              },
              {
                path: "/commerce-modules/order/order-change",
                title: "Order Change",
              },
              {
                path: "/commerce-modules/order/order-versioning",
                title: "Order Versioning",
              },
              {
                path: "/commerce-modules/order/relations-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/order",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IOrderModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/order/IOrderModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/order/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Order Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/order_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/payment",
        title: "Payment Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/payment/module-options",
            title: "Module Options",
          },
          {
            path: "/commerce-modules/payment/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/payment/payment-collection",
                title: "Payment Collections",
              },
              {
                path: "/commerce-modules/payment/payment-session",
                title: "Payment Session",
              },
              {
                path: "/commerce-modules/payment/payment",
                title: "Payment",
              },
              {
                path: "/commerce-modules/payment/payment-provider",
                title: "Payment Provider",
              },
              {
                path: "/commerce-modules/payment/payment-flow",
                title: "Payment Flow",
              },
              {
                path: "/commerce-modules/payment/webhook-events",
                title: "Webhook Events",
              },
              {
                path: "/commerce-modules/payment/relation-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/payment/provider",
                title: "Payment Provider Reference",
              },
              {
                path: "/references/payment",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IPaymentModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/payment/IPaymentModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/payment/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Payment Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/payment_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/pricing",
        title: "Pricing Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/pricing/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/pricing/concepts",
                title: "Pricing Concepts",
              },
              {
                path: "/commerce-modules/pricing/price-calculation",
                title: "Prices Calculation",
              },
              {
                path: "/commerce-modules/pricing/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/pricing",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IPricingModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/pricing/IPricingModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/pricing/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Pricing Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/pricing_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/product",
        title: "Product Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/product/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/product/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/product",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IProductModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/product/IProductModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/product/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Product Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/product_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/promotion",
        title: "Promotion Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/promotion/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/promotion/concepts",
                title: "Promotion Concepts",
              },
              {
                path: "/commerce-modules/promotion/actions",
                title: "Promotion Actions",
              },
              {
                path: "/commerce-modules/promotion/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/promotion",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IPromotionModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/promotion/IPromotionModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/promotion/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Promotion Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/promotion_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/region",
        title: "Region Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/region/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/region/relations-to-other-modules",
                title: "Relations to Other Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/region",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IRegionModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/region/IRegionModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/region/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Region Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/region_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/sales-channel",
        title: "Sales Channel Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/sales-channel/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/sales-channel/publishable-api-keys",
                title: "Publishable API Keys",
              },
              {
                path: "/commerce-modules/sales-channel/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/sales-channel",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "ISalesChannelModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/sales_channel/ISalesChannelModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/sales-channel/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Sales Channel Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/sales_channel_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/stock-location",
        title: "Stock Location Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/stock-location/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/stock-location/concepts",
                title: "Stock Location Concepts",
              },
              {
                path: "/commerce-modules/stock-location/relations-to-other-modules",
                title: "Relation to Modules",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/stock-location",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IStockLocationServiceNext Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/stock_location_next/IStockLocationServiceNext/methods",
                  },
                ],
              },
              {
                path: "/references/stock-location/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle:
                  "Stock Location Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/stock_location_next_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/store",
        title: "Store Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/store/examples",
            title: "Examples",
          },
          {
            title: "References",
            children: [
              {
                path: "/references/store",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IStoreModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/store/IStoreModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/store/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Store Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/store_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/tax",
        title: "Tax Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/tax/module-options",
            title: "Module Options",
          },
          {
            path: "/commerce-modules/tax/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/tax/tax-region",
                title: "Tax Region",
              },
              {
                path: "/commerce-modules/tax/tax-rates-and-rules",
                title: "Tax Rates and Rules",
              },
              {
                path: "/commerce-modules/tax/tax-calculation-with-provider",
                title: "Tax Calculation",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/tax/provider",
                title: "Tax Provider Reference",
              },
              {
                path: "/references/tax",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "ITaxModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/tax/ITaxModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/tax/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "Tax Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/tax_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/commerce-modules/user",
        title: "User Module",
        hasTitleStyling: true,
        children: [
          {
            path: "/commerce-modules/user/module-options",
            title: "Module Options",
          },
          {
            path: "/commerce-modules/user/examples",
            title: "Examples",
          },
          {
            title: "Concepts",
            children: [
              {
                path: "/commerce-modules/user/user-creation-flows",
                title: "User Creation Flows",
              },
            ],
          },
          {
            title: "References",
            children: [
              {
                path: "/references/user",
                title: "Interface Reference",
                isChildSidebar: true,
                childSidebarTitle: "IUserModuleService Reference",
                children: [
                  {
                    title: "Methods",
                    hasTitleStyling: true,
                    autogenerate_path:
                      "/references/user/IUserModuleService/methods",
                  },
                ],
              },
              {
                path: "/references/user/models",
                title: "Data Models Reference",
                isChildSidebar: true,
                childSidebarTitle: "User Module Data Models Reference",
                children: [
                  {
                    title: "Data Models",
                    hasTitleStyling: true,
                    autogenerate_path: "/references/user_models/classes",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/plugins",
    title: "Plugins",
    isChildSidebar: true,
    hasTitleStyling: true,
    children: [
      {
        title: "Analytics",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/analytics/segment",
            title: "Segment",
          },
        ],
      },
      {
        title: "CMS",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/cms/contentful",
            title: "Contentful",
          },
          {
            path: "/plugins/cms/strapi",
            title: "Strapi",
          },
        ],
      },
      {
        title: "ERP",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/erp/brightpearl",
            title: "Brightpearl",
          },
        ],
      },
      {
        title: "Fulfillment",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/fulfillment/manual",
            title: "Manual Fulfillment",
          },
          {
            path: "/plugins/fulfillment/webshipper",
            title: "Webshipper",
          },
        ],
      },
      {
        title: "Notifications",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/notifications/mailchimp",
            title: "Mailchimp",
          },
          {
            path: "/plugins/notifications/sendgrid",
            title: "SendGrid",
          },
          {
            path: "/plugins/notifications/twilio-sms",
            title: "Twilio SMS",
          },
          {
            path: "/plugins/notifications/slack",
            title: "Slack",
          },
        ],
      },
      {
        title: "Payment",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/payment/klarna",
            title: "Klarna",
          },
          {
            path: "/plugins/payment/paypal",
            title: "PayPal",
          },
          {
            path: "/plugins/payment/stripe",
            title: "Stripe",
          },
        ],
      },
      {
        title: "Search",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/search/algolia",
            title: "Algolia",
          },
          {
            path: "/plugins/search/meilisearch",
            title: "MeiliSearch",
          },
        ],
      },
      {
        title: "Source",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/source/shopify",
            title: "Shopify",
          },
        ],
      },
      {
        title: "Storage",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/storage/local",
            title: "Local File Storage",
          },
          {
            path: "/plugins/storage/minio",
            title: "MinIO",
          },
          {
            path: "/plugins/storage/s3",
            title: "S3",
          },
          {
            path: "/plugins/storage/spaces",
            title: "Spaces",
          },
        ],
      },
      {
        title: "Other",
        hasTitleStyling: true,
        children: [
          {
            path: "/plugins/other/discount-generator",
            title: "Discount Generator",
          },
          {
            path: "/plugins/other/ip-lookup",
            title: "IP Lookup",
          },
          {
            path: "/plugins/other/restock-notifications",
            title: "Restock Notifications",
          },
          {
            path: "/plugins/other/wishlist",
            title: "Wishlist",
          },
        ],
      },
    ],
  },
  {
    title: "SDKs and Tools",
    hasTitleStyling: true,
    children: [
      {
        path: "/create-medusa-app",
        title: "create-medusa-app",
      },
      {
        path: "/medusa-cli",
        title: "Medusa CLI",
      },
      {
        path: "/js-client",
        title: "Medusa JS Client",
        isChildSidebar: true,
        children: [
          {
            path: "/references/js-client/AddressesResource",
            title: "admin",
            hasTitleStyling: true,
            children: [
              {
                path: "/references/js-client/AdminAuthResource",
                title: "auth",
              },
              {
                path: "/references/js-client/AdminBatchJobsResource",
                title: "batchJobs",
              },
              {
                path: "/references/js-client/AdminCollectionsResource",
                title: "collections",
              },
              {
                path: "/references/js-client/AdminCurrenciesResource",
                title: "currencies",
              },
              {
                path: "/references/js-client/AdminCustomResource",
                title: "custom",
              },
              {
                path: "/references/js-client/AdminCustomerGroupsResource",
                title: "customerGroups",
              },
              {
                path: "/references/js-client/AdminCustomersResource",
                title: "customers",
              },
              {
                path: "/references/js-client/AdminDiscountsResource",
                title: "discounts",
              },
              {
                path: "/references/js-client/AdminDraftOrdersResource",
                title: "draftOrders",
              },
              {
                path: "/references/js-client/AdminGiftCardsResource",
                title: "giftCards",
              },
              {
                path: "/references/js-client/AdminInventoryItemsResource",
                title: "inventoryItems",
              },
              {
                path: "/references/js-client/AdminInvitesResource",
                title: "invites",
              },
              {
                path: "/references/js-client/AdminNotesResource",
                title: "notes",
              },
              {
                path: "/references/js-client/AdminNotificationsResource",
                title: "notifications",
              },
              {
                path: "/references/js-client/AdminOrderEditsResource",
                title: "orderEdits",
              },
              {
                path: "/references/js-client/AdminOrdersResource",
                title: "orders",
              },
              {
                path: "/references/js-client/AdminPaymentCollectionsResource",
                title: "paymentCollections",
              },
              {
                path: "/references/js-client/AdminPaymentsResource",
                title: "payments",
              },
              {
                path: "/references/js-client/AdminPriceListResource",
                title: "priceLists",
              },
              {
                path: "/references/js-client/AdminProductCategoriesResource",
                title: "productCategories",
              },
              {
                path: "/references/js-client/AdminProductTagsResource",
                title: "productTags",
              },
              {
                path: "/references/js-client/AdminProductTypesResource",
                title: "productTypes",
              },
              {
                path: "/references/js-client/AdminProductsResource",
                title: "products",
              },
              {
                path: "/references/js-client/AdminPublishableApiKeyResource",
                title: "publishableApiKeys",
              },
              {
                path: "/references/js-client/AdminRegionsResource",
                title: "regions",
              },
              {
                path: "/references/js-client/AdminReservationsResource",
                title: "reservations",
              },
              {
                path: "/references/js-client/AdminReturnReasonsResource",
                title: "returnReasons",
              },
              {
                path: "/references/js-client/AdminReturnsResource",
                title: "returns",
              },
              {
                path: "/references/js-client/AdminSalesChannelsResource",
                title: "salesChannels",
              },
              {
                path: "/references/js-client/AdminShippingOptionsResource",
                title: "shippingOptions",
              },
              {
                path: "/references/js-client/AdminShippingProfilesResource",
                title: "shippingProfiles",
              },
              {
                path: "/references/js-client/AdminStockLocationsResource",
                title: "stockLocations",
              },
              {
                path: "/references/js-client/AdminStoresResource",
                title: "store",
              },
              {
                path: "/references/js-client/AdminSwapsResource",
                title: "swaps",
              },
              {
                path: "/references/js-client/AdminTaxRatesResource",
                title: "taxRates",
              },
              {
                path: "/references/js-client/AdminUploadsResource",
                title: "uploads",
              },
              {
                path: "/references/js-client/AdminUsersResource",
                title: "users",
              },
              {
                path: "/references/js-client/AdminVariantsResource",
                title: "variants",
              },
            ],
          },
          {
            title: "Store",
            hasTitleStyling: true,
            children: [
              {
                path: "/references/js-client/AuthResource",
                title: "auth",
              },
              {
                title: "carts",
                path: "/references/js-client/CartsResource",
                children: [
                  {
                    path: "/references/js-client/LineItemsResource",
                    title: "lineItems",
                  },
                ],
              },
              {
                path: "/references/js-client/CollectionsResource",
                title: "collections",
              },
              {
                path: "/references/js-client/CustomersResource",
                title: "customers",
                children: [
                  {
                    path: "/references/js-client/AddressesResource",
                    title: "addresses",
                  },
                  {
                    path: "/references/js-client/PaymentMethodsResource",
                    title: "paymentMethods",
                  },
                ],
              },
              {
                path: "/references/js-client/GiftCardsResource",
                title: "giftCards",
              },
              {
                path: "/references/js-client/OrderEditsResource",
                title: "orderEdits",
              },
              {
                path: "/references/js-client/OrdersResource",
                title: "orders",
              },
              {
                path: "/references/js-client/PaymentCollectionsResource",
                title: "paymentCollections",
              },
              {
                path: "/references/js-client/PaymentMethodsResource",
                title: "paymentMethods",
              },
              {
                path: "/references/js-client/ProductCategoriesResource",
                title: "productCategories",
              },
              {
                path: "/references/js-client/ProductTagsResource",
                title: "productTags",
              },
              {
                path: "/references/js-client/ProductTypesResource",
                title: "productTypes",
              },
              {
                path: "/references/js-client/ProductTypesResource",
                title: "productTypes",
              },
              {
                path: "/references/js-client/ProductsResource",
                title: "products",
                children: [
                  {
                    path: "/references/js-client/ProductVariantsResource",
                    title: "variants",
                  },
                ],
              },
              {
                path: "/references/js-client/RegionsResource",
                title: "regions",
              },
              {
                path: "/references/js-client/ReturnReasonsResource",
                title: "returnReasons",
              },
              {
                path: "/references/js-client/ReturnsResource",
                title: "returns",
              },
              {
                path: "/references/js-client/ShippingOptionsResource",
                title: "shippingOptions",
              },
              {
                path: "/references/js-client/SwapsResource",
                title: "swaps",
              },
            ],
          },
        ],
      },
      {
        path: "/medusa-react",
        title: "Medusa React",
        isChildSidebar: true,
        children: [
          {
            path: "/references/medusa-react/hooks",
            title: "Hooks",
            hasTitleStyling: true,
            children: [
              {
                path: "/references/medusa-react/hooks/admin",
                title: "Admin",
                autogenerate_path: "/references/medusa_react/Hooks/Admin",
              },
              {
                path: "/references/medusa-react/hooks/store",
                title: "Store",
                autogenerate_path: "/references/medusa_react/Hooks/Store",
              },
            ],
          },
          {
            path: "/references/medusa-react/providers",
            title: "Providers",
            hasTitleStyling: true,
            autogenerate_path: "/references/medusa_react/Providers",
          },
          {
            path: "/references/medusa-react/utilities",
            title: "Utilities",
            hasTitleStyling: true,
            autogenerate_path: "/references/medusa_react/Utilities/functions",
          },
        ],
      },
      {
        path: "/nextjs-starter",
        title: "Next.js Starter",
      },
    ],
  },
  {
    path: "/architectural-modules",
    title: "Architectural Modules",
    isChildSidebar: true,
    hasTitleStyling: true,
    children: [
      {
        path: "/architectural-modules/cache",
        title: "Cache Modules",
        hasTitleStyling: true,
        children: [
          {
            path: "/architectural-modules/cache/in-memory",
            title: "In-Memory",
          },
          {
            path: "/architectural-modules/cache/redis",
            title: "Redis",
          },
          {
            title: "Guides",
            children: [
              {
                path: "/architectural-modules/cache/create",
                title: "Create Cache Module",
              },
            ],
          },
        ],
      },
      {
        path: "/architectural-modules/event",
        title: "Event Modules",
        hasTitleStyling: true,
        children: [
          {
            path: "/architectural-modules/event/local",
            title: "Local",
          },
          {
            path: "/architectural-modules/event/redis",
            title: "Redis",
          },
          {
            title: "Guides",
            children: [
              {
                path: "/architectural-modules/event/create",
                title: "Create Event Module",
              },
            ],
          },
        ],
      },
      {
        path: "/architectural-modules/file",
        title: "File Provider Modules",
        hasTitleStyling: true,
        children: [
          {
            path: "/architectural-modules/file/local",
            title: "Local",
          },
          {
            title: "Guides",
            children: [
              {
                path: "/references/file-provider-module",
                title: "Create File Module",
              },
            ],
          },
        ],
      },
      {
        title: "Workflow Engine Modules",
        hasTitleStyling: true,
        children: [
          {
            path: "/architectural-modules/workflow-engine/in-memory",
            title: "In-Memory",
          },
          {
            path: "/architectural-modules/workflow-engine/redis",
            title: "Redis",
          },
        ],
      },
    ],
  },
  {
    title: "Recipes",
    hasTitleStyling: true,
    children: [
      {
        path: "/recipes/ecommerce",
        title: "Ecommerce",
      },
      {
        path: "/recipes/marketplace",
        title: "Marketplace",
      },
      {
        path: "/recipes/subscriptions",
        title: "Subscriptions",
      },
      {
        path: "/recipes/integrate-ecommerce-stack",
        title: "Integrate Ecommerce Stack",
      },
      {
        path: "/recipes/commerce-automation",
        title: "Commerce Automation",
      },
      {
        path: "/recipes/oms",
        title: "Order Management System",
      },
      {
        path: "/recipes/pos",
        title: "POS",
      },
      {
        path: "/recipes/digital-products",
        title: "Digital Products",
      },
      {
        path: "/recipes/personalized-products",
        title: "Personalized Products",
      },
      {
        path: "/recipes/b2b",
        title: "B2B",
      },
      {
        path: "/recipes/multi-region-store",
        title: "Multi-Region Store",
      },
      {
        path: "/recipes/omnichannel",
        title: "Omnichannel Store",
      },
    ],
  },
  {
    title: "Configurations",
    hasTitleStyling: true,
    children: [
      {
        path: "/references/medusa-config",
        title: "Medusa Application",
      },
      {
        path: "/configurations/medusa-admin",
        title: "Medusa Admin",
      },
    ],
  },
  {
    title: "General",
    hasTitleStyling: true,
    children: [
      {
        title: "Upgrade Guides",
      },
      {
        path: "/deployment",
        title: "Deployment Guides",
        isChildSidebar: true,
        children: [
          {
            title: "Medusa Application",
            hasTitleStyling: true,
            children: [
              {
                path: "/deployment/medusa-application/railway",
                title: "Railway",
              },
              {
                path: "/deployment/medusa-application/heroku",
                title: "Heroku",
              },
              {
                path: "/deployment/medusa-application/digitalocean",
                title: "DigitalOcean",
              },
              {
                path: "/deployment/medusa-application/microtica",
                title: "Microtica",
              },
              {
                path: "/deployment/medusa-application/general",
                title: "General Guide",
              },
            ],
          },
          {
            title: "Medusa Admin",
            hasTitleStyling: true,
            children: [
              {
                path: "/deployment/admin/vercel",
                title: "Vercel",
              },
              {
                path: "/deployment/admin/general",
                title: "General Guide",
              },
            ],
          },
          {
            title: "Next.js Starter",
            hasTitleStyling: true,
            children: [
              {
                path: "/deployment/storefront/vercel",
                title: "Vercel",
              },
              {
                path: "/deployment/storefront/general",
                title: "General Guide",
              },
            ],
          },
        ],
      },
      {
        path: "/troubleshooting",
        title: "Troubleshooting Guides",
        isChildSidebar: true,
        children: [
          {
            title: "Installation",
            hasTitleStyling: true,
            children: [
              {
                path: "/troubleshooting/create-medusa-app-errors",
                title: "Create Medusa App Errors",
              },
              {
                path: "/troubleshooting/errors-installing-cli",
                title: "Errors Installing CLI",
              },
              {
                path: "/troubleshooting/general-errors",
                title: "General Errors",
              },
            ],
          },
          {
            title: "Medusa Backend",
            hasTitleStyling: true,
            children: [
              {
                path: "/troubleshooting/eaddrinuse",
                title: "EADDRINUSE Error",
              },
              {
                path: "/troubleshooting/database-errors",
                title: "Database Errors",
              },
              {
                path: "/troubleshooting/transaction-promise-all",
                title: "Transactions and Promise.all",
              },
              {
                path: "/troubleshooting/payment-provider-missing",
                title: "Payment Provider Missing",
              },
            ],
          },
          {
            title: "Upgrade",
            hasTitleStyling: true,
            children: [
              {
                path: "/troubleshooting/errors-after-upgrading",
                title: "Errors After Upgrading",
              },
            ],
          },
          {
            title: "Frontend",
            hasTitleStyling: true,
            children: [
              {
                path: "/troubleshooting/cors-errors",
                title: "CORS Errors",
              },
            ],
          },
          {
            title: "Medusa Admin",
            hasTitleStyling: true,
            children: [
              {
                path: "/troubleshooting/admin-sign-in",
                title: "Signing In",
              },
              {
                path: "/troubleshooting/admin-custom-hooks-error",
                title: "Custom Hooks Error",
              },
              {
                path: "/troubleshooting/admin-webpack-build-error",
                title: "Webpack Build Error",
              },
            ],
          },
          {
            title: "Plugin",
            hasTitleStyling: true,
            children: [
              {
                path: "/troubleshooting/s3-plugin-acl-error",
                title: "S3 Plugin ACL Error",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Lists",
    hasTitleStyling: true,
    children: [
      {
        path: "/medusa-container-resources",
        title: "Medusa Container Resources",
      },
      {
        path: "/events-reference",
        title: "Events",
      },
      {
        path: "/admin-widget-injection-zones",
        title: "Admin Widget Injection Zones",
      },
    ],
  },
  {
    title: "API References",
    hasTitleStyling: true,
    children: [
      {
        path: "/references/workflows",
        title: "Workflow API",
        isChildSidebar: true,
        children: [
          {
            title: "Functions",
            hasTitleStyling: true,
            autogenerate_path: "/references/workflows/functions",
          },
        ],
      },
      {
        title: "Integration Services",
        children: [
          {
            path: "/references/notification-service",
            title: "Notification Service",
          },
          {
            path: "/references/file-service",
            title: "File Service",
          },
          {
            path: "/references/search-service",
            title: "Search Service",
          },
        ],
      },
      {
        title: "Modules",
        children: [
          {
            title: "Cache Service",
          },
          {
            title: "Event Bus Service",
          },
        ],
      },
    ],
  },
  {
    title: "Other",
    hasTitleStyling: true,
    children: [
      {
        title: "Contribution Guidelines",
        children: [
          {
            path: "/contribution-guidelines/docs",
            title: "Docs",
          },
          {
            path: "/contribution-guidelines/admin-translations",
            title: "Admin Translations",
          },
        ],
      },
      {
        path: "/usage",
        title: "Usage",
      },
    ],
  },
])
