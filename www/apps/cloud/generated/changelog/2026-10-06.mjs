/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-06",
  title: "Redesigned payments and project security settings",
  summary: "Organization payment settings support connecting Stripe accounts, projects get security toggles per environment type, and the starter list is trimmed.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1791312676/Cloud%20Changelog/october-6-2026-16d76e.png",
  content: `- The organization's **Payments** settings are redesigned. When no payment provider is connected, a setup page shows the **Connect with Stripe** and **Medusa Managed Payments** options. Refer to [Payments](/organizations/payments) for more details.
- You can now connect a Stripe account to your organization with Stripe's authorization flow. Each connected account shows its status, its Stripe account ID, and, when active, the storefront environment variables to use. You can also disconnect an account. Refer to [Payments](/organizations/payments#connect-a-stripe-account) for more details.
- The Account Settings page of a Medusa-managed payment account now shows a summary of the account, including whether charges and payouts are enabled, an **Apply Now** button during onboarding, and the storefront environment variables once the account is active. The Money page now splits payouts and payments into separate sections. Refer to [Payments](/organizations/payments#medusa-managed-payments) for more details.
- A new **Security** page in the project's settings lets you enable managed rulesets, bot protection, and DDoS protection, and choose whether each applies to Production, long-lived, and preview environments. This page isn't available to all organizations yet. Refer to [Project Security Settings](/projects/security) for more details.
- The project creation starters now include the **Blank DTC Starter**, **Minimal B2B Starter**, **Modern DTC Starter**, and **Industrials Starter**. The Configurable Products, Grounded, Quiz-to-product, and Uncut Coffee starters are no longer available. Refer to [Projects](/projects#1-create-project-from-a-starter) for more details.`,
}
