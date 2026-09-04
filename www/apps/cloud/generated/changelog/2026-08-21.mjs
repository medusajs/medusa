/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-08-21",
  title: "Global sidebar only and log drain provider docs",
  summary: "The global sidebar is now the only navigation style, and log drain provider cards show direct links to provider setup documentation.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1787304288/Cloud%20Changelog/august-21-2026-c0cc3e.png",
  content: `- The Cloud dashboard now uses the global sidebar layout exclusively. The option to switch between navigation styles has been removed, and the **Navigation Style** section is no longer available in Profile settings.
- Log drain provider cards now show a documentation link next to the provider name. Clicking it opens the provider's setup documentation in a new tab. The same link also appears next to the **Provider** field when creating or editing a log drain. Refer to [Log Drains](https://docs.medusajs.com/cloud/projects/log-drains) for more details.`,
}
