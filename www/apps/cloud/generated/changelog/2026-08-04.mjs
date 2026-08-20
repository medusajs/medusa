/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-04",
  title: "Multiple custom domains per environment",
  image:
    "https://res.cloudinary.com/dza7lstvk/image/upload/v1786952781/Cloud%20Changelog/aug-4.png",
  summary:
    "Environments support multiple custom backend and storefront domains, and the AI Tools drawer lists what the Medusa MCP server can do.",
  content: `- An environment can now have more than one custom backend domain and more than one custom storefront domain, depending on your plan. Project and environment cards list the environment's domains and show a **+N more** button when they don't all fit. Refer to [Environment Custom Domains](/environments/custom-domains) for more details.
- The **AI Tools** drawer now lists what you can do with the Medusa MCP server, with an example prompt to copy for each one: migrating products from Shopify, WooCommerce, or Magento, integrating payment and fulfillment providers, and extending products with custom data. Refer to [Create First Project](/first-project#option-4-use-ai-tools) for more details.`,
}
