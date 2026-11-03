/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-11-03",
  title: "CDN-based security settings",
  summary:
    "The Medusa Security settings page now applies protections to environments that route API traffic through the CDN.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1793723843/Cloud%20Changelog/november-3-2026-61b791.png",
  content: `- In a project's **Security** settings, security protections now apply to environments whose API traffic is routed through the CDN, and the environment selector controls each environment's CDN API settings. Previously, the selector controlled a general security configuration.
- The environment selector on the **Security** settings page now applies your changes when you close it. Previously, each selection applied immediately.`,
}
