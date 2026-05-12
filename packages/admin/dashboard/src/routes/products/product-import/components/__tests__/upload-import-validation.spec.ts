import { describe, expect, it } from "vitest"

import { isCsvFile } from "../upload-import-validation"

describe("isCsvFile", () => {
  it("accepts CSV files by text/csv MIME type", () => {
    expect(isCsvFile({ name: "products", type: "text/csv" })).toBe(true)
  })

  it("accepts CSV files by Windows Excel MIME type", () => {
    expect(
      isCsvFile({ name: "products", type: "application/vnd.ms-excel" })
    ).toBe(true)
  })

  it("accepts CSV files by extension when the browser reports another MIME type", () => {
    expect(
      isCsvFile({ name: "products.csv", type: "application/octet-stream" })
    ).toBe(true)
  })

  it("accepts uppercase CSV extensions", () => {
    expect(isCsvFile({ name: "products.CSV", type: "" })).toBe(true)
  })

  it("rejects non-CSV files without a supported MIME type", () => {
    expect(isCsvFile({ name: "products.xlsx", type: "application/zip" })).toBe(
      false
    )
  })
})
