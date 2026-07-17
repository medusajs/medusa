import { describe, expect, it } from "vitest"
import { getInitialFulfillmentLocationId } from "./utils"

describe("getInitialFulfillmentLocationId", () => {
  it("returns the location id from a single-location fulfillment set", () => {
    expect(getInitialFulfillmentLocationId({ id: "sloc_single" })).toBe(
      "sloc_single"
    )
  })

  it("returns the first location id from a multi-location fulfillment set", () => {
    expect(
      getInitialFulfillmentLocationId([
        { id: "sloc_first" },
        { id: "sloc_second" },
      ])
    ).toBe("sloc_first")
  })

  it("preserves a manually selected location", () => {
    expect(
      getInitialFulfillmentLocationId(
        [{ id: "sloc_first" }, { id: "sloc_second" }],
        "sloc_second"
      )
    ).toBe("sloc_second")
  })

  it("returns undefined when the fulfillment set has no locations", () => {
    expect(getInitialFulfillmentLocationId([])).toBeUndefined()
  })
})
