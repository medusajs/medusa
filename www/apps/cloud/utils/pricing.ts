import { sanityClient } from "./sanity-client"
import {
  Block,
  FeatureTableFields,
  HeroPricingFields,
  PricingQueryResult,
} from "./types"

type PricingButtonLink =
  HeroPricingFields["options"][number]["buttons"][number]["link"]

type PricingData = {
  heroPricing: HeroPricingFields
  featureTable: FeatureTableFields
}

export const featureLinks: Record<string, string> = {
  orders: "/resources/commerce-modules/order",
  products: "/resources/commerce-modules/product",
  "sales channels": "/resources/commerce-modules/sales-channels",
  "regions & currencies": "/resources/commerce-modules/region",
  "github integration":
    "/cloud/projects#2-create-project-from-an-existing-application",
  "push-to-deploy flow": "/cloud/deployments#how-are-deployments-created",
  previews: "/cloud/environments/preview",
  "auto configuration:":
    "/cloud/projects#prerequisite-medusa-application-configurations",
  postgres: "/cloud/database",
  redis: "/cloud/redis",
  s3: "/cloud/s3",
  "environment variables": "/cloud/environments/environment-variables",
  "data import/export": "/cloud/database#importexport-database-dumps",
  "advanced logs": "/cloud/logs",
  "unlimited long-lived environments": "/cloud/environments/long-lived",
  "long-lived environments (lle)": "/cloud/environments/long-lived",
  "preview environments (pe)": "/cloud/environments/preview",
  "cloud seats": "/cloud/organizations#view-organization-members",
  "object storage": "/cloud/s3",
  "database storage": "/cloud/database",
  "key value store": "/cloud/redis",
  "admin dashboard users": "/user-guide/settings/users",
  "unlimited deployments": "/cloud/deployments",
  "traffic load balancing": "/cloud/comparison#auto-scaling",
  "log retention": "/cloud/logs",
  "real-time 24/7 monitoring": "/cloud/comparison#high-availability",
  "zero-downtime deployment": "/cloud/deployments",
  backups: "/cloud/database#cloud-database-backups",
  "performance tuning": "/cloud/comparison#performance",
  "sla-backed uptime": "/cloud/comparison#high-availability",
  support: "/cloud/comparison#support",
  "medusa cache": "/cloud/cache",
  "hosting of monorepos": "/cloud/projects/prerequisites#monorepo-setup",
  "custom domains": "/cloud/storefront#storefront-custom-domain",
  "storefront previews": "/cloud/environments/preview",
  "mcp server": "/learn/introduction/build-with-llms-ai/mcp-server",
  "development agent": "/cloud/assistant",
  "medusa cloud cli": "/cloud/cli",
  "webhook events": "/cloud/webhooks/events",
  "log drains": "/cloud/projects/log-drains",
  "use with starters": "/cloud/projects#1-create-project-from-a-starter",
  "custom backend domain": "/cloud/environments/custom-domains",
  "pre configured caching": "/cloud/cache",
  "integrated querying": "/learn/fundamentals/query#cache-query-results",
  "auto invalidation":
    "/resources/infrastructure-modules/caching/concepts#automatic-cache-invalidation",
  "full-text search": "/resources/infrastructure-modules/search",
  "typo-tolerant": "/cloud/search/settings#typo-tolerance",
  "faceting and filtering":
    "/resources/infrastructure-modules/search/index-definitions/modifiers",
  "auto index sync": "/resources/infrastructure-modules/search/reindexing",
  "instantsearch-compatible": "/resources/instantsearch",
  "search analytics": "/cloud/search/analytics",
  "semantic and hybrid search": "/cloud/search/semantic-search",
  "managed embeddings": "/cloud/search/semantic-search#index-the-text-to-embed",
  "built-in emails": "/cloud/emails",
  "delivery insights": "/cloud/emails#monitor-email-sending-activity-on-cloud",
  "open tracking": "/cloud/emails#monitor-email-sending-activity-on-cloud",
  "bounce details": "/cloud/emails#monitor-email-sending-activity-on-cloud",
}

/**
 * Whether the pricing data can be loaded. The pricing data isn't available in
 * the CI and preview environments.
 */
export function isPricingAvailable(): boolean {
  return (
    process.env.NEXT_PUBLIC_ENV !== "CI" &&
    process.env.NEXT_PUBLIC_ENV !== "preview" &&
    process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview"
  )
}

/**
 * Loads the plans and the plans' features from Sanity, or `null` when either
 * is missing.
 */
