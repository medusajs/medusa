type SiteConfig = {
  name: string
  url: string
  description: string
}

export const siteConfig: SiteConfig = {
  name: "Medusa UI",
  url: `${process.env.NEXT_PUBLIC_DOCS_URL}/ui`,
  description: "Primitives for building Medusa applications.",
}
