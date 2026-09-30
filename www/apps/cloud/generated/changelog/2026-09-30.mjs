/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-30",
  title: "Database IP allowlist and free trials",
  summary: "You can restrict database access by IP address, new organizations start with a free trial, and external apps can request access to your environments.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790758506/Cloud%20Changelog/september-30-2026-56c312.png",
  content: `- You can now restrict public access to an environment's database, or allow access only from specific IP addresses, from the new **IP Allowlist** section of the database settings. Refer to [Database](/database#restrict-database-access-by-ip-address) for more details.
- New customers now start a free trial when they complete account setup or create their first organization. The account setup button shows **Start trial** instead of **Continue** when you're eligible, and you're redirected to a **Get started** page after creating the organization instead of the projects list. Refer to [Sign Up](/sign-up) for more details.
- The subscription section of the billing settings now shows a **Trial** badge next to the plan name while your organization is on a free trial, along with a title and subtitle that show when the trial ends or when billing starts. Refer to [Manage Plans](/billing/plans#view-trial-status) for more details.
- Upgrading your plan without a payment method on file now redirects you to add a payment method first. Refer to [Manage Plans](/billing/plans#change-your-organizations-plan) for more details.
- External applications, such as MCP clients, can now request access to your environments through a consent screen, where you review the request, select the environments to grant access to, and approve or deny it. Refer to [Authorize Applications](/authorized-applications) for more details.
- A new reauthentication screen asks you to verify your identity for a commerce environment with a code from your authenticator app, or with a recovery code if you have recovery codes enabled.`,
}
