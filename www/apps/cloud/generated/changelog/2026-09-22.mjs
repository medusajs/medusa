/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-22",
  title: "Medusa Search",
  summary:
    "Medusa Search is now available on Cloud, serving full-text, semantic, and hybrid search for your project's indexes, with analytics in the dashboard.",
  content: `- Medusa Search is now available as a managed search service for Cloud projects. It stores your search indexes outside of your database and serves full-text, semantic, and hybrid search queries for them. Refer to [Medusa Search](https://docs.medusajs.com/cloud/search) for more details.
- An environment's sidebar now has a **Search** item, showing the analytics of each index in that environment: how many searches it served, how many came back empty, the terms customers searched for the most, and how fast the index responded. Refer to [Search Analytics](https://docs.medusajs.com/cloud/search/analytics) for more details.
- Item counts and index sizes are available on all plans. The remaining analytics, including the chart, the search speed cards, and the term tables, are available on the Scale and Enterprise plans.`,
}
