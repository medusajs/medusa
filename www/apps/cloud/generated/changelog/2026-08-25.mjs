/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-25",
  title: "Environment Rules page and Settings reorganization",
  summary: "A new Rules tab in environment dashboards shows the linked Git branch and build rules, and the Settings page now focuses on configuration and deletion.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1787650105/Cloud%20Changelog/august-25-2026-2e7698.png",
  content: `- A new **Rules** tab is available in each environment's dashboard. It shows the Git branch the environment deploys from and the build rules configured for the environment. Refer to [Environment Rules](https://docs.medusajs.com/cloud/environments/rules) for more details.
- On production and long-lived environments, you can now edit the linked Git branch directly from the **Rules** tab by clicking the edit icon next to the branch name. Refer to [Environment Rules](https://docs.medusajs.com/cloud/environments/rules) for more details.
- The environment **Settings** page has been reorganized. The linked branch and build rules sections have moved to the new **Rules** tab. The Settings page now shows the configuration group (for long-lived environments) and the delete action.
- The project filter on the [Usage settings](https://docs.medusajs.com/cloud/usage) page now loads all projects instead of a paginated subset, so every project appears in the dropdown.`,
}
