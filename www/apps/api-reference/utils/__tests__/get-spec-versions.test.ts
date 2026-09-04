import { describe, expect, it } from "vitest"
import { getSpecVersions } from "../get-spec-versions"

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
