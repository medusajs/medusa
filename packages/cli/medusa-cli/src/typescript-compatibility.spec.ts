import { assertTypeScriptCompatibility } from "./typescript-compatibility"

describe("assertTypeScriptCompatibility", () => {
  it("accepts the TypeScript version supported by ts-node", () => {
    expect(() =>
      assertTypeScriptCompatibility({ version: "5.9.3", versionMajorMinor: "5.9" })
    ).not.toThrow()
  })

  it("fails before ts-node registration for TypeScript 7", () => {
    expect(() =>
      assertTypeScriptCompatibility({ version: "7.0.2", versionMajorMinor: "7.0" })
    ).toThrow(
      "TypeScript 7.0.2 is not supported by Medusa's runtime config loader. Use TypeScript 5.x instead."
    )
  })
})
