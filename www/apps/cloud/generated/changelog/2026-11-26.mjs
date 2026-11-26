/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-26",
  title: "Storefront edge cache and audit log improvements",
  summary:
    "Storefront environments get an edge cache toggle, audit logs gain filtering and error handling updates, and Payments warns about outdated Medusa versions.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1795702497/Cloud%20Changelog/november-26-2026-b4af99.png",
  content: `- An environment's **Payments** page now shows a warning when its active deployment uses a Medusa version older than v2.23.0, the minimum version that payments require. Refer to [Set up Medusa Payments in Environments](/payments/environments#set-up-payments-in-an-environment) for more details.
- The details of an audit log entry in your organization's settings now show the entry's **Action** at the top, before the actor's information.
- An environment's settings now include an **Edge Cache** section for environments that have a storefront, where you can enable or disable edge caching for the storefront. Refer to [Storefront Edge Cache](/storefront#storefront-edge-cache) for more details.
- The project filter on the **Audit Logs** page now includes deleted projects, so you can filter logs by projects that no longer exist.
- The **Audit Logs** page now shows an error message when the logs fail to load. Previously, the table showed nothing.
- The **Audit Logs** search now ignores leading and trailing spaces in your search term, and the pagination's total row count no longer exceeds the number of logs you can retrieve.`,
}
