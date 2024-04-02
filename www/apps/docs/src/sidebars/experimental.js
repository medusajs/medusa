/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  experimentalSidebar: [
    {
      type: "ref",
      id: "development/overview",
      label: "Back to Medusa Development",
      customProps: {
        sidebar_is_back_link: true,
        sidebar_icon: "back-arrow",
      },
    },
    {
      type: "doc",
      id: "experimental/index",
      label: "Experimental",
      customProps: {
        sidebar_is_title: true,
        sidebar_icon: "beaker",
      },
    },
    {
      type: "category",
      label: "API Key Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/api-key/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/api-key/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Tokens",
          id: "experimental/api-key/tokens/index",
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/api-key/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/api_key/interfaces/api_key.IApiKeyModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/api_key_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Auth Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/auth/index",
        },
        {
          type: "doc",
          id: "experimental/auth/module-options/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/auth/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Auth Providers",
          id: "experimental/auth/auth-providers/index",
        },
        {
          type: "doc",
          id: "experimental/auth/auth-flows/index",
        },
        {
          type: "doc",
          id: "experimental/auth/user-creation/index",
        },
        {
          type: "doc",
          id: "experimental/auth/persisting-auth-user/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/auth/interfaces/auth.IAuthModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/auth_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Cart Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/cart/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/cart/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Cart Concepts",
          id: "experimental/cart/concepts/index",
        },
        {
          type: "doc",
          id: "experimental/cart/promotions/index",
        },
        {
          type: "doc",
          id: "experimental/cart/tax-lines/index",
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/cart/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/cart/interfaces/cart.ICartModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/cart_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Customer Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/customer/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/customer/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Customer Accounts",
          id: "experimental/customer/customer-accounts/index",
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/customer/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/customer/interfaces/customer.ICustomerModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/customer_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Inventory Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/inventory/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/inventory/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Inventory Concepts",
          id: "experimental/inventory/concepts/index",
        },
        {
          type: "doc",
          label: "Inventory in Flows",
          id: "experimental/inventory/inventory-in-flows/index",
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/inventory/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/inventory_next/interfaces/inventory_next.IInventoryServiceNext",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/inventory_next_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Payment Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/payment/index",
        },
        {
          type: "doc",
          id: "experimental/payment/module-options/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/payment/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Payment Collection",
          id: "experimental/payment/payment-collection/index",
        },
        {
          type: "doc",
          label: "Payment Session",
          id: "experimental/payment/payment-session/index",
        },
        {
          type: "doc",
          label: "Payment",
          id: "experimental/payment/payment/index",
        },
        {
          type: "doc",
          label: "Payment Provider",
          id: "experimental/payment/payment-provider/index",
        },
        {
          type: "doc",
          label: "Payment Flow",
          id: "experimental/payment/payment-flow/index",
        },
        {
          type: "doc",
          label: "Webhook Events",
          id: "experimental/payment/webhook-events/index",
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/payment/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "Payment Providers",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          id: "experimental/payment/payment-provider/stripe/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/payment_provider/classes/payment_provider.AbstractPaymentProvider",
          label: "Payment Provider Reference",
        },
        {
          type: "ref",
          id: "references/payment/interfaces/payment.IPaymentModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/payment_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Pricing Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/pricing/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/pricing/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Pricing Concepts",
          id: "experimental/pricing/concepts/index",
        },
        {
          type: "doc",
          label: "Prices Calculation",
          id: "experimental/pricing/price-calculation/index",
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/pricing/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/pricing/interfaces/pricing.IPricingModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/pricing_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Product Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/product/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/product/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/product/relations-to-other-modules/index",
        },
        {
          type: "ref",
          id: "references/product/interfaces/product.IProductModuleService",
          label: "Interface Reference",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/modules/product_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Promotion Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/promotion/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/promotion/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Promotion Concepts",
          id: "experimental/promotion/concepts/index",
        },
        {
          type: "doc",
          label: "Promotion Actions",
          id: "experimental/promotion/actions/index",
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/promotion/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/promotion/interfaces/promotion.IPromotionModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/promotion_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Region Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/region/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/region/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/region/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/region/interfaces/region.IRegionModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/region_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Sales Channel Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/sales-channel/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/sales-channel/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Publishable API Key",
          id: "experimental/sales-channel/publishable-api-keys/index",
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/sales-channel/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/sales_channel/interfaces/sales_channel.ISalesChannelModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/sales_channel_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Stock Location Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/stock-location/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/stock-location/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Stock Location Concepts",
          id: "experimental/stock-location/concepts/index",
        },
        {
          type: "doc",
          label: "Relations to Other Modules",
          id: "experimental/stock-location/relations-to-other-modules/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/stock_location_next/interfaces/stock_location_next.IStockLocationServiceNext",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/stock_location_next_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Store Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/store/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/store/examples/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/store/interfaces/store.IStoreModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/store_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "Tax Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/tax/index",
        },
        {
          type: "doc",
          id: "experimental/tax/module-options/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/tax/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "Tax Region",
          id: "experimental/tax/tax-region/index",
        },
        {
          type: "doc",
          id: "experimental/tax/tax-rates-and-rules/index",
        },
        {
          type: "doc",
          id: "experimental/tax/tax-calculation-with-provider/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/tax_provider/interfaces/tax_provider.ITaxProvider",
          label: "Tax Provider Reference",
        },
        {
          type: "ref",
          id: "references/tax/interfaces/tax.ITaxModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/tax_models",
          label: "Data Models Reference",
        },
      ],
    },
    {
      type: "category",
      label: "User Module",
      customProps: {
        sidebar_is_group_headline: true,
      },
      collapsible: true,
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Overview",
          id: "experimental/user/index",
        },
        {
          type: "doc",
          id: "experimental/user/module-options/index",
        },
        {
          type: "doc",
          label: "Examples",
          id: "experimental/user/examples/index",
        },
        {
          type: "html",
          value: "Architecture",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "doc",
          label: "User Creation Flows",
          id: "experimental/user/user-creation-flows/index",
        },
        {
          type: "html",
          value: "References",
          customProps: {
            sidebar_is_group_divider: true,
          },
        },
        {
          type: "ref",
          id: "references/user/interfaces/user.IUserModuleService",
          label: "Interface Reference",
        },
        {
          type: "ref",
          id: "references/modules/user_models",
          label: "Data Models Reference",
        },
      ],
    },
  ],
}
