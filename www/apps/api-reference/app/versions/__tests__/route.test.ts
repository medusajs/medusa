import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("@/utils/get-spec-versions", () => ({
  getSpecVersions: vi.fn(async () => [
    "2.18.0",
    "2.17.2",
    "2.17.1",
    "2.15.5",
    "2.15.2",
  ]),
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

const request = new Request("https://docs.medusajs.com/api/versions")

const getVersions = async () => {
  const response = await GET(request)

  return (await response.json()) as {
    versions: { version: string; admin_url: string; store_url: string }[]
  }
}

describe("GET /versions", () => {
  afterEach(() => {
    delete process.env.SPECS_R2_BASE_URL
  })

  it("returns the latest version and the four versions before it", async () => {
    const { versions } = await getVersions()

    expect(versions.map(({ version }) => version)).toEqual([
      "2.19.0",
      "2.18.0",
      "2.17.2",
      "2.17.1",
      "2.15.5",
    ])
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
})
