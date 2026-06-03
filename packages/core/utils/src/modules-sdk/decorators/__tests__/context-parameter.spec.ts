import { MedusaContext } from "../context-parameter"

describe("MedusaContext", () => {
  it("keeps inherited context indexes when adding child metadata", () => {
    const parentPrototype = {}
    MedusaContext()(parentPrototype, "createProductOptions", 1)

    const childPrototype = Object.create(parentPrototype)
    MedusaContext()(childPrototype, "updateProductOptionValues", 2)

    expect(MedusaContext.getIndex(childPrototype, "createProductOptions")).toBe(
      1
    )
    expect(
      MedusaContext.getIndex(childPrototype, "updateProductOptionValues")
    ).toBe(2)
  })

  it("keeps overridden context indexes on the child prototype", () => {
    const parentPrototype = {}
    MedusaContext()(parentPrototype, "updateProductOptionValues", 1)

    const childPrototype = Object.create(parentPrototype)
    MedusaContext()(childPrototype, "updateProductOptionValues", 2)

    expect(
      Object.prototype.hasOwnProperty.call(
        childPrototype,
        "MedusaContextIndex_"
      )
    ).toBe(true)
    expect(
      MedusaContext.getIndex(parentPrototype, "updateProductOptionValues")
    ).toBe(1)
    expect(
      MedusaContext.getIndex(childPrototype, "updateProductOptionValues")
    ).toBe(2)
  })
})
