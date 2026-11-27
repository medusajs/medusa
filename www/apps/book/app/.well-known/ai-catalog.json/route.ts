import { NextRequest, NextResponse } from "next/server"
import { config } from "../../../config"
import { trackAgentRequest } from "../../../utils/track-agent-request"

const headers = {
  "content-type": "application/json",
  "cache-control": "public, max-age=3600, must-revalidate",
  "access-control-allow-origin": "*",
}

const getCatalog = () => {
  const { baseUrl } = config
  const { hostname } = new URL(baseUrl)
  const urn = (namespace: string, name: string) =>
    `urn:air:${hostname}:${namespace}:${name}`

  return {
    specVersion: "1.0",
    host: {
      displayName: "Medusa",
      identifier: `did:web:${hostname}`,
      documentationUrl: baseUrl,
    },
    entries: [
      {
        identifier: urn("mcp", "docs"),
        displayName: "Medusa Docs MCP Server",
        description:
          "Search the Medusa documentation and get step-by-step implementation guides for building with Medusa.",
        type: "application/mcp-server-card+json",
        url: `${baseUrl}/.well-known/mcp/server-card.json`,
        representativeQueries: [
          "how do I create a custom module in Medusa",
          "how to add a payment provider to a Medusa store",
          "explain Medusa workflows and compensation steps",
          "how to customize the Medusa admin dashboard",
        ],
      },
      {
        identifier: urn("skills", "medusa-docs"),
        displayName: "Medusa Docs Skill",
        description:
          "How to navigate the Medusa documentation, where to find what, and which tools agents can use.",
        type: "text/markdown",
        url: `${baseUrl}/SKILL.md`,
        representativeQueries: [
          "where are the Medusa docs for a topic",
          "which tools can agents use to read the Medusa docs",
        ],
      },
      {
        identifier: urn("search", "docs"),
        displayName: "Medusa Docs Retrieval Endpoint",
        description:
          "Search the Medusa documentation and get the most relevant content for a query. Pass the query in the `q` parameter.",
        type: "application/json",
        url: `${baseUrl}/agents/ask`,
        representativeQueries: [
          "search the Medusa documentation",
          "find Medusa docs about workflows",
        ],
      },
      {
        identifier: urn("skills", "medusa-agent-skills"),
        displayName: "Medusa Agent Skills",
        description:
          "Agent skills for building Medusa backends, storefronts, and admin customizations.",
        type: "application/agent-skills+json",
        url: `${baseUrl}/.well-known/agent-skills/index.json`,
        representativeQueries: [
          "skill for building Medusa backend features",
          "best practices for building a Medusa storefront",
          "how to build Medusa admin widgets and pages",
        ],
      },
      {
        identifier: urn("openapi", "store"),
        displayName: "Medusa Store API",
        description:
          "OpenAPI specification of the Medusa Store API used by storefronts.",
        type: "application/vnd.oai.openapi",
        url: `${baseUrl}/api/download/store`,
        representativeQueries: [
          "Medusa API to add an item to the cart",
          "list products from a Medusa store",
          "complete checkout and place an order with Medusa",
        ],
      },
      {
        identifier: urn("openapi", "admin"),
        displayName: "Medusa Admin API",
        description:
          "OpenAPI specification of the Medusa Admin API used to manage a store.",
        type: "application/vnd.oai.openapi",
        url: `${baseUrl}/api/download/admin`,
        representativeQueries: [
          "Medusa admin API to create a product",
          "fulfill or refund an order in Medusa",
          "manage inventory and stock locations via the Medusa admin API",
        ],
      },
      {
        identifier: urn("catalog", "api-catalog"),
        displayName: "Medusa API Catalog",
        description:
          "RFC 9727 linkset of Medusa's APIs and their descriptions.",
        type: "application/linkset+json",
        url: `${baseUrl}/.well-known/api-catalog`,
        representativeQueries: [
          "list all Medusa APIs and their OpenAPI specs",
          "where is the Medusa API documentation",
        ],
      },
    ],
  }
}

export function GET(req: NextRequest) {
  trackAgentRequest(req, "well_known_requested", { resource: "ai-catalog" })
  return NextResponse.json(getCatalog(), { headers })
}

export function HEAD() {
  return new NextResponse(null, { headers })
}
