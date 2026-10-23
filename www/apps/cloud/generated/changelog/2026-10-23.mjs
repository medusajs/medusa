/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-23",
  title: "Environment payments and a files CDN",
  summary: "Stripe accounts are now managed per environment with sandbox support, and projects can serve stored files through the Medusa CDN.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1792771789/Cloud%20Changelog/october-23-2026-f5bb74.png",
  content: `- Each environment now has a **Payments** section where you connect Stripe accounts, link them to the environment, view their balances and payouts, and copy the publishable key for your Next.js or Vite storefront. Previously, payments were managed from the organization's settings. Refer to [Payments](/payments) for more details.
- Non-production environments now show sandbox payment accounts with their balances and embedded Stripe payments and payouts panels, so you can test payments without real transactions. Refer to [Payments](/payments#manage-payments-in-sandbox-environments) for more details.
- Medusa-managed payment accounts now have **Account Settings**, **Payments and Payouts**, and **Onboarding** pages to manage the account, view its activity, and finish setting it up. Refer to [Payments](/payments#manage-medusa-managed-payment-accounts) for more details.
- A project's new CDN settings page lets you choose which environments serve their stored files through the Medusa CDN. Refer to [S3](/s3#serve-files-through-medusa-cdn) for more details.
- An environment's storage page now shows its Medusa CDN file URL, which you can copy, when the CDN is configured for that environment. Refer to [S3](/s3#access-s3-configurations-on-cloud) for more details.`,
}
