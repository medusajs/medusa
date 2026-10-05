/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-02",
  title: "Domain proxy check",
  summary: "Custom domain DNS pages show the proxy check only when needed.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790956237/Cloud%20Changelog/october-2-2026-4a4e6f.png",
  content: `- The DNS configuration detail page of a custom domain now shows the **Proxy** check section only when the domain requires a proxy check. Previously, the section always appeared alongside the **SSL** check section. Refer to [Custom Domains](/environments/custom-domains) for more details.`,
}
