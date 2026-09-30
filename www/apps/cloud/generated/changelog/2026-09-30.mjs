/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-30",
  title: "Database IP allowlist and keeping a plan after trial",
  summary: "You can restrict database access by IP address, and organizations whose free trial ended can add a payment method to keep their plan.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790761823/Cloud%20Changelog/september-30-2026-34fe7c.png",
  content: `- You can now restrict public access to an environment's database, or allow access only from specific IP addresses, from the new **IP Allowlist** section of the database settings. Refer to [Database](/database#restrict-database-access-by-ip-address) for more details.
- When your organization's free trial ends, the billing settings now let you keep your plan. If your organization has no payment method, the section shows an **Add Payment Method** button that takes you to add one. Otherwise, it shows a **Keep [Plan Name]** button. Refer to [Manage Plans](/billing/plans#resume-your-organizations-plan) for more details.`,
}
