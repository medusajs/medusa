import { toManifestJoinerConfig } from "../manifest-joiner-config"

describe("toManifestJoinerConfig", () => {
  it("leaves the database URL out of what the manifest stores", () => {
    const joinerConfig = {
      serviceName: "product",
      primaryKeys: ["id"],
      alias: [{ name: ["product", "products"], entity: "Product" }],
      databaseClientUrl: "postgres://user:secret@db.internal:5432/app",
    }

    const stored = toManifestJoinerConfig(joinerConfig)

    expect(stored).toEqual({
      serviceName: "product",
      primaryKeys: ["id"],
      alias: [{ name: ["product", "products"], entity: "Product" }],
    })
    expect(JSON.stringify(stored)).not.toContain("secret")
    // The module's own config is left as it was
    expect(joinerConfig.databaseClientUrl).toContain("secret")
  })

  it("keeps a missing joiner config as null", () => {
    expect(toManifestJoinerConfig(null)).toBeNull()
    expect(toManifestJoinerConfig(undefined)).toBeNull()
  })
})
