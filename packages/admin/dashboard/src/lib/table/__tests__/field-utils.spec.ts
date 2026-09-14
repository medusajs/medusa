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

const stockedQuantityColumn: HttpTypes.AdminColumn = {
  id: "stocked_quantity",
  name: "Stocked quantity",
  field: "stocked_quantity",
  sortable: false,
  hideable: true,
  default_visible: true,
  data_type: "number",
  render_mode: "quantity",
  context: "both",
}

const reservationQuantityColumn: HttpTypes.AdminColumn = {
  ...stockedQuantityColumn,
  id: "quantity",
  field: "quantity",
  render_mode: "quantity",
  metadata: { unit_of_measure_path: "inventory_item.unit_of_measure" },
}

describe("calculateRequiredFields", () => {
  it("includes the unit of measure a visible quantity column renders with", () => {
    const fields = calculateRequiredFields(
      [stockedQuantityColumn, displayIdColumn],
      { stocked_quantity: true }
    )

    expect(fields.split(",")).toEqual(
      expect.arrayContaining(["stocked_quantity", "unit_of_measure"])
    )
  })

  it("includes the unit of measure a quantity column points at", () => {
    const fields = calculateRequiredFields([reservationQuantityColumn], {
      quantity: true,
    })

    expect(fields.split(",")).toContain("inventory_item.unit_of_measure")
  })

  it("does not request a unit of measure when no quantity column is visible", () => {
    const fields = calculateRequiredFields(
      [stockedQuantityColumn, displayIdColumn],
      { display_id: true }
    )

    expect(fields.split(",")).not.toContain("unit_of_measure")
  })

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