export async function loadPricingData(): Promise<PricingData | null> {
  const data: PricingQueryResult = await sanityClient.fetch(
    `*[
      (_type == "featureTable" && _id == "9cb4e359-786a-4cdb-9334-88ad4ce44f05") ||
      (_type == "heroPricing" && _id == "8d8f33e1-7f18-4b2f-8686-5bc57da697db")
    ]{
      _type,
      _id,
      // For featureTable
      "featureTableFields": select(
        _type == "featureTable" => {
          columnHeaders,
          featureSections,
          links
        }
      ),
      // For heroPricing
      "heroPricingFields": select(
        _type == "heroPricing" => {
          options
        }
      )
    }`
  )

  const heroPricing = data.find(
    (item) => item._type === "heroPricing"
  )?.heroPricingFields
  const featureTable = data.find(
    (item) => item._type === "featureTable"
  )?.featureTableFields

  if (!heroPricing || !featureTable) {
    return null
  }

  return { heroPricing, featureTable }
}

export function getPricingButtonUrl(link: PricingButtonLink): string {
  return (
    link.url ||
    (link.path?.startsWith("https://")
      ? link.path
      : `https://medusajs.com${link.path}`)
  )
}

/**
 * Returns the text lines of a feature table cell, with known feature names
 * linked to their documentation pages. Tooltips are returned as empty lines
 * unless `includeTooltips` is enabled.
 */
export function getBlockLines(
  blocks: Block[],
  baseUrl: string,
  { includeTooltips = false }: { includeTooltips?: boolean } = {}
): string[] {
  if (!blocks?.length) {
    return []
  }

  return blocks.flatMap((block) => {
    if (block._type !== "block" || !block.children) {
      return []
    }

    return block.children.map((child) => {
      if (child._type !== "span") {
        return includeTooltips ? `_${child.text.trim()}_` : ""
      }

      const text = child.text.trim()
      const link = featureLinks[text.toLowerCase()]

      return link ? `[${text}](${baseUrl}${link})` : text
    })
  })
}

const escapeTableCell = (value: string) =>
  value.replaceAll("|", "\\|").replaceAll("\n", " ")

const toTableRow = (cells: string[]) =>
  `| ${cells.map(escapeTableCell).join(" | ")} |`

function getPlansMarkdown(heroPricing: HeroPricingFields): string {
  return heroPricing.options
    .map((option) => {
      const parts = [`### ${option.title}`, `**${option.subtitle}**`]

      if (option.description) {
        parts.push(option.description)
      }

      if (option.pre_features) {
        parts.push(option.pre_features)
      }

      if (option.features.length) {
        parts.push(option.features.map((feature) => `- ${feature}`).join("\n"))
      }

      if (option.buttons.length) {
        parts.push(
          option.buttons
            .map(
              (button) =>
                `[${button.link.label}](${getPricingButtonUrl(button.link)})`
            )
            .join(" · ")
        )
      }

      return parts.join("\n\n")
    })
    .join("\n\n")
}

function getFeaturesMarkdown(
  featureTable: FeatureTableFields,
  baseUrl: string
): string {
  const { columnHeaders, featureSections } = featureTable
  const tableHeader = [
    toTableRow(["Feature", ...columnHeaders]),
    toTableRow(["Feature", ...columnHeaders].map(() => "---")),
  ]

  return featureSections
    .map((section) => {
      const rows = section.rows.map((row) =>
        toTableRow(
          Array.from({ length: columnHeaders.length + 1 }, (_, index) => {
            const blocks = row[`column${index + 1}` as keyof typeof row]

            return getBlockLines(blocks as Block[], baseUrl, {
              includeTooltips: true,
            })
              .join("<br />")
              .replace(/(<br \/>)+$/, "")
          })
        )
      )

      return [
        `### ${section.header.subtitle}`,
        section.header.title,
        [...tableHeader, ...rows].join("\n"),
      ]
        .filter(Boolean)
        .join("\n\n")
    })
    .join("\n\n")
}

/**
 * Builds the Markdown version of the pricing page's content, used by the
 * `md-content` route to replace the `<PricingContent />` component with the
 * plans and features it renders. Returns an empty string when the pricing
 * data isn't available.
 */
export async function getPricingMarkdown(baseUrl: string): Promise<string> {
  if (!isPricingAvailable()) {
    return ""
  }

  const data = await loadPricingData()

  if (!data) {
    return ""
  }

  return [
    "## Cloud Plans",
    getPlansMarkdown(data.heroPricing),
    "---",
    "## Plans Features",
    getFeaturesMarkdown(data.featureTable, baseUrl),
  ].join("\n\n")
}
