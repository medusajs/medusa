/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-28",
  title: "Redesigned sandbox payments and dispute tracking",
  summary:
    "The sandbox payments section shows an account summary and activity tabs, and you can review Stripe disputes in both sandbox and production.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1793197552/Cloud%20Changelog/october-28-2026-d179cc.png",
  content: `- The sandbox payments section in non-production environments now shows a summary card for the linked sandbox Stripe account, with the account email, a copyable Stripe account ID, its status, and an overview of its balance and payouts.
- After a sandbox account is created, a tabbed activity panel appears below its summary, where you can browse the account's **Payments**, **Payouts**, and **Disputes**. Previously, the section only showed a card-style view with no account activity.
- A payment account can now show a **Rejected** status, and the sandbox summary explains what to do when an account is rejected.
- The sandbox section now refreshes automatically while a sandbox account is being created or onboarded, so it shows Stripe's verification result without reloading the page.
- The **Storefront Setup** section, which shows the publishable key for local development, is now a collapsible panel in both sandbox and production environments. Click it to reveal the publishable key. Previously, the section was always expanded.
- The Payments activity page of production environments now has a **Disputes** section below the **Payments** section, where you can review the disputes raised against your payments.
- Your plan card and the organization's [add-ons settings](https://docs.medusajs.com/cloud/billing#purchase-add-on-resources) now show the **Sandboxes** entitlement if your plan includes it. Previously, it was hidden.`,
}
