/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")
const { globSync } = require("glob")

const entries = globSync(path.join(__dirname, "json-output", "*.json"))

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
  useTsLinkResolution: false,
}

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  ...globalTypedocOptions,
  entryPoints: entries,
  entryPointStrategy: "merge",
  entryDocument: "_index.mdx",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
  maxLevel: 2,
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
    },

    // INVENTORY CONFIG
    "^inventory": {
      ...modulesOptions,
      frontmatterData: {
        displayed_sidebar: "inventoryReference",
      },
      allReflectionsHaveOwnDocument: true,
    },
    "^inventory/.*IInventoryService/methods": {
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
    },

    // JS CLIENT CONFIG
    "^js-client": {
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
      maxLevel: 4,
    },
    "^js-client/classes/": {
      frontmatterData: {
        displayed_sidebar: "jsClientSidebar",
        slug: "/references/js-client/{{alias}}",
      },
    },
    "^js-client/.*AdminOrdersResource": {
      maxLevel: 2,
    },
    "^js-client/.*internal/modules/internal": {
      reflectionGroups: {
        Constructors: false,
        "Type Aliases": false,
        Enumerations: false,
        Classes: false,
        Functions: false,
        Interfaces: false,
      },
    },

    // PRICING CONFIG
    "^pricing": {
      ...modulesOptions,
      frontmatterData: {
        displayed_sidebar: "pricingReference",
      },
    },
    "^pricing/.*IPricingModuleService/methods": {
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
    },

    // PRODUCT CONFIG
    "^product": {
      ...modulesOptions,
      frontmatterData: {
        displayed_sidebar: "productReference",
      },
    },
    "^product/.*IProductModuleService/methods": {
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
    "^stock-location/.*IStockLocationService/methods": {
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
    },
    "^workflows/index\\.md": {
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
    },
    "^workflows/.*functions": {
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
        suffix: "- Workflows Reference",
      },
    },
    "^workflows/.*classes/StepResponse": {
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
