import { HttpTypes } from "@medusajs/types"
import { describe, expect, it } from "vitest"

import { calculateRequiredFields } from "../field-utils"

const totalColumn: HttpTypes.AdminColumn = {
  id: "total",
  name: "Total",
  field: "total",
  sortable: false,
  hideable: true,
  default_visible: true,
  data_type: "currency",
  semantic_type: "currency",
  context: "both",
}

const currencyCodeColumn: HttpTypes.AdminColumn = {
  id: "currency_code",
  name: "Currency Code",
  field: "currency_code",
  sortable: false,
  hideable: true,
  default_visible: false,
  data_type: "string",
  semantic_type: "currency_code",
  context: "both",
}

const displayIdColumn: HttpTypes.AdminColumn = {
  id: "display_id",
  name: "Order",
  field: "display_id",
  sortable: false,
  hideable: true,
  default_visible: true,
  data_type: "number",
  context: "both",
}

describe("calculateRequiredFields", () => {
  it("includes currency_code when a visible currency column is present, even if not itself visible", () => {
    const apiColumns = [totalColumn, currencyCodeColumn, displayIdColumn]

    const fields = calculateRequiredFields(apiColumns, {
      total: true,
      display_id: true,
    })

    expect(fields.split(",")).toEqual(
      expect.arrayContaining(["total", "currency_code", "display_id"])
    )
  })

  it("does not request currency_code when the entity has no such field", () => {
    const apiColumns = [totalColumn, displayIdColumn]

    const fields = calculateRequiredFields(apiColumns, {
      total: true,
      display_id: true,
    })

    expect(fields.split(",")).not.toContain("currency_code")
  })

  it("does not request currency_code when no currency column is visible", () => {
    const apiColumns = [totalColumn, currencyCodeColumn, displayIdColumn]

    const fields = calculateRequiredFields(apiColumns, {
      display_id: true,
    })

    expect(fields.split(",")).not.toContain("currency_code")
  })
})
