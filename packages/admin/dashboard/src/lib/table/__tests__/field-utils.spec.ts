import { HttpTypes } from "@medusajs/types"
import { describe, expect, it } from "vitest"

import { calculateRequiredFields } from "../field-utils"

const buildColumn = (
  overrides: Partial<HttpTypes.AdminColumn>
): HttpTypes.AdminColumn =>
  ({
    id: overrides.field ?? "field",
    name: "Field",
    field: overrides.field ?? "field",
    sortable: false,
    hideable: true,
    default_visible: true,
    data_type: "string",
    ...overrides,
  } as HttpTypes.AdminColumn)

describe("calculateRequiredFields", () => {
  it("requests currency_code for visible currency columns", () => {
    const columns = [
      buildColumn({ field: "display_id", render_mode: "text" }),
      buildColumn({ field: "total", render_mode: "currency" }),
    ]

    const fields = calculateRequiredFields(columns, {}).split(",")

    expect(fields).toContain("total")
    expect(fields).toContain("currency_code")
  })

  it("does not request currency_code when no currency column is visible", () => {
    const columns = [buildColumn({ field: "display_id", render_mode: "text" })]

    const fields = calculateRequiredFields(columns, {}).split(",")

    expect(fields).not.toContain("currency_code")
  })

  it("ignores currency columns that are hidden", () => {
    const columns = [
      buildColumn({ field: "display_id", render_mode: "text" }),
      buildColumn({
        field: "total",
        render_mode: "currency",
        default_visible: false,
      }),
    ]

    const fields = calculateRequiredFields(columns, {
      display_id: true,
      total: false,
    }).split(",")

    expect(fields).not.toContain("currency_code")
  })
})
