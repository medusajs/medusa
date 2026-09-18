export const MAX_WHATS_NEW_ITEMS = 4

export type WhatsNewItem = {
  title: string
  tag: string
} & (
  | {
      comingSoon: true
      date?: never
      link?: never
    }
  | {
      comingSoon?: false
      /**
       * ISO date (`YYYY-MM-DD`) the feature shipped. Used for sorting and display.
       */
      date: string
      link: string
    }
)

export const whatsNewItems: WhatsNewItem[] = [
  {
    title: "Medusa Search",
    tag: "Medusa Cloud",
    date: "2026-09-17",
    link: "https://docs.medusajs.com/cloud/search",
  },
  {
    title: "Exported Admin Components",
    date: "2026-09-11",
    link: "https://docs.medusajs.com/resources/admin-components",
    tag: "Medusa OS",
  },
  {
    title: "Log Drains",
    date: "2026-08-21",
    link: "https://docs.medusajs.com/cloud/projects/log-drains",
    tag: "Medusa Cloud",
  },
  {
    title: "AI Assistant in Dashboard",
    date: "2026-08-19",
    link: "https://docs.medusajs.com/cloud/assistant",
    tag: "Medusa Cloud",
  },
]
