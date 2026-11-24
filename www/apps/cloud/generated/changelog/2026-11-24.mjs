/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-24",
  title: "Audit logs opt-in and email verification",
  summary: "Organizations can turn audit logs on or off as a paid feature, and the dashboard now guides users through verifying their email address.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795530331/Cloud%20Changelog/november-24-2026-218969.png",
  content: `- The Audit Logs settings page now lets you turn audit logs on or off. If your plan doesn't include audit logs, the page links to the change-plan page instead. Refer to [Audit Logs](/organizations/audit-logs) for more details.
- The audit logs table's actor column now shows the name and email of users, or the title of access keys, as recorded in each log entry. Refer to [Audit Logs](/organizations/audit-logs#view-audit-logs) for more details.
- The Add-ons settings page now has a **Paid Features** section where you can view the monthly cost of features with a recurring fee and enable or disable them after confirming the cost. Refer to [Billing](/billing#enable-or-disable-paid-features) for more details.
- The Usage page now includes an **Audit Logs** metric in its chart, table, and per-metric charts. Refer to [Usage](/usage#usage-metrics-definitions) for more details.
- The DNS configuration detail page of a custom domain now has a **Cloudflare Proxy** toggle. When enabled, the proxy check is skipped and its DNS records are hidden, since Cloudflare handles the proxying. Refer to [Environment Custom Domains](/environments/custom-domains#domains-proxied-through-cloudflare) for more details.
- The Profile page now shows a warning when your email address isn't verified, with an action to send a verification link. Refer to [Manage User Account](/user#verify-your-email-address) for more details.
- Adding email and password as a sign-in method with an unverified email address now sends a verification link to that address. Previously, the form showed a generic error. Refer to [Manage User Account](/user#manage-sign-in-methods) for more details.
- The OAuth authorization flow now shows a page that lets you send a verification link when your email address isn't verified, then continue the flow. Refer to [Medusa MCP](/medusa-mcp#approve-the-connection) for more details.
- You can no longer change your own role from the members table. The **Change role** action is now disabled for your own row, as well as for owners. Refer to [Organizations](/organizations#change-a-members-role) for more details.`,
}
