/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-20",
  title: "Audit logs and invite email verification",
  summary: "Organizations can review recorded actions in an Audit Logs settings page, and invite pages help users who signed in with the wrong email.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795190555/Cloud%20Changelog/november-20-2026-9dc094.png",
  content: `- Organizations with audit logs enabled have a new **Audit Logs** settings page that lists the actions members and access keys performed, with their actor, action, resource, and outcome. You can expand a row to view the request's details, and filter the logs by text, project, outcome, time range, actor, or resource. Refer to [Audit Logs](/organizations/audit-logs) for more details.
- When you try to accept an organization invitation with an account whose email address doesn't match the invitation, the invite page now shows a dedicated error with a form to send yourself an email verification link. Previously, the page showed a generic error. Refer to [Accept an Invitation](/organizations#accept-an-invitation) for more details.
- When you open an invitation link while signed in, you now stay on the invite page until Cloud confirms the invitation. Previously, the dashboard redirected you away before confirming it.`,
}
