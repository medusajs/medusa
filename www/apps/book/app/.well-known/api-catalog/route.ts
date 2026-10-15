import { NextResponse } from "next/server"
import { config } from "../../../config"

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
            href: `${baseUrl}/learn/introduction/build-with-llms-ai/docs-mcp-server`,
            type: "text/html",
          },
        ],
      },
    ],
  }
}

export function GET() {
  return NextResponse.json(getCatalog(), { headers })
}

export function HEAD() {
  return new NextResponse(null, { headers })
}
