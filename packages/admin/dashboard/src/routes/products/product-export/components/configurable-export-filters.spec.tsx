import React from "react"
import { renderToString } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"

import { ConfigurableExportFilters } from "./configurable-export-filters"

vi.mock("@medusajs/ui", () => ({
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

vi.mock("../../../../hooks/api/views", () => ({
  useEntityColumns: () => ({ columns: [] }),
}))

vi.mock("../../../../hooks/table/use-column-filters", () => ({
  useColumnFilters: () => ({
    filters: [
      {
        id: "status",
        label: "Status",
        type: "multiselect",
        options: [
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
        ],
      },
      {
        id: "collection.id",
        label: "Collection",
        type: "multiselect",
        options: [{ label: "Summer", value: "pcol_1" }],
      },
      { id: "handle", label: "Handle", type: "string" },
    ],
    isLoading: false,
  }),
}))

vi.mock(
  "../../product-list/components/product-list-table/product-table-adapter",
  () => ({
    useProductTableAdapter: () => ({ entity: "products", queryPrefix: "p" }),
  })
)

describe("ConfigurableExportFilters", () => {
  it("should display the applied product list filters", () => {
    const params = new URLSearchParams({
      p_status: JSON.stringify(["draft", "published"]),
      "p_collection.id": JSON.stringify(["pcol_1"]),
      p_handle: JSON.stringify(""),
    })

    const html = renderToString(
      <MemoryRouter initialEntries={[`/products/export?${params.toString()}`]}>
        <ConfigurableExportFilters />
      </MemoryRouter>
    )

    expect(html).toContain("Status")
    expect(html).toContain("Draft, Published")
    expect(html).toContain("Collection")
    expect(html).toContain("Summer")
    expect(html).not.toContain("Handle")
  })
})
