import { NextRequest, NextResponse } from "next/server"
import { config } from "../../../config"
import { trackAgentRequest } from "../../../utils/track-agent-request"

const CATALOG_PATH = "/.well-known/api-catalog"

const headers = {
  "content-type": `application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"`,
  "cache-control": "public, max-age=3600, must-revalidate",
  link: `<${CATALOG_PATH}>; rel="api-catalog"`,
}

const getCatalog = () => {
  const { baseUrl } = config

  return {
    linkset: [
      {
        anchor: `${baseUrl}${CATALOG_PATH}`,
        item: [
          { href: `${baseUrl}/api/store` },
          { href: `${baseUrl}/api/admin` },
          { href: `${baseUrl}/mcp` },
          { href: `${baseUrl}/agents/ask` },
        ],
      },
      ...(["store", "admin"] as const).map((area) => ({
        anchor: `${baseUrl}/api/${area}`,
        "service-desc": [
          {
            href: `${baseUrl}/api/download/${area}`,
            type: "application/yaml",
          },
        ],
        "service-doc": [
          {
            href: `${baseUrl}/api/${area}`,
            type: "text/html",
          },
        ],
      })),
      {
        anchor: `${baseUrl}/mcp`,
        "service-doc": [
          {
            href: `${baseUrl}/cloud/ai-toolkit/docs-mcp`,
            type: "text/html",
          },
        ],
      },
      {
        anchor: `${baseUrl}/agents/ask`,
        "service-doc": [
          {
            href: `${baseUrl}/cloud/ai-toolkit/ai-friendly-docs#docs-retrieval-endpoint`,
            type: "text/html",
          },
        ],
      },
    ],
  }
}

export function GET(req: NextRequest) {
  trackAgentRequest(req, "well_known_requested", { resource: "api-catalog" })
  return NextResponse.json(getCatalog(), { headers })
}

export function HEAD() {
  return new NextResponse(null, { headers })
}
