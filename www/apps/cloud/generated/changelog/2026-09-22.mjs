/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-22",
  title: "Search Analytics with vector and freetext breakdown",
  summary: "The Search Analytics section now separates freetext and vector search volume and adds a dedicated Vector Terms panel.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790074491/Cloud%20Changelog/september-22-2026-4dc00a.png",
  content: `- The Search Volume chart in the Search Analytics section now displays two separate series — freetext searches (blue) and vector searches (green) — so you can distinguish between text-based and vector-based search activity over time. Refer to [Search Analytics](/search-analytics) for more details.
- A new **Vector Terms** panel has been added to the Search Analytics section, showing the top search terms associated with vector-based searches.
- The **Top Search Terms** and **No-Hit Terms** panels now always display their term tables with an empty-state message when there are no terms, instead of showing a special placeholder when all searches were vector-based.`,
}
