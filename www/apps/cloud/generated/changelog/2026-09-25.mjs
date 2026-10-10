/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-25",
  title: "Usage credits and searchable branch picker",
  summary: "The Usage page lists your organization's credits and shows credited usage in its charts, and environment forms get a searchable branch picker.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790346310/Cloud%20Changelog/september-25-2026-513282.png",
  content: `- The Usage page now has a **Credits** section listing your organization's credits with their type, status, balance, and expiration, along with a **Show expired** toggle to include expired credits. Refer to [Usage](https://docs.medusajs.com/cloud/usage) for more details.
- The flex charges chart on the Usage page now shows usage covered by credits as a stacked yellow segment, and per-metric charts show a yellow dashed line for the combined plan and credits allowance. When you view a single billing cycle, the usage table also breaks down each allowance into the portions from your plan and from credits. Refer to [Usage](https://docs.medusajs.com/cloud/usage) for more details.
- The branch field in the **Create Environment** form is now a searchable list of your repository's branches. Branches already linked to another environment show that environment's name and can't be selected. Previously, the form showed an error banner after you picked a branch in use. Refer to [Long-Lived Environments](https://docs.medusajs.com/cloud/environments/long-lived) for more details.
- The **Edit Linked Branch** form in an environment's settings now uses the same searchable branch list instead of a text input, so you select a branch rather than type its name. Refer to [Long-Lived Environments](https://docs.medusajs.com/cloud/environments/long-lived) for more details.`,
}
