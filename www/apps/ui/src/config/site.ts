type SiteConfig = {
  name: string
  url: string
  ogImage: string
  description: string
}

export const siteConfig: SiteConfig = {
  name: "Medusa UI",
  url: `${process.env.NEXT_PUBLIC_DOCS_URL}/ui`,
  ogImage: `${process.env.NEXT_PUBLIC_DOCS_URL}/ui/images/medusa-og.png`,
  description: "Primitives for building Medusa applications.",
}
