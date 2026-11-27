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
    title: "Audit logs in Cloud",
    tag: "Medusa Cloud",
    date: "2026-11-26",
    link: "https://docs.medusajs.com/cloud/organizations/audit-logs",
  },
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
    link: "https://docs.medusajs.com/cloud/ai-toolkit/medusa-mcp/chatgpt",
  },
  {
    title: "Docs SKILL.md and retrieval endpoint",
    tag: "Docs",
    date: "2026-11-19",
    link: "https://docs.medusajs.com/cloud/ai-toolkit/ai-friendly-docs",
  },
  {
    title: "Migrate from self-hosting to Cloud",
    tag: "Medusa Cloud",
    date: "2026-11-13",
    link: "https://docs.medusajs.com/cloud/migrate-self-hosted",
  },
  {
    title: "RBAC & SSO",
    tag: "Enterprise",
    date: "2026-11-04",
    link: "https://docs.medusajs.com/cloud/enterprise",
  },
  {
    title: "Medusa MCP",
    tag: "Medusa Cloud",
    date: "2026-10-20",
    link: "https://docs.medusajs.com/cloud/ai-toolkit/medusa-mcp",
  },
  {
    title: "Medusa Security",
    date: "2026-11-04",
    link: "https://docs.medusajs.com/cloud/security",
    tag: "Medusa Cloud",
  },
  {
    title: "Medusa Search",
    tag: "Medusa Cloud",
    date: "2026-09-22",
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
    link: "https://docs.medusajs.com/cloud/ai-toolkit/assistant",
    tag: "Medusa Cloud",
  },
]
