/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-29",
  title: "Pending preview environment states",
  summary:
    "You can now open a pending preview environment's dashboard from the previews table, where a dedicated card shows a Provision button.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1793264881/Cloud%20Changelog/october-29-2026-baa789.png",
  content: `- On a pending preview environment's dashboard, its card now shows a dedicated placeholder with a **Provision** button. The button provisions the environment, or takes you to increase your plan's limit if your organization has reached its concurrent previews limit. Refer to [Preview Environments](https://docs.medusajs.com/cloud/environments/preview#pending-preview-environments) for more details.
- You can now click a pending environment's row in the project's previews table to open its dashboard. Previously, clicking the row did nothing. Refer to [Preview Environments](https://docs.medusajs.com/cloud/environments/preview#pending-preview-environments) for more details.
- A pending environment's dashboard now hides its domain links and the Deployments section, and disables the **Trigger Build** button until you provision the environment.`,
}
