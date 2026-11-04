/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-04",
  title: "Medusa Security",
  summary:
    "Medusa Security protects projects with managed rulesets, DDoS protection, and bot detection.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1793793154/Cloud%20Changelog/04-11-2026-0bd968.png",
  content: `- Projects now have a **Security** page in the dashboard to manage [Medusa Security](/security), a set of security features that Cloud applies to traffic reaching your projects. It includes the Medusa Ruleset, the Basic Protection Ruleset, DDoS Protection, and Bot Detection.
- Medusa Security is enabled automatically for new projects. For existing projects, you can enable it now from the project's Security settings, and Medusa will enable it automatically for all existing projects in the second half of November 2026. Refer to [Enable Medusa Security](/security#enable-medusa-security) for more details.
- You can choose which environments or environment types each security feature applies to. Refer to [Medusa Security](/security#configurable-security-features-per-environment) for more details.
- The **Security** page also has an **Analytics** section that charts allowed requests and requests blocked by each security feature, with summary cards and a paginated list of recent security events. You can filter the data by environment, target, and time range. Refer to [Security Analytics](/security/analytics) for more details.`,
}
