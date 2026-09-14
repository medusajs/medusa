import { afterEach, describe, expect, it, vi } from "vitest"

const archivedVersions = Array.from(
  { length: 20 },
  (_, index) => `2.${18 - index}.0`
)

vi.mock("@/utils/get-spec-versions", () => ({
  getCachedSpecVersions: vi.fn(async () => archivedVersions),
  specVersionExists: vi.fn(async (version: string) =>
    archivedVersions.includes(version)
  ),
}))

vi.mock("docs-utils/global-config", () => ({
  globalConfig: {
    version: {
      number: "2.19",
      releaseUrl: "https://github.com/medusajs/medusa/releases/tag/v2.19.0",
      releaseDate: "2026-08-13T13:09:55Z",
    },
  },
}))

import { GET } from "../route"
import {
  getCachedSpecVersions,
  specVersionExists,
} from "@/utils/get-spec-versions"

const getResponse = (query?: string) =>
  GET(
    new Request(
      `https://docs.medusajs.com/api/versions${query ? `?${query}` : ""}`
    )
  )

const getVersions = async (query?: string) => {
  const response = await GET(
    new Request(
      `https://docs.medusajs.com/api/versions${query ? `?${query}` : ""}`
    )
  )

  return (await response.json()) as {
    versions: { version: string; admin_url: string; store_url: string }[]
    count: number
    limit: number
    offset: number
  }
}

describe("GET /versions", () => {
  afterEach(() => {
    delete process.env.SPECS_R2_BASE_URL
    vi.clearAllMocks()
  })

  it("returns the first 15 versions, led by the latest one", async () => {
    const { versions, count, limit, offset } = await getVersions()

    expect(versions).toHaveLength(15)
    expect(versions.map(({ version }) => version)).toEqual([
      "2.19.0",
      ...archivedVersions.slice(0, 14),
    ])
    expect({ count, limit, offset }).toEqual({
      count: 21,
      limit: 15,
      offset: 0,
    })
  })

  it("returns the versions at the requested offset and limit", async () => {
    const { versions, offset, limit } = await getVersions("offset=15&limit=5")

    expect({ offset, limit }).toEqual({ offset: 15, limit: 5 })
    expect(versions.map(({ version }) => version)).toEqual(
      archivedVersions.slice(14, 19)
    )
  })

  it("includes the latest version only at an offset of 0", async () => {
    const { versions } = await getVersions("offset=1&limit=2")

    expect(versions.map(({ version }) => version)).toEqual(
      archivedVersions.slice(0, 2)
    )
  })

  it("clamps invalid and out-of-range limits and offsets", async () => {
    expect(await getVersions("limit=0")).toMatchObject({ limit: 1 })
    expect(await getVersions("limit=500")).toMatchObject({ limit: 100 })
    expect(await getVersions("limit=nope")).toMatchObject({ limit: 15 })
    expect(await getVersions("offset=-5")).toMatchObject({ offset: 0 })
    expect(await getVersions("offset=999")).toMatchObject({
      offset: 21,
      versions: [],
    })
  })

  it("returns R2 JSON URLs when R2 is configured", async () => {
    process.env.SPECS_R2_BASE_URL = "https://assets.medusajs.com/api-reference"

    const { versions } = await getVersions()

    expect(versions[0]).toEqual({
      version: "2.19.0",
      admin_url:
        "https://assets.medusajs.com/api-reference/specs/admin/openapi.full.json",
      store_url:
        "https://assets.medusajs.com/api-reference/specs/store/openapi.full.json",
    })
    expect(versions[1]).toEqual({
      version: "2.18.0",
      admin_url:
        "https://assets.medusajs.com/api-reference/specs/versions/2.18.0/admin/openapi.full.json",
      store_url:
        "https://assets.medusajs.com/api-reference/specs/versions/2.18.0/store/openapi.full.json",
    })
  })

  it("falls back to the download route when R2 isn't configured", async () => {
    const { versions } = await getVersions()

    expect(versions[0].admin_url).toBe(
      "https://docs.medusajs.com/api/download/admin"
    )
    expect(versions[1].store_url).toBe(
      "https://docs.medusajs.com/api/download/store?version=2.18.0"
    )
  })

  describe("version filter", () => {
    it("returns only the requested archived version", async () => {
      const { versions, count, limit, offset } =
        await getVersions("version=2.15.0")

      expect(versions.map(({ version }) => version)).toEqual(["2.15.0"])
      expect({ count, limit, offset }).toEqual({
        count: 1,
        limit: 1,
        offset: 0,
      })
    })

    it("returns the latest version without looking it up", async () => {
      const { versions } = await getVersions("version=2.19.0")

      expect(versions[0].admin_url).toBe(
        "https://docs.medusajs.com/api/download/admin"
      )
      expect(specVersionExists).not.toHaveBeenCalled()
    })

    it("never retrieves the full listing", async () => {
      await getVersions("version=2.15.0")

      expect(getCachedSpecVersions).not.toHaveBeenCalled()
    })

    it("responds with a 404 for an unknown version", async () => {
      const response = await getResponse("version=9.9.9")

      expect(response.status).toBe(404)
      expect(await response.json()).toEqual({
        error: {
          status: 404,
          name: "NotFound",
          message: 'No OpenAPI specs found for version "9.9.9"',
        },
      })
    })
  })
})
