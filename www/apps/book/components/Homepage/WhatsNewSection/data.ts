export const MAX_WHATS_NEW_ITEMS = 4

export type WhatsNewItem = {
  title: string
  tag: string
} & (
  | {
      comingSoon: true
      earlyAccess?: never
      date?: never
      link?: never
    }
  | {
      earlyAccess: true
      comingSoon?: never
      date?: never
      link: string
    }
  | {
      comingSoon?: false
      earlyAccess?: false
      /**
       * ISO date (`YYYY-MM-DD`) the feature shipped. Used for sorting and display.
       */
      date: string
      link: string
    }
)

export const whatsNewItems: WhatsNewItem[] = [
  {
    title: "Medusa Payments",
    tag: "Medusa Cloud",
    date: "2026-11-25",
    link: "https://docs.medusajs.com/cloud/payments",
  },
  {
    title: "Roles and permissions in Cloud",
    tag: "Medusa Cloud",
    date: "2026-11-24",
    link: "https://docs.medusajs.com/cloud/organizations/roles",
  },
  {
    title: "Medusa ChatGPT plugin",
    tag: "Medusa Cloud",
    date: "2026-11-19",
    link: "https://docs.medusajs.com/cloud/medusa-mcp/chatgpt",
  },
  {
    title: "Migrate from self-hosting to Cloud",
    tag: "Medusa Cloud",
    date: "2026-11-13",
    link: "https://docs.medusajs.com/cloud/migrate-self-hosted",
  },
]
