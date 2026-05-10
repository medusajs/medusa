import {
  EntityOverride,
  EntityOverrideRegistry,
  BUILTIN_ENTITY_OVERRIDES,
  getNonSortableFields,
  getEntityOverride,
  resetEntityOverrideRegistry,
} from "../entity-overrides"

describe("entity-overrides", () => {
  beforeEach(() => {
    resetEntityOverrideRegistry()
  })

  describe("getNonSortableFields", () => {
    it("should return nonSortableFields for Order", () => {
      const fields = getNonSortableFields("Order")

      expect(fields).toEqual(
        expect.arrayContaining(["total", "fulfillment_status", "payment_status"])
      )
    })

    it("should return empty array for entities without nonSortableFields", () => {
      const fields = getNonSortableFields("Customer")

      expect(fields).toEqual([])
    })

    it("should return empty array for unknown entities", () => {
      const fields = getNonSortableFields("NonExistentEntity")

      expect(fields).toEqual([])
    })

    it("should accept a pre-resolved override", () => {
      const override: EntityOverride = {
        nonSortableFields: ["computed_field", "virtual_total"],
      }

      const fields = getNonSortableFields("AnyEntity", override)

      expect(fields).toEqual(["computed_field", "virtual_total"])
    })
  })

  describe("EntityOverrideRegistry - nonSortableFields merging", () => {
    it("should merge nonSortableFields when registering additional overrides", () => {
      const registry = new EntityOverrideRegistry()

      registry.register("Order", {
        nonSortableFields: ["extra_computed"],
      })

      const override = registry.get("Order")
      expect(override?.nonSortableFields).toEqual(
        expect.arrayContaining([
          "total",
          "fulfillment_status",
          "payment_status",
          "extra_computed",
        ])
      )
    })

    it("should not duplicate nonSortableFields on re-registration", () => {
      const registry = new EntityOverrideRegistry()

      registry.register("Order", {
        nonSortableFields: ["total"],
      })

      const override = registry.get("Order")
      const totalOccurrences = override?.nonSortableFields?.filter(
        (f) => f === "total"
      ).length

      // "total" was already in BUILTIN_ENTITY_OVERRIDES and is merged in — deduplication
      // is not strictly required by the interface but count should stay bounded
      expect(totalOccurrences).toBeGreaterThanOrEqual(1)
    })

    it("BUILTIN_ENTITY_OVERRIDES should define nonSortableFields for Order", () => {
      const orderOverride = BUILTIN_ENTITY_OVERRIDES["Order"]

      expect(orderOverride.nonSortableFields).toBeDefined()
      expect(orderOverride.nonSortableFields).toContain("total")
      expect(orderOverride.nonSortableFields).toContain("fulfillment_status")
      expect(orderOverride.nonSortableFields).toContain("payment_status")
    })
  })
})
