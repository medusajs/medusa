import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { fetchAssetResponse } from "../../../utils/fetch-asset-response"
import { trackAgentRequest } from "../../../utils/track-agent-request"

const ALLOWED_FILES = new Set(["llms.txt", "llms-full.txt", "SKILL.md"])

type Params = {
  params: Promise<{ file: string }>
}

export async function GET(req: NextRequest, { params }: Params) {
  const { file } = await params

  if (!ALLOWED_FILES.has(file)) {
    return notFound()
  }

  const origin = new URL(req.url).origin
  const assetRes = await fetchAssetResponse(`${origin}/${file}`)

  let body: BodyInit | null = assetRes?.body ?? null

  if (!assetRes) {
    try {
      const { promises: fs } = await import("fs")
      body = await fs.readFile(
        path.join(process.cwd(), "public", file),
        "utf-8"
      )
    } catch {
      return notFound()
    }
  }

  trackAgentRequest(
    req,
    file === "SKILL.md" ? "docs_skill_requested" : "llms_txt_requested",
    {
      $current_url: `${process.env.NEXT_PUBLIC_BASE_URL || origin}/${file}`,
      file,
    }
  )

  return new NextResponse(body, {
    headers: {
      "content-type": `${
        file.endsWith(".md") ? "text/markdown" : "text/plain"
      }; charset=utf-8`,
      "cache-control": "public, max-age=3600, must-revalidate",
    },
    status: 200,
  })
}
