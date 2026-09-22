/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-09-22",
  title: "Medusa Search, provisioning failures, and database access",
  summary:
    "Medusa Search is available on Cloud, domain pages show provisioning failure alerts, and the database page gains a read-access toggle and credential rotation.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790092768/Cloud%20Changelog/september-22-2026-c01dbe.png",
  content: `- Medusa Search is now available as a managed search service for Cloud projects. It stores your search indexes outside of your database and serves full-text, semantic, and hybrid search queries for them. Refer to [Medusa Search](https://docs.medusajs.com/cloud/search) for more details.
- An environment's sidebar now has a **Search** item, showing the analytics of each index in that environment: how many searches it served, how many came back empty, the terms customers searched for the most, and how fast the index responded. Refer to [Search Analytics](https://docs.medusajs.com/cloud/search/analytics) for more details.
- Item counts and index sizes are available on all plans. The remaining analytics, including the chart, the search speed cards, and the term tables, are available on the Scale and Enterprise plans.
- Domain detail pages for custom backend/storefront domains and organization email sender domains now show a dedicated alert when provisioning has failed, instead of the DNS configuration instructions. The **Re-verify** and **Restart verification** buttons are hidden in this state. Refer to [Environment Custom Domains](https://docs.medusajs.com/cloud/environments/custom-domains) and [Medusa Emails](https://docs.medusajs.com/cloud/emails) for more details.
- The **Database read-only connection string** section on the Database page is now always visible and includes a toggle to enable or disable read access. Previously, the section was only shown when a read-replica URL was already configured. Refer to [Database](https://docs.medusajs.com/cloud/database) for more details.
- Both the read and write database access sections on the Database page now include a **Rotate credentials** button. Clicking it opens a confirmation dialog before rotating the connection string credentials. The rotate button for write access is only available to project owners.
- The log filter time-range selector now enforces a maximum allowed query duration. If a custom date range exceeds the maximum span, a warning alert appears inside the date picker and the range is not applied until corrected. Refer to [Logs](https://docs.medusajs.com/cloud/logs) for more details.`,
}
