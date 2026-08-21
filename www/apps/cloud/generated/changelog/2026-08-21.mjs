/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-21",
  title: "Global sidebar, repository settings, and search usage",
  summary: "The global sidebar is now the only navigation style, GitHub repository settings moved to the main project settings page, and search is now tracked as a billable usage metric.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1787325340/Cloud%20Changelog/august-21-2026-8af1f3.png",
  content: `- The Cloud dashboard now uses the global sidebar layout exclusively. The option to switch between navigation styles has been removed, and the **Navigation Style** section is no longer available in Profile settings.
- Log drain provider cards now show a documentation link next to the provider name. Clicking it opens the provider's setup documentation in a new tab. The same link also appears next to the **Provider** field when creating or editing a log drain. Refer to [Log Drains](https://docs.medusajs.com/cloud/projects/log-drains) for more details.
- The GitHub repository connection for a project is now shown directly in the main project settings page (**Settings** > **General**) under a "Repository" section. You can view the connected repository name and switch it using the **Change** button. Refer to [Projects](/projects) for more details.
- Search is now tracked as a billable usage metric on the [Usage](/usage) page, appearing in the usage chart, summary table, and as its own metric chart in the "Billable metrics" section.`,
}
