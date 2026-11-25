/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-25",
  title: "Payment reports and hidden database credentials",
  summary:
    "Payment accounts get a Reports tab, database connection strings require a confirmed reveal, and metered add-ons join the add-ons table.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795599827/Cloud%20Changelog/november-25-2026-957b86.png",
  content: `- Payment accounts now have a **Reports** page that shows balance and payout reconciliation reports. Sandbox accounts show it as a **Reports** tab in the environment's Payments section, and all accounts have it under **Settings** > **Payment Accounts**. Stripe-connected accounts show a message pointing you to your Stripe dashboard instead.
- Database connection strings are now hidden by default. You reveal a read-only or write connection string with a reveal button and a confirmation prompt, and Medusa logs each reveal. Only organization owners can reveal the write connection string. Previously, the connection strings were shown in plain text. Refer to [Database](/database#connect-to-a-cloud-database) for more details.
- The **Actor** column in the audit logs table now shows the actor's ID below their name.
- The **Add-ons** settings page now lists metered add-ons, such as Audit Logs, in the add-ons table, with a **Manage** link to the audit logs settings for members who can view them. The separate **Paid Features** section is removed. Refer to [Billing](/billing#where-can-i-view-my-add-ons) for more details.`,
}
