/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-16",
  title: "Webhook plan availability change and new usage metrics",
  summary: "Webhooks now require being on the Launch, Scale, or Enterprise plans, and the usage page tracks internal data transfer and webhooks.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1789576254/Cloud%20Changelog/september-16-2026-028725.png",
  content: `- The [Webhook Endpoints](https://docs.medusajs.com/cloud/webhooks/endpoints) and [Webhook Events](https://docs.medusajs.com/cloud/webhooks/events) now require being on the Launch, Scale, or Enterprise plans.
- The [Usage](https://docs.medusajs.com/cloud/usage) page now tracks two additional resource categories: **Internal Data Transfer** (data exchanged between internal services within your environment) and **Webhooks** (the number of webhook event deliveries sent to your configured endpoint).`,
}
