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
  member_declaration_children: false,
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
      parameterComponent: "TypeList",
      mdxImports: [`import TypeList from "@site/src/components/TypeList"`],
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

    // FILE CONFIG
    "^file": {
      frontmatterData: {
        displayed_sidebar: "core",
      },
    },
    "^file/.*AbstractFileService": {
      reflectionGroups: {
        Properties: false,
      },
      reflectionDescription: `In this document, you’ll learn how to create a file service in the Medusa backend and the methods you must implement in it.`,
      frontmatterData: {
        displayed_sidebar: "core",
        slug: "/development/file-service/create-file-service",
      },
      reflectionTitle: {
        fullReplacement: "How to Create a File Service",
      },
      endSections: [
        `## Test Implementation

:::note

If you created your file service in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your file service implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. Upload a file using the [Admin REST APIs](https://docs.medusajs.com/api/admin#uploads_postuploads) or using the Medusa admin, for example, to [upload a product's thumbnail](https://docs.medusajs.com/user-guide/products/manage#manage-thumbnails).
      `,
      ],
    },

    // FULFILLMENT CONFIG
    "^fulfillment": {
      frontmatterData: {
        displayed_sidebar: "modules",
      },
      maxLevel: 2,
    },
    "^fulfillment/.*AbstractFulfillmentService": {
      reflectionGroups: {
        Properties: false,
      },
      reflectionDescription: `In this document, you’ll learn how to create a fulfillment provider in the Medusa backend and the methods you must implement in it. If you’re unfamiliar with the Shipping architecture in Medusa, make sure to [check out the overview first](https://docs.medusajs.com/modules/carts-and-checkout/shipping).`,
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
        suffix: "Reference",
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

    // MEDUSA CONFIG CONFIG
    "^medusa_config": {
      frontmatterData: {
        displayed_sidebar: "core",
      },
      expandMembers: true,
    },
    "^medusa_config/.*ConfigModule": {
      frontmatterData: {
        displayed_sidebar: "core",
        slug: "/development/backend/configurations",
      },
      reflectionDescription: `In this document, you’ll learn how to create a file service in the Medusa backend and the methods you must implement in it.

## Prerequisites

This document assumes you already followed along with the [Prepare Environment documentation](https://docs.medusajs.com/development/backend/prepare-environment) and have a Medusa backend installed.
      
---`,
      reflectionTitle: {
        fullReplacement: "Configure Medusa Backend",
      },
      expandMembers: true,
      expandProperties: true,
      // parameterStyle: "list",
      sections: {
        ...baseSectionsOptions,
        member_declaration_title: false,
        member_declaration_children: true,
      },
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

    // NOTIFICATION CONFIG
    "^notification": {
      frontmatterData: {
        displayed_sidebar: "core",
      },
    },
    "^notification/.*AbstractNotificationService": {
      reflectionGroups: {
        Properties: false,
      },
      reflectionDescription: `In this document, you’ll learn how to create a notification provider in the Medusa backend and the methods you must implement in it. Learn more about the notification architecture in [this documentation](https://docs.medusajs.com/development/notification/overview)`,
      frontmatterData: {
        displayed_sidebar: "core",
        slug: "/development/notification/create-notification-provider",
      },
      reflectionTitle: {
        fullReplacement: "How to Create a Notification Provider",
      },
      endSections: [
        `## Subscribe with Loaders

After creating your Notification Provider Service, you must create a [Loader](https://docs.medusajs.com/development/loaders/overview) that registers this Service as a notification handler of events.

For example, to register the \`email-sender\` Notification Provider as a handler for the \`order.placed\` event, create the file \`src/loaders/notification.ts\` with the following content:

\`\`\`ts title="src/loaders/notification.ts"
import { 
  MedusaContainer, 
  NotificationService,
} from "@medusajs/medusa"

export default async (
  container: MedusaContainer
): Promise<void> => {
  const notificationService = container.resolve<
    NotificationService
  >("notificationService")

  notificationService.subscribe(
    "order.placed", 
    "email-sender"
  )
}
\`\`\`

This loader accesses the \`notificationService\` through the [MedusaContainer](https://docs.medusajs.com/development/fundamentals/dependency-injection). The \`notificationService\` has a \`subscribe\` method that accepts 2 parameters. The first one is the name of the event to subscribe to, and the second is the identifier of the Notification Provider that's subscribing to that event.`,
        `## Test Sending a Notification

Make sure you have an event bus module configured in your Medusa backend. You can learn more on how to do that in the [Configurations guide](https://docs.medusajs.com/development/backend/configurations#modules).

Then:

1\\. Run the \`build\` command in the root directory of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start your Medusa backend:

\`\`\`bash npm2yarn
npx medusa develop
\`\`\`

3\\. Place an order either using the [REST APIs](https://docs.medusajs.com/api/store) or using the [storefront](https://docs.medusajs.com/starters/nextjs-medusa-starter).

4\\. After placing an order, you can see in your console the message “Notification Sent”. If you added your own notification sending logic, you should receive an email or alternatively the type of notification you’ve set up.`,
        `## Test Resending a Notification

To test resending a notification:

1. Retrieve the ID of the notification you just sent using the [List Notifications API Route](https://docs.medusajs.com/api/admin#notifications_getnotifications). You can pass as a body parameter the \`to\` or \`event_name\` parameters to filter out the notification you just sent.

2. Send a request to the [Resend Notification API Route](https://docs.medusajs.com/api/admin#notifications_postnotificationsnotificationresend) using the ID retrieved from the previous request. You can pass the \`to\` parameter in the body to change the receiver of the notification. 

3. You should see the message “Notification Resent” in your console.
        `,
      ],
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

3\\. Enable your payment processor in one or more regions. You can do that either using the [Admin APIs](https://docs.medusajs.com/api/admin#regions_postregionsregionpaymentproviders) or the [Medusa Admin](https://docs.medusajs.com/user-guide/regions/providers#manage-payment-providers).

4\\. There are different ways to test out your payment processor, such as authorizing payment on order completion or capturing payment of an order. You test payment in a checkout flow either using the [Next.js starter](https://docs.medusajs.com/starters/nextjs-medusa-starter) or [using Medusa's APIs and clients](https://docs.medusajs.com/modules/carts-and-checkout/storefront/implement-checkout-flow).
      `,
      ],
    },

    // PRICE SELECTION CONFIG
    "^price_selection": {
      frontmatterData: {
        displayed_sidebar: "modules",
      },
    },
    "^price_selection/.*AbstractPriceSelectionStrategy": {
      reflectionDescription: `In this document, you’ll learn what the price selection strategy and how to override it in the Medusa backend.`,
      reflectionGroups: {
        Properties: false,
      },
      frontmatterData: {
        displayed_sidebar: "modules",
        slug: "/modules/price-lists/price-selection-strategy",
      },
      reflectionTitle: {
        fullReplacement: "How to Override the Price Selection Strategy",
      },
      endSections: [
        `## Test Implementation

:::note

If you created your price selection strategy in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your price selection strategy implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. To test out your price selection strategy implementation, you can retrieve a product and it's variants by specifying pricing parameters as explained in [this guide](https://docs.medusajs.com/modules/products/storefront/show-products#product-pricing-parameters).
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
        suffix: "Reference",
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
        suffix: "Reference",
      },
    },

    // SEARCH CONFIG
    "^search": {
      frontmatterData: {
        displayed_sidebar: "core",
      },
    },
    "^search/.*AbstractSearchService": {
      reflectionDescription: `In this document, you’ll learn how to create a search service in the Medusa backend and the methods you must implement in it.

## Prerequisites

A search service must extend the \`AbstractSearchService\` class imported from the \`@medusajs/utils\` package. If you don’t already have the package 
installed, run the following command to install it within your project:

\`\`\`bash npm2yarn
npm install @medusajs/utils
\`\`\`

---`,
      frontmatterData: {
        displayed_sidebar: "core",
        slug: "/development/search/create",
      },
      reflectionTitle: {
        fullReplacement: "How to Create a Search Service",
      },
      endSections: [
        `## Test Implementation

:::note

If you created your search service in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your search service implementation:

1\\. Make sure you have an [event bus module](https://docs.medusajs.com/development/events/modules/redis) installed that triggers search indexing when the Medusa backend loads.

2\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

3\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

4\\. Try to search for products either using the [Search Products API Route](https://docs.medusajs.com/api/store#products_postproductssearch). The results returned by your search service's \`search\` method is returned in the \`hits\` response field.
      `,
      ],
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
        suffix: "Reference",
      },
    },

    // TAX CALCULATION CONFIG
    "^tax_calculation": {
      frontmatterData: {
        displayed_sidebar: "modules",
      },
    },
    "^tax_calculation/.*AbstractTaxCalculationStrategy": {
      reflectionGroups: {
        Properties: false,
      },
      reflectionDescription: `In this document, you’ll learn how to override the tax calculations strategy in the Medusa backend and the methods you must implement in it.`,
      frontmatterData: {
        displayed_sidebar: "modules",
        slug: "/modules/taxes/backend/tax-calculation-strategy",
      },
      reflectionTitle: {
        fullReplacement: "How to Override a Tax Calculation Strategy",
      },
      endSections: [
        `## Test Implementation

:::note

If you created your tax calculation strategy in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your tax calculation strategy implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. To test out your tax calculation strategy implementation, you can [trigger taxes calculation manually](https://docs.medusajs.com/modules/taxes/storefront/manual-calculation).
      `,
      ],
    },

    // TAX PROVIDER CONFIG
    "^tax/": {
      frontmatterData: {
        displayed_sidebar: "modules",
      },
    },
    "^tax/.*AbstractTaxService": {
      reflectionGroups: {
        Properties: false,
      },
      reflectionDescription: `In this document, you’ll learn how to create a tax provider in the Medusa backend and the methods you must implement in it.`,
      frontmatterData: {
        displayed_sidebar: "modules",
        slug: "/modules/taxes/backend/create-tax-provider",
      },
      reflectionTitle: {
        fullReplacement: "How to Create a Tax Provider",
      },
      endSections: [
        `## Test Implementation

:::note

If you created your tax provider in a plugin, refer to [this guide on how to test plugins](https://docs.medusajs.com/development/plugins/create#test-your-plugin).

:::

After finishing your tax provider implementation:

1\\. Run the \`build\` command in the root of your Medusa backend:

\`\`\`bash npm2yarn
npm run build
\`\`\`

2\\. Start the backend with the \`develop\` command:

\`\`\`bash
npx medusa develop
\`\`\`

3\\. Use the tax provider in a region. You can do that either using the [Admin APIs](https://docs.medusajs.com/modules/taxes/admin/manage-tax-settings#change-tax-provider-of-a-region) or the [Medusa Admin](https://docs.medusajs.com/user-guide/taxes/manage#change-tax-provider).

4\\. To test out your tax provider implementation, you can [trigger taxes calculation manually](https://docs.medusajs.com/modules/taxes/storefront/manual-calculation).
      `,
      ],
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
