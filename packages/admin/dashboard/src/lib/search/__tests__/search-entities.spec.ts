import { describe, expect, test, vi } from "vitest"

/**
 * The registry keeps module-level state (the seeded map and the customized
 * flag), so each test loads a fresh instance.
 */
async function loadRegistry() {
  vi.resetModules()
  return await import("../search-entities")
}

describe("search entity registry", () => {
  test("seeds the built-in entities at module evaluation", async () => {
    const registry = await loadRegistry()

    expect(registry.hasSearchEntity("product")).toBe(true)
    expect(registry.hasSearchEntity("order")).toBe(true)
    expect(registry.getSearchEntityNames().length).toBeGreaterThan(0)
    expect(registry.isSearchRegistryCustomized()).toBe(false)
  })

  test("defineSearchEntity adds a custom entity and marks the registry customized", async () => {
    const registry = await loadRegistry()

    registry.defineSearchEntity("project", {
      groupLabel: "Projects",
      transform: (item) => ({
        id: item.id,
        title: item.name,
        to: `/projects/${item.id}`,
        value: `project:${item.id}`,
      }),
    })

    expect(registry.hasSearchEntity("project")).toBe(true)
    expect(registry.getSearchEntity("project")?.groupLabel).toEqual("Projects")
    expect(registry.isSearchRegistryCustomized()).toBe(true)
  })

  test("overriding a built-in entity replaces it in place", async () => {
    const registry = await loadRegistry()

    const positionBefore = registry.getSearchEntityNames().indexOf("product")

    const custom = {
      groupLabel: "Catalog",
      transform: (item: any) => ({
        id: item.id,
        title: item.title,
        to: `/catalog/${item.id}`,
        value: `product:${item.id}`,
      }),
    }

    registry.defineSearchEntity("product", custom)

    expect(registry.getSearchEntity("product")).toBe(custom)
    expect(registry.getSearchEntityNames().indexOf("product")).toEqual(
      positionBefore
    )
  })

  test("clearSearchEntities removes every registration, including the defaults", async () => {
    const registry = await loadRegistry()

    registry.clearSearchEntities()

    expect(registry.getSearchEntityNames()).toEqual([])
    expect(registry.hasSearchEntity("product")).toBe(false)
    expect(registry.isSearchRegistryCustomized()).toBe(true)
  })

  test("replacing the defaults with a custom set keeps only that set", async () => {
    const registry = await loadRegistry()

    registry.clearSearchEntities()
    registry.defineSearchEntity("organization", {
      transform: (item) => ({
        id: item.id,
        title: item.name,
        to: `/organizations/${item.id}`,
        value: `organization:${item.id}`,
      }),
    })

    expect(registry.getSearchEntityNames()).toEqual(["organization"])
  })

  test("resolveSearchEntityGroupLabel prefers groupLabel over the i18n key", async () => {
    const registry = await loadRegistry()
    const t = ((key: string) => `translated:${key}`) as any

    registry.defineSearchEntity("organization", {
      groupLabel: "Organizations",
      transform: (item) => ({
        id: item.id,
        title: item.name,
        to: `/organizations/${item.id}`,
        value: `organization:${item.id}`,
      }),
    })

    expect(registry.resolveSearchEntityGroupLabel("organization", t)).toEqual(
      "Organizations"
    )

    registry.defineSearchEntity("project", {
      groupLabel: (translate) => translate("custom.projects"),
      transform: (item) => ({
        id: item.id,
        title: item.name,
        to: `/projects/${item.id}`,
        value: `project:${item.id}`,
      }),
    })

    expect(registry.resolveSearchEntityGroupLabel("project", t)).toEqual(
      "translated:custom.projects"
    )

    // A definition without groupLabel resolves the conventional key.
    expect(registry.resolveSearchEntityGroupLabel("product", t)).toEqual(
      "translated:app.search.groups.product"
    )
  })

  test("resolveSearchEntityGroupLabel falls back to the entity name when the key is untranslated", async () => {
    const registry = await loadRegistry()

    // Mirrors i18next: returns `defaultValue` when the key has no translation.
    const t = ((key: string, options?: Record<string, unknown>) =>
      (options?.defaultValue as string) ?? key) as any

    expect(registry.resolveSearchEntityGroupLabel("organization", t)).toEqual(
      "organization"
    )
  })

  test("the built-in entities carry their Jump to shortcuts", async () => {
    const registry = await loadRegistry()

    const shortcuts = registry.getSearchEntityShortcuts()
    const order = shortcuts.find(({ entity }) => entity === "order")

    expect(order?.shortcut.to).toEqual("/orders")
    // Entities without a page of their own have no entry.
    expect(
      shortcuts.some(({ entity }) => entity === "productVariant")
    ).toBe(false)
  })

  test("a shortcut-only entry navigates but is never searched", async () => {
    const registry = await loadRegistry()

    const shortcuts = registry.getSearchEntityShortcuts()

    expect(
      shortcuts.find(({ entity }) => entity === "reservation")?.shortcut.to
    ).toEqual("/reservations")
    expect(registry.hasSearchEntity("reservation")).toBe(false)
    expect(registry.getSearchEntityNames()).not.toContain("reservation")
  })

  test("clearing the registry removes the Jump to entries with it", async () => {
    const registry = await loadRegistry()

    registry.clearSearchEntities()

    expect(registry.getSearchEntityShortcuts()).toEqual([])
  })

  test("a custom entity can declare its own Jump to entry", async () => {
    const registry = await loadRegistry()

    registry.defineSearchEntity("organization", {
      shortcut: {
        keys: { Mac: ["G", "Z"] },
        label: "Go to Organizations",
        to: "/organizations",
      },
      transform: (item) => ({
        id: item.id,
        title: item.name,
        to: `/organizations/${item.id}`,
        value: `organization:${item.id}`,
      }),
    })

    const entry = registry
      .getSearchEntityShortcuts()
      .find(({ entity }) => entity === "organization")

    expect(entry?.shortcut.to).toEqual("/organizations")

    const t = ((key: string) => `translated:${key}`) as any
    expect(
      registry.resolveSearchEntityShortcutLabel("organization", t)
    ).toEqual("Go to Organizations")
  })

  test("a shortcut without a label falls back to the entity's group label", async () => {
    const registry = await loadRegistry()

    registry.defineSearchEntity("organization", {
      groupLabel: "Organizations",
      shortcut: {
        keys: { Mac: ["G", "Z"] },
        to: "/organizations",
      },
      transform: (item) => ({
        id: item.id,
        title: item.name,
        to: `/organizations/${item.id}`,
        value: `organization:${item.id}`,
      }),
    })

    const t = ((key: string) => `translated:${key}`) as any
    expect(
      registry.resolveSearchEntityShortcutLabel("organization", t)
    ).toEqual("Organizations")
  })
})
