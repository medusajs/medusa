"use server"

import { OpenAPI } from "types"

// Mirror the defaults used by config/index.ts (baseUrl) and next.config.mjs
// (basePath) so dev works without every env var set.
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/api"
const URL = `${baseUrl}${basePath}`

export async function getBaseSpecs(area: OpenAPI.Area) {
  try {
    const res = await fetch(`${URL}/base-specs?area=${area}`, {
      next: {
        revalidate: 3000,
        tags: [area],
      },
    }).then(async (res) => res.json())

    return res as OpenAPI.ExpandedDocument
  } catch (e) {
    console.error(e)
  }
}
