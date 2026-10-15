import { NextResponse } from "next/server"
import { config } from "../../../../config"

const headers = {
  "content-type": "application/json",
  "cache-control": "public, max-age=3600, must-revalidate",
  "access-control-allow-origin": "*",
}

const NAME = "com.medusajs/docs"
const VERSION = "1.0.0"

const getServerCard = () => {
  const endpoint = `${config.baseUrl}/mcp`

  return {
    $schema:
      "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
    name: NAME,
    version: VERSION,
    title: "Medusa Docs MCP Server",
    description:
      "Search the Medusa documentation and get step-by-step implementation guides for building with Medusa.",
    websiteUrl: `${config.baseUrl}/learn/introduction/build-with-llms-ai/docs-mcp-server`,
    remotes: [{ type: "streamable-http", url: endpoint }],
    // Legacy SEP-1649 fields still checked by agent-readiness scanners
    serverInfo: { name: NAME, version: VERSION },
    transport: { type: "streamable-http", endpoint },
    capabilities: { tools: {} },
  }
}

export function GET() {
  return NextResponse.json(getServerCard(), { headers })
}

export function HEAD() {
  return new NextResponse(null, { headers })
}
