/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-16",
  title: "Search endpoint, webhook plan gate, and new usage metrics",
  summary: "Environments now expose a search endpoint for local development, webhooks require a plan entitlement, and the usage page tracks internal data transfer and webhooks.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1789576254/Cloud%20Changelog/september-16-2026-028725.png",
  content: `- Environments now have a **Search** section under **Database & Storage** > **Storage** that lets you enable or disable external search access. When enabled, a search endpoint URL is shown for use in local development. On production environments, only organization owners can toggle this setting and must confirm a prompt before the change takes effect. Refer to [Search Endpoint](https://docs.medusajs.com/cloud/search) for more details.
- The [Webhook Endpoints](https://docs.medusajs.com/cloud/webhooks/endpoints) and [Webhook Events](https://docs.medusajs.com/cloud/webhooks/events) pages now check whether your organization's plan includes webhooks. If it does not, an upgrade callout replaces the page content with a **Change Plan** button that navigates to the plan-change page.
- The [Usage](https://docs.medusajs.com/cloud/usage) page now tracks two additional resource categories: **Internal Data Transfer** (data exchanged between internal services within your environment) and **Webhooks** (the number of webhook event deliveries sent to your configured endpoint).`,
}
