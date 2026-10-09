/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-09",
  title: "Security Analytics for projects",
  summary: "Projects get a page that charts allowed and blocked requests per security ruleset and lets you look up a blocked request by its Ray ID.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1791557044/Cloud%20Changelog/october-9-2026-3953cd.png",
  content: `- You can now open a **Security Analytics** page from a project's **Security** section. It shows a chart of allowed requests and requests blocked by each security ruleset, with summary cards and a paginated list of recent security events that you can expand for details. You can filter the data by environment, target, and time range. This page is available to select organizations only. Refer to [Security Analytics](/projects/security-analytics) for more details.
- The Security Analytics page also has a **Ray ID Lookup** section, where you can enter a Cloudflare Ray ID to view why a request was blocked or challenged, including the matched rule, the action taken, and the request's details. Refer to [Security Analytics](/projects/security-analytics#look-up-a-request-by-ray-id) for more details.`,
}
