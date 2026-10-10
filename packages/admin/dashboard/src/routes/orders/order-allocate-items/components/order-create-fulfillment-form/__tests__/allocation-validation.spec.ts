import { describe, expect, it } from "vitest"
import { getInvalidAllocationKeys } from "../allocation-validation"
import { buildLineItem } from "./fixtures"

describe("getInvalidAllocationKeys", () => {
  it("keeps an invalid item flagged when another item is corrected", () => {
    const items = [buildLineItem("a"), buildLineItem("b")]
    const quantities = { "a-iitem_a": "4", "b-iitem_b": "4" }

    expect(getInvalidAllocationKeys(items, "sloc_1", quantities)).toEqual([
      "a-iitem_a",
      "b-iitem_b",
    ])

    quantities["b-iitem_b"] = "1"

    expect(getInvalidAllocationKeys(items, "sloc_1", quantities)).toEqual([
      "a-iitem_a",
    ])
  })

  it("treats zero availability as a limit while allowing a zero allocation", () => {
    const items = [
      buildLineItem("a", [{ id: "iitem_a", available: 0, required: 1 }]),
    ]

    expect(
      getInvalidAllocationKeys(items, "sloc_1", { "a-iitem_a": "1" })
    ).toEqual(["a-iitem_a"])
    expect(
      getInvalidAllocationKeys(items, "sloc_1", { "a-iitem_a": 0 })
    ).toEqual([])
  })

  it("validates every kit component, ignoring the root's line item units", () => {
    const items = [
      buildLineItem("kit", [
        { id: "iitem_a", available: 5, required: 2 },
        { id: "iitem_b", available: 1, required: 1 },
      ]),
    ]

    expect(
      getInvalidAllocationKeys(items, "sloc_1", {
        "kit-": "2",
        "kit-iitem_a": 4,
        "kit-iitem_b": 2,
      })
    ).toEqual(["kit-iitem_b"])
  })

  it.each([-1, "-1", "invalid", NaN, Infinity])(
    "rejects invalid quantity %s",
    (quantity) => {
      expect(
        getInvalidAllocationKeys([buildLineItem("a")], "sloc_1", {
          "a-iitem_a": quantity,
        })
      ).toEqual(["a-iitem_a"])
    }
  )

  it("allows blank fields to be handled by the unallocated-items check", () => {
    expect(
      getInvalidAllocationKeys([buildLineItem("a")], "sloc_1", {
        "a-iitem_a": "",
      })
    ).toEqual([])
  })

  it("uses the selected location and blocks positive quantities at missing levels", () => {
    const items = [buildLineItem("a")]
    const quantities = { "a-iitem_a": "4" }

    expect(getInvalidAllocationKeys(items, "sloc_1", quantities)).toEqual([
      "a-iitem_a",
    ])
    expect(getInvalidAllocationKeys(items, "sloc_2", quantities)).toEqual([])
    expect(getInvalidAllocationKeys(items, "sloc_missing", quantities)).toEqual(
      ["a-iitem_a"]
    )
    expect(getInvalidAllocationKeys(items, "", quantities)).toEqual([])
  })

  it("allows fractional quantities up to the available stock", () => {
    const items = [
      buildLineItem("a", [{ id: "iitem_a", available: 0.3, required: 1 }]),
    ]

    expect(
      getInvalidAllocationKeys(items, "sloc_1", { "a-iitem_a": 0.3 })
    ).toEqual([])
    expect(
      getInvalidAllocationKeys(items, "sloc_1", { "a-iitem_a": 0.4 })
    ).toEqual(["a-iitem_a"])
  })
})
