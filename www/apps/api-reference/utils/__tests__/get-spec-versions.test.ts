import { afterEach, describe, expect, it } from "vitest"
import { getSpecVersions, specVersionExists } from "../get-spec-versions"

describe("getSpecVersions", () => {
  it("reads the local versions directory sorted from newest to oldest", async () => {
    const versions = await getSpecVersions()

    expect(versions.length).toBeGreaterThan(0)
    expect(versions).toEqual(
      [...versions].sort((versionA, versionB) => {
        const [majorA, minorA, patchA] = versionA.split(".").map(Number)
        const [majorB, minorB, patchB] = versionB.split(".").map(Number)

        return majorB - majorA || minorB - minorA || patchB - patchA
      })
    )
  })
})

describe("specVersionExists", () => {
  afterEach(() => {
    delete process.env.SPECS_R2_BASE_URL
  })

  it("falls back to the file system when the bucket holds no specs", async () => {
    process.env.SPECS_R2_BASE_URL = "https://assets.medusajs.com/api-reference"
    const [latestArchived] = await getSpecVersions()

    expect(await specVersionExists(latestArchived)).toBe(true)
  })

  it("resolves an archived version from the local versions directory", async () => {
    const [latestArchived] = await getSpecVersions()

    expect(await specVersionExists(latestArchived)).toBe(true)
  })

  it("rejects unknown and malformed versions", async () => {
    expect(await specVersionExists("9999.0.0")).toBe(false)
    expect(await specVersionExists("../../package.json")).toBe(false)
    expect(await specVersionExists("")).toBe(false)
  })
})
