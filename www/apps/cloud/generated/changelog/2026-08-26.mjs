/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-26",
  title: "Environment Rules page and settings restructure",
  summary: "Environment settings are reorganized into a dedicated Rules page, the GitHub repository connection moved to General Settings, and log drains now show a plan upgrade prompt when not included in your plan.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1787755701/Cloud%20Changelog/august-26-2026-076dd6.png",
  content: `- Environment settings are now split into two pages: **Settings** (containing the configuration group and delete action) and a new **Rules** page (containing the linked branch and build rules). Access **Rules** from the environment's sidebar navigation. Refer to [Long-Lived Environments](https://docs.medusajs.com/cloud/environments/long-lived) for more details.
- The connected GitHub repository is now shown directly on the project's **General Settings** page in a **Repository** section, with a **Change** button to switch repositories. The separate Connections page has been removed.
- The Log Drains page now shows a plan upgrade callout with a **Change Plan** button if your organization's plan does not include the log drains entitlement. Previously, access was controlled by a feature flag.
- The **Navigation Style** option has been removed from the Profile settings page.`,
}
