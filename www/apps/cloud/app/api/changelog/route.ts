import { NextRequest, NextResponse } from "next/server"
import {
  CHANGELOG_MAX_PAGE_SIZE,
  CHANGELOG_PAGE_SIZE,
  getChangelogPage,
} from "../../../utils/changelog"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

function parseNumber(value: string | null, fallback: number): number {
  const parsed = parseInt(value ?? "", 10)

  return Number.isFinite(parsed) ? parsed : fallback
}

/**
 * A public, paginated endpoint for the Cloud changelog. Each entry's content is
 * Markdown, with links resolved to absolute URLs so external consumers can
 * follow them.
 *
 * Alongside the content, an entry carries a `summary` and an `image` — the
 * entry's banner, rendered by the `release-banner` package and hosted on
 * Cloudinary. Neither is rendered on the changelog page; both exist for
 * consumers of this endpoint, and are `null` on entries that don't have them.
 *
 * @example
 * GET /cloud/api/changelog?page=2&limit=10
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const page = parseNumber(searchParams.get("page"), 1)
  const limit = parseNumber(searchParams.get("limit"), CHANGELOG_PAGE_SIZE)

  if (page < 1 || limit < 1 || limit > CHANGELOG_MAX_PAGE_SIZE) {
    return NextResponse.json(
      {
        message: `\`page\` must be at least 1, and \`limit\` must be between 1 and ${CHANGELOG_MAX_PAGE_SIZE}.`,
      },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  const data = await getChangelogPage({
    page,
    limit,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin,
  })

  return NextResponse.json(data, {
    headers: {
      ...CORS_HEADERS,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}
