import { defineLink, DefineLinkSymbol } from "../define-link"

describe("defineLink", () => {
  const originalMedusaModule = (global as any).MedusaModule
  let registered: Array<(modules: any[]) => any>

  beforeEach(() => {
    registered = []
    ;(global as any).MedusaModule = {
      setCustomLink: (cb: (modules: any[]) => any) => {
        registered.push(cb)
      },
    }
  })

  afterEach(() => {
    ;(global as any).MedusaModule = originalMedusaModule
  })

  const fakeLinkable = (serviceName: string, key: string, alias: string) => ({
    serviceName,
    field: alias,
    linkable: key,
    primaryKey: "id",
  })

  const buildModules = () => [
    {
      serviceName: "store",
      primaryKeys: ["id"],
      alias: [{ name: "store", entity: "Store" }],
      linkableKeys: { store_id: "Store" },
    },
    {
      serviceName: "region",
      primaryKeys: ["id"],
      alias: [{ name: "region", entity: "Region" }],
      linkableKeys: { region_id: "Region" },
    },
  ]

  it("exposes the DefineLink marker symbol before registration", () => {
    const link = defineLink(
      fakeLinkable("store", "store_id", "store"),
      fakeLinkable("region", "region_id", "region")
    )

    // The marker symbol is always readable — only the lazy properties throw.
    expect((link as any)[DefineLinkSymbol]).toBe(true)
  })

  it("throws a descriptive error when a lazy property is read before registration", () => {
    const link = defineLink(
      fakeLinkable("store", "store_id", "store"),
      fakeLinkable("region", "region_id", "region")
    )

    expect(() => link.entryPoint).toThrow(/not available until the app bootstraps/)
    expect(() => link.serviceName).toThrow(/entryPoint|serviceName/)
    expect(() => link.entity as any).toThrow(/not available until the app bootstraps/)
  })

  it("populates the properties after the register callback runs", () => {
    const link = defineLink(
      fakeLinkable("store", "store_id", "store"),
      fakeLinkable("region", "region_id", "region")
    )

    // Simulate MedusaModule.bootstrapAll() invoking the registered callback.
    expect(registered).toHaveLength(1)
    registered[0](buildModules())

    expect(link.entryPoint).toBe("store_region")
    expect(link.serviceName.length).toBeGreaterThan(0)
    expect(link.entity!.length).toBeGreaterThan(0)
  })
})
