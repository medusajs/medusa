/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-13",
  title: "Environment type and specs badges",
  summary: "Environments show their type and infrastructure plan at a glance, Production can be renamed, and members lists show all pending invitations.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1794585746/Cloud%20Changelog/november-13-2026-1d6777.png",
  content: `- The organization's members list now shows pending invitations for all roles, giving you a complete view of outstanding invitations. Previously, the list only showed pending invitations for the admin role. Refer to [Organizations](/organizations#view-organization-members) for more details.
- Environment cards in the project's dashboard and the header of the environment's dashboard now show badges for the environment's type, such as Production or Long-lived, and the plan whose infrastructure specs it uses. Refer to [Long-Lived Environments](/environments/long-lived#find-environment-details) for more details.
- You can now rename the Production environment from its **Settings** page. Previously, the name field and save button were disabled for Production environments. Refer to [Long-Lived Environments](/environments/long-lived#rename-an-environment) for more details.
- The Production environment's **Settings** page now has a **Configuration** section that shows the plan whose infrastructure specs the environment uses, with a link to the project's settings to change them. Refer to [Long-Lived Environments](/environments/long-lived#view-production-environments-specs) for more details.`,
}
