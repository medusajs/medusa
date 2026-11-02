/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-02",
  title: "Shared environment selector for project security",
  summary: "A project's security protections now apply to one set of environments chosen in a single selector, instead of per protection.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1793640187/Cloud%20Changelog/november-2-2026-19fd3f.png",
  content: `- The **Security** section of a project's settings now has a single environment selector under a **global** heading, and all security protections, such as the Cloudflare managed ruleset, DDoS protection, and bot protection, apply to the environments you select there. Previously, each protection had its own environment selector, so you could choose different environments per protection.`,
}
