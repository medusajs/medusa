/** @type {import("../../utils/changelog").ChangelogEntry} */
export default {
  date: "2026-10-02",
  title: "Domain proxy check and regional free trials",
  summary: "Custom domain DNS pages show the proxy check only when needed, and new sign-ups get a free trial only in regions where it's available.",
  image: "https://res.cloudinary.com/dza7lstvk/image/upload/v1790956237/Cloud%20Changelog/october-2-2026-4a4e6f.png",
  content: `- The DNS configuration detail page of a custom domain now shows the **Proxy** check section only when the domain requires a proxy check. Previously, the section always appeared alongside the **SSL** check section. Refer to [Custom Domains](/environments/custom-domains) for more details.
- Medusa now starts a free trial for a new organization only when the free trial is available in your region, both when you sign up and when you create your first organization. Previously, every new customer without an existing organization or invite started on a free trial. Refer to [Sign Up for Cloud](/sign-up) for more details.`,
}
