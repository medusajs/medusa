/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-25",
  title: "Medusa Payments and MCP write access",
  summary:
    "Medusa Payments enters beta, and AI agents connected to the Medusa MCP can change store data in environments you give write access.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795508149/Cloud%20Changelog/nov-25-10b596.png",
  content: `- Medusa Payments is now available in beta. Your stores can take payments without configuring a payment provider, and Cloud sets up the provider in your Medusa application and storefront. Refer to [Medusa Payments](/payments) for more details.
- Your organization has a new **Payments** section in the sidebar, where you set up a Medusa Payments account that Medusa creates and runs for you, or connect your own Stripe accounts. Refer to [Payment Accounts](/payments/accounts) for more details.
- The organization's **Payments** section also shows each payment account's transactions, payouts, and disputes.
- Each environment has a new **Payments** page, where you switch its payments between test and live mode, choose the live accounts it uses, and view its transactions. Refer to [Set up Medusa Payments in Environments](/payments/environments) for more details.
- You can turn on local development on an environment's **Payments** page, so a Medusa application and storefront running on your machine take test payments with the environment's test account. Refer to [Use Medusa Payments in Local Development](/payments/environments#use-medusa-payments-in-local-development) for more details.
- AI agents connected to the Medusa MCP can now create, update, and delete store data, such as products, orders, and promotions, in environments that you give read and write access. Previously, the Medusa MCP was read-only. Refer to [Medusa MCP](https://docs.medusajs.com/cloud/medusa-mcp#read-and-write-access) for more details.
- The consent page you see when connecting an AI agent now has a **Read** and a **Write** checkbox for each environment, and starts from the environments and access you chose for that agent last time.
- The **Connections** settings page is now **MCP and Connectors**. Its table shows each connector's access level and organizations, its drawer lets you change each environment's access and review unsaved changes before saving, and the page shows instructions to connect an AI agent. Refer to [MCP and Connectors](https://docs.medusajs.com/cloud/organizations/connections) for more details.
`,
}
