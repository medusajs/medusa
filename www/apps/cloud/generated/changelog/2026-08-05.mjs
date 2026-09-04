/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-05",
  title: "Grouped organization settings and separate domain verification",
  image:
    "https://res.cloudinary.com/dza7lstvk/image/upload/v1786952781/Cloud%20Changelog/aug-5.png",
  summary:
    "The sidebar groups organization settings into collapsible sections, and a domain's DNS records page splits checking records from restarting verification.",
  content: `- The sidebar navigation now groups your organization's settings into collapsible sections for the organization, your account, billing, emails, and payments, so you can reach a setting without leaving the page you're on. If the organization has no projects yet, the sidebar shows the ways to create your first project instead of an empty list.
- A domain's DNS records page now shows **Check records** and **Restart verification** as two separate buttons, and you can restart the verification at any time. Previously, one button checked the records, and it only offered to restart the verification after the verification failed. Refer to [Environment Custom Domains](https://docs.medusajs.com/cloud/environments/custom-domains) for more details.`,
}
