// Options for `crossProjectLinksPlugin`, shared between the MDX rendering
// pipeline in `next.config.mjs` (the rendered intro page) and the Markdown
// generator in `utils/markdown/intro-to-markdown.ts` (the `.md` intro), so that
// `!docs!` / `!resources!` / `!user-guide!` links resolve identically in both.
//
// Kept as `.mjs` (plain JS) so `next.config.mjs` can import it directly.
export const crossProjectLinksOptions = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
  projectUrls: {
    docs: { url: process.env.NEXT_PUBLIC_DOCS_URL, path: "" },
    resources: { url: process.env.NEXT_PUBLIC_RESOURCES_URL },
    "user-guide": { url: process.env.NEXT_PUBLIC_USER_GUIDE_URL },
    ui: { url: process.env.NEXT_PUBLIC_UI_URL },
    cloud: { url: process.env.NEXT_PUBLIC_CLOUD_URL },
  },
  useBaseUrl:
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    !!process.env.CLOUDFLARE_ENV,
}
