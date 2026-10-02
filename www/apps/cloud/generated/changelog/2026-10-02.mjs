/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-02",
  title: "Conditional proxy check on domain DNS page",
  summary: "The DNS detail page of a custom domain now shows the proxy check section only for domains that require it.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790940651/Cloud%20Changelog/october-2-2026-4db6fb.png",
  content: `- The DNS configuration detail page of a custom domain now shows the **Proxy** check section only when the domain requires a proxy check. Previously, the section always appeared alongside the **SSL** check section. Refer to [Custom Domains](/environments/custom-domains) for more details.`,
}
