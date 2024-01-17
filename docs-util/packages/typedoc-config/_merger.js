/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")

const baseSectionsOptions = {
  member_sources_definedIn: false,
  reflection_hierarchy: false,
  member_sources_inheritedFrom: false,
  member_sources_implementationOf: false,
  reflection_implementedBy: false,
  member_signature_sources: false,
  reflection_callable: false,
  reflection_indexable: false,
  reflection_implements: false,
  member_signature_title: false,
  member_signature_returns: false,
  title_reflectionPath: false,
}

const modulesSectionsOptions = {
  ...baseSectionsOptions,
  member_signature_typeParameters: false,
  member_declaration_typeParameters: false,
}

const modulesOptions = {
  sections: modulesSectionsOptions,
  expandMembers: true,
}

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  ...globalTypedocOptions,
  entryPoints: [
    path.join(__dirname, "..", "..", "typedoc-json-output", "*.json"),
  ],
  entryPointStrategy: "merge",
  entryDocument: "_index.mdx",
  out: path.join(
    __dirname,
    "..",
    "..",
    "..",
    "www",
    "apps",
    "docs",
    "content",
    "references"
  ),
  name: "references",
  indexTitle: "Medusa References",
  plugin: [...globalTypedocOptions.plugin, "typedoc-plugin-markdown-medusa"],
  excludeReferences: true,
  excludeNotDocumented: true,
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
  maxLevel: 3,
  allReflectionsHaveOwnDocument: [
    "inventory",
    "pricing",
    "product",
    "stock-location",
    "workflows",
  ],
  allReflectionsHaveOwnDocumentInNamespace: ["Utilities"],
  formatting: {
    "*": {
      showCommentsAsHeader: true,
      sections: baseSectionsOptions,
      parameterStyle: "component",
      parameterComponent: "ParameterTypes",
      mdxImports: [
        `import ParameterTypes from "@site/src/components/ParameterTypes"`,
      ],
    },
    internal: {
      maxLevel: 1,
    },

    // ENTITIES CONFIG
    "^entities": {
      reflectionGroups: {
        Constructors: false,
        Methods: false,
      },
      frontmatterData: {
        displayed_sidebar: "entitiesSidebar",
      },
      maxLevel: 2,
      parameterComponentExtraProps: {
        expandUrl:
          "https://docs.medusajs.com/development/entities/repositories#retrieving-a-list-of-records",
      },
    },
    "^entities/classes": {
      frontmatterData: {
        displayed_sidebar: "entitiesSidebar",
        slug: "/references/entities/classes/{{alias}}",
      },
    },
    "^entities/.*(Order|Swap|Cart|LineItem)": {
      maxLevel: 1,
    },

    // FULFILLMENT CONFIG
    "^fulfillment": {
      reflectionGroups: {
        Properties: false,
      },
      frontmatterData: {
        displayed_sidebar: "modules",
      },
      maxLevel: 2,
    },
    "^fulfillment/.*AbstractFulfillmentService": {
      reflectionDescription: `In this document, you’ll learn how to create a fulfillment provider to a Medusa backend and the methods you must implement in it. If you’re unfamiliar with the Shipping architecture in Medusa, make sure to [check out the overview first](https://docs.medusajs.com/modules/carts-and-checkout/shipping).`,
      frontmatterData: {
        displayed_sidebar: "modules",
        slug: "/modules/carts-and-checkout/backend/add-fulfillment-provider",
      },
      reflectionTitle: {
        fullReplacement: "How to Create a Fulfillment Provider",
      },
      endSections: [
        `## Test Implementation

:::note

If you created your fulfillment provider in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your fulfillment provider implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. Enable your fulfillment provider in one or more regions. You can do that either using the [Admin APIs](https://docs.medusajs.com/api/admin#regions_postregionsregionfulfillmentproviders) or the [Medusa Admin](https://docs.medusajs.com/user-guide/regions/providers#manage-fulfillment-providers).

4\\. To test out your fulfillment provider implementation, create a cart and complete an order. You can do that either using the [Next.js starter](https://docs.medusajs.com/starters/nextjs-medusa-starter) or [using Medusa's APIs and clients](https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-cart).
      `,
      ],
    },

    // INVENTORY CONFIG
    "^inventory": {
      ...modulesOptions,
      frontmatterData: {
        displayed_sidebar: "inventoryReference",
      },
    },
    "^inventory/IInventoryService/methods": {
      reflectionDescription:
        "This documentation provides a reference to the `{{alias}}` {{kind}}. This belongs to the Inventory Module.",
      frontmatterData: {
        displayed_sidebar: "inventoryReference",
        slug: "/references/inventory/{{alias}}",
        sidebar_label: "{{alias}}",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: "- Inventory Module Reference",
      },
    },
    "^inventory/.*IInventoryService\\.md": {
      reflectionDescription:
        "This section of the documentation provides a reference to the `IInventoryService` interface’s methods. This is the interface developers use to use the functionalities provided by the Inventory Module.",
      frontmatterData: {
        displayed_sidebar: "inventoryReference",
        slug: "/references/inventory",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: " Reference",
      },
    },

    // JS CLIENT CONFIG
    "^js_client": {
      sections: {
        ...baseSectionsOptions,
        member_declaration_title: false,
      },
      reflectionGroups: {
        Constructors: false,
      },
      frontmatterData: {
        displayed_sidebar: "jsClientSidebar",
      },
      parameterComponentExtraProps: {
        expandUrl:
          "https://docs.medusajs.com/js-client/overview#expanding-fields",
      },
      maxLevel: 4,
    },
    "^js_client/classes/": {
      frontmatterData: {
        displayed_sidebar: "jsClientSidebar",
        slug: "/references/js-client/{{alias}}",
      },
    },
    "^js_client/.*AdminOrdersResource": {
      maxLevel: 2,
    },
    "^js_client/.*LineItemsResource": {
      maxLevel: 3,
    },

    // MEDUSA REACT CONFIG
    "^medusa_react": {
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
      },
      parameterComponentExtraProps: {
        expandUrl:
          "https://docs.medusajs.com/medusa-react/overview#expanding-fields",
      },
    },
    "^modules/medusa_react\\.mdx": {
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
      },
      reflectionGroups: {
        Variables: false,
        Functions: false,
      },
      reflectionCategories: {
        Mutations: false,
        Queries: false,
        Other: false,
      },
    },
    "^medusa_react/(medusa_react\\.Hooks\\.mdx|.*medusa_react\\.Hooks\\.Admin\\.mdx|.*medusa_react\\.Hooks\\.Store\\.mdx|medusa_react\\.Providers\\.mdx)":
      {
        reflectionGroups: {
          Functions: false,
        },
      },
    "^medusa_react/Providers/.*": {
      expandMembers: true,
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
        slug: "/references/medusa-react/providers/{{alias-lower}}",
        sidebar_label: "{{alias}}",
      },
      reflectionTitle: {
        suffix: " Provider Overview",
      },
    },
    "^medusa_react/medusa_react\\.Utilities": {
      expandMembers: true,
      reflectionTitle: {
        prefix: "Medusa React ",
      },
    },
    "^medusa_react/Utilities/.*": {
      expandMembers: true,
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
        slug: "/references/medusa-react/utilities/{{alias}}",
      },
    },
    "^medusa_react/medusa_react\\.Hooks\\.mdx": {
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
        slug: "/references/medusa-react/hooks",
      },
    },
    "^medusa_react/Hooks/Admin/.*Admin\\.mdx": {
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
        slug: "/references/medusa-react/hooks/admin",
      },
    },
    "^medusa_react/Hooks/Admin/.*": {
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
        slug: "/references/medusa-react/hooks/admin/{{alias-lower}}",
      },
    },
    "^medusa_react/Hooks/Store/.*Store\\.mdx": {
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
        slug: "/references/medusa-react/hooks/store",
      },
    },
    "^medusa_react/Hooks/Store/.*": {
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
        slug: "/references/medusa-react/hooks/store/{{alias-lower}}",
      },
    },
    "^medusa_react/medusa_react\\.Providers\\.mdx": {
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
        slug: "/references/medusa-react/providers",
      },
    },
    "^medusa_react/medusa_react\\.Utilities\\.mdx": {
      frontmatterData: {
        displayed_sidebar: "medusaReactSidebar",
        slug: "/references/medusa-react/utilities",
      },
    },
    "^medusa_react/Hooks/.*Admin\\.Inventory_Items": {
      maxLevel: 4,
    },
    "^medusa_react/Hooks/.*Admin\\.Products": {
      maxLevel: 4,
    },
    "^medusa_react/Hooks/.*Admin\\.Stock_Locations": {
      maxLevel: 5,
    },
    "^medusa_react/Hooks/.*Admin\\.Users": {
      maxLevel: 5,
    },

    // MEDUSA CONFIG
    "^medusa/": {
      frontmatterData: {
        displayed_sidebar: "homepage",
      },
      maxLevel: 2,
      parameterComponentExtraProps: {
        expandUrl:
          "https://docs.medusajs.com/development/entities/repositories#retrieving-a-list-of-records",
      },
    },
    "^medusa/classes/medusa\\.(Store*|Admin*)": {
      reflectionGroups: {
        Constructors: false,
      },
    },

    // PAYMENT CONFIG
    "^payment": {
      frontmatterData: {
        displayed_sidebar: "modules",
      },
      maxLevel: 2,
    },
    "^payment/.*AbstractPaymentProcessor": {
      reflectionDescription: `In this document, you’ll learn how to create a Payment Processor in your Medusa backend. If you’re unfamiliar with the Payment architecture in Medusa, make sure to check out the [overview](https://docs.medusajs.com/modules/carts-and-checkout/payment) first.`,
      frontmatterData: {
        displayed_sidebar: "modules",
        slug: "/modules/carts-and-checkout/backend/add-payment-provider",
      },
      reflectionTitle: {
        fullReplacement: "How to Create a Payment Processor",
      },
      reflectionGroups: {
        Properties: false,
      },
      endSections: [
        `## Test Implementation

:::note

If you created your payment processor in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your payment processor implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. Enable your payment processor in one or more regions. You can do that either using the [Admin APIs](https://docs.medusajs.com/api/admin#regions_postregionsregionfulfillmentproviders) or the [Medusa Admin](https://docs.medusajs.com/user-guide/regions/providers#manage-fulfillment-providers).

4\\. There are different ways to test out your payment processor, such as authorizing payment on order completion or capturing payment of an order. You test payment in a checkout flow either using the [Next.js starter](https://docs.medusajs.com/starters/nextjs-medusa-starter) or [using Medusa's APIs and clients](https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-checkout-flow).
      `,
      ],
    },

    // PRICING CONFIG
    "^pricing": {
      ...modulesOptions,
      frontmatterData: {
        displayed_sidebar: "pricingReference",
      },
    },
    "^pricing/IPricingModuleService/methods": {
      reflectionDescription:
        "This documentation provides a reference to the `{{alias}}` {{kind}}. This belongs to the Pricing Module.",
      frontmatterData: {
        displayed_sidebar: "pricingReference",
        badge: {
          variant: "orange",
          text: "Beta",
        },
        slug: "/references/pricing/{{alias}}",
        sidebar_label: "{{alias}}",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: "- Pricing Module Reference",
      },
    },
    "^pricing/.*IPricingModuleService\\.md": {
      reflectionDescription:
        "This section of the documentation provides a reference to the `IPricingModuleService` interface’s methods. This is the interface developers use to use the functionalities provided by the Pricing Module.",
      frontmatterData: {
        displayed_sidebar: "pricingReference",
        badge: {
          variant: "orange",
          text: "Beta",
        },
        slug: "/references/pricing",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: " Reference",
      },
    },

    // PRODUCT CONFIG
    "^product": {
      ...modulesOptions,
      frontmatterData: {
        displayed_sidebar: "productReference",
      },
    },
    "^product/IProductModuleService/methods": {
      reflectionDescription:
        "This documentation provides a reference to the {{alias}} {{kind}}. This belongs to the Product Module.",
      frontmatterData: {
        displayed_sidebar: "productReference",
        badge: {
          variant: "orange",
          text: "Beta",
        },
        slug: "/references/product/{{alias}}",
        sidebar_label: "{{alias}}",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: "- Product Module Reference",
      },
    },
    "^product/.*IProductModuleService\\.md": {
      reflectionDescription:
        "This section of the documentation provides a reference to the `IProductModuleService` interface’s methods. This is the interface developers use to use the functionalities provided by the Product Module.",
      frontmatterData: {
        displayed_sidebar: "productReference",
        badge: {
          variant: "orange",
          text: "Beta",
        },
        slug: "/references/product",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: " Reference",
      },
    },

    // SERVICES CONFIG
    "^services": {
      frontmatterData: {
        displayed_sidebar: "servicesSidebar",
      },
      maxLevel: 1,
    },

    // STOCK LOCATION CONFIG
    "^stock-location": {
      ...modulesOptions,
      frontmatterData: {
        displayed_sidebar: "stockLocationReference",
      },
    },
    "^stock-location/IStockLocationService/methods": {
      reflectionDescription:
        "This documentation provides a reference to the `{{alias}}` {{kind}}. This belongs to the Stock Location Module.",
      frontmatterData: {
        displayed_sidebar: "stockLocationReference",
        slug: "/references/stock-location/{{alias}}",
        sidebar_label: "{{alias}}",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: "- Stock Location Module Reference",
      },
    },
    "^stock-location/.*IStockLocationService\\.md": {
      reflectionDescription:
        "This section of the documentation provides a reference to the `IStockLocationService` interface’s methods. This is the interface developers use to use the functionalities provided by the Stock Location Module.",
      frontmatterData: {
        displayed_sidebar: "stockLocationReference",
        slug: "/references/stock-location",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: " Reference",
      },
    },

    // WORKFLOWS CONFIG
    "^workflows": {
      expandMembers: true,
      sections: {
        ...baseSectionsOptions,
        member_getterSetter: false,
      },
      frontmatterData: {
        displayed_sidebar: "workflowsSidebar",
      },
      maxLevel: 2,
    },
    "^modules/workflows\\.md": {
      reflectionDescription:
        "This section of the documentation provides a reference to the utility functions of the `@medusajs/workflows-sdk` package.",
      reflectionGroups: {
        Namespaces: false,
        Enumerations: false,
        Classes: false,
        Interfaces: false,
        "Type Aliases": false,
        Variables: false,
        "Enumeration Members": false,
      },
      frontmatterData: {
        displayed_sidebar: "workflowsSidebar",
        slug: "/references/workflows",
      },
      reflectionTitle: {
        fullReplacement: "Workflows API Reference",
      },
    },
    "^workflows/functions": {
      maxLevel: 1,
      reflectionDescription:
        "This documentation provides a reference to the `{{alias}}` {{kind}}. It belongs to the `@medusajs/workflows-sdk` package.",
      frontmatterData: {
        displayed_sidebar: "workflowsSidebar",
        slug: "/references/workflows/{{alias}}",
        sidebar_label: "{{alias}}",
      },
      reflectionTitle: {
        kind: false,
        typeParameters: false,
        suffix: "- Workflows API Reference",
      },
    },
    "^workflows/.*classes/.*StepResponse": {
      reflectionGroups: {
        Properties: false,
      },
    },
    "^workflows/.*transform": {
      reflectionGroups: {
        "Type Parameters": false,
      },
    },
  },
}
