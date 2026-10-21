import path from "path"
import vm from "vm"
import { createPathKeys, RUNTIME_PATH_KEYS } from "../paths"

describe("bundle path keys", () => {
  const toKey = createPathKeys({
    appRoot: "/build/.medusa/server",
    nodeModulesRoot: "/build/node_modules",
  })

  it("keys files relative to the app and node_modules", () => {
    expect(toKey("/build/.medusa/server/src/api/route.js")).toBe(
      "app:src/api/route.js"
    )
    expect(toKey("/build/node_modules/@medusajs/medusa/dist/index.js")).toBe(
      "nm:@medusajs/medusa/dist/index.js"
    )
    expect(toKey("/elsewhere/linked/index.js")).toBe(
      "/elsewhere/linked/index.js"
    )
  })

  it("doesn't key paths that only share a prefix", () => {
    expect(toKey("/build/.medusa/server-old/index.js")).toBe(
      "/build/.medusa/server-old/index.js"
    )
  })

  it("resolves keys in the deployed location at runtime", () => {
    const deployed = "/final/.medusa/server"
    const context: Record<string, any> = { require, __dirname: deployed }
    vm.runInNewContext(RUNTIME_PATH_KEYS, context)
    const keyToPath = context.__medusaKeyToPath

    expect(keyToPath(toKey("/build/.medusa/server/src/api/route.js"))).toBe(
      path.join(deployed, "src/api/route.js")
    )
    // Without a node_modules above it, the bundle's own is used
    expect(
      keyToPath(toKey("/build/node_modules/@medusajs/medusa/dist/index.js"))
    ).toBe(path.join(deployed, "node_modules/@medusajs/medusa/dist/index.js"))
    expect(keyToPath("/elsewhere/linked/index.js")).toBe(
      "/elsewhere/linked/index.js"
    )
  })
})
