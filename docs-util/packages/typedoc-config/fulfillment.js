/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = {
  ...globalTypedocOptions,
  entryPoints: [
    path.join(
      pathPrefix,
      "packages/medusa/src/interfaces/fulfillment-service.ts"
    ),
  ],
  out: [path.join(pathPrefix, "www/apps/docs/content/references/fulfillment")],
  tsconfig: path.join(__dirname, "extended-tsconfig", "medusa.json"),
  name: "Fulfillment Provider Reference",
  indexTitle: "Fulfillment Provider Reference",
  entryDocument: "_index.mdx",
  hideInPageTOC: true,
  hideBreadcrumbs: true,
  formatting: {
    "*": {
      showCommentsAsHeader: true,
      sections: {
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
      },
      parameterStyle: "component",
      parameterComponent: "ParameterTypes",
      mdxImports: [
        `import ParameterTypes from "@site/src/components/ParameterTypes"`,
      ],
      reflectionGroups: {
        Properties: false,
      },
      frontmatterData: {
        displayed_sidebar: "modules",
      },
    },
    AbstractFulfillmentService: {
      reflectionDescription: `In this document, you’ll learn how to create a fulfillment provider to a Medusa backend and the methods you must implement in it. If you’re unfamiliar with the Shipping architecture in Medusa, make sure to [check out the overview first](https://docs.medusajs.com/modules/carts-and-checkout/shipping).`,
      frontmatterData: {
        displayed_sidebar: "modules",
        slug: "/modules/carts-and-checkout/backend/add-fulfillment-provider",
      },
      reflectionTitle: {
        fullReplacement: "How to Create a Fulfillment Provider",
      },
    },
  },
  objectLiteralTypeDeclarationStyle: "component",
  mdxOutput: true,
  maxLevel: 2,
}
