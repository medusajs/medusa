/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-02",
  title: "Build toggle default and Search usage",
  summary: "New backend environment variables now default to build-enabled, and the Search resource section is visible on the Usage page.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1788339021/Cloud%20Changelog/september-2-2026-adce8c.png",
  content: `- When adding a new environment variable on the **Backend** tab, the **Build** toggle is now enabled by default. Switching to the **Storefront** tab resets the form to the tab's default state. Refer to [Environment Variables](https://docs.medusajs.com/cloud/environments/environment-variables) for more details.
- The **Search** resource usage section is now visible on the [Usage](https://docs.medusajs.com/cloud/usage) settings page when the Search feature is enabled for your organization.`,
}
