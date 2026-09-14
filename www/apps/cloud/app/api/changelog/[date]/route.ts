import { NextRequest, NextResponse } from "next/server"
import { getChangelogEntry } from "../../../../utils/changelog"
import {
  PUBLIC_API_CACHE_CONTROL,
  PUBLIC_API_CORS_HEADERS,
} from "../../../../utils/public-api"

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

type Params = {
  params: Promise<{ date: string }>
}

/**
 * Returns a single Cloud changelog entry by its date, in the same shape as the
 * entries of `/cloud/api/changelog`.
 *
 * @example
 * GET /cloud/api/changelog/2026-08-10
 */
export async function GET(req: NextRequest, { params }: Params) {
  const { date } = await params

  if (!DATE_REGEX.test(date)) {
    return NextResponse.json(
      { message: "The date must be in `YYYY-MM-DD` format." },
      { status: 400, headers: PUBLIC_API_CORS_HEADERS }
    )
  }

  const entry = await getChangelogEntry(
    date,
    process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin
  )

  if (!entry) {
    return NextResponse.json(
      { message: `No changelog entry was found for ${date}.` },
      { status: 404, headers: PUBLIC_API_CORS_HEADERS }
    )
  }

  return NextResponse.json(entry, {
    headers: {
      ...PUBLIC_API_CORS_HEADERS,
      "Cache-Control": PUBLIC_API_CACHE_CONTROL,
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: PUBLIC_API_CORS_HEADERS,
  })
}
