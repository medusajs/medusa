/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-30",
  title: "Free trials and database IP allowlist",
  summary: "New organizations start with a free trial, organizations whose free trial ended can add a payment method to keep their plan, and you can restrict database access by IP address.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790761823/Cloud%20Changelog/september-30-2026-34fe7c.png",
  content: `- New customers now start a free trial when they complete account setup or create their first organization. You no longer enter payment details during sign-up, and you're redirected to a **Get started** page after creating the organization instead of the projects list. A banner in the dashboard shows how many days are left in your trial, with a link to add your billing details. Refer to [Sign Up](/sign-up) for more details.
- The subscription section of the billing settings now shows a **Trial** badge next to the plan name while your organization is on a free trial, along with a title and subtitle that show when the trial ends or when billing starts. Refer to [Manage Plans](/billing/plans#view-trial-status) for more details.
- Upgrading your plan without a payment method on file now redirects you to add a payment method first. Refer to [Manage Plans](/billing/plans#change-your-organizations-plan) for more details.
- When your organization's free trial ends, the billing settings now let you keep your plan. If your organization has no payment method, the section shows an **Add Payment Method** button that takes you to add one. Otherwise, it shows a **Keep [Plan Name]** button. Refer to [Manage Plans](/billing/plans#resume-your-organizations-plan) for more details.
- You can now restrict public access to an environment's database, or allow access only from specific IP addresses, from the new **IP Allowlist** section of the database settings. Refer to [Database](/database#restrict-database-access-by-ip-address) for more details.`,
}
