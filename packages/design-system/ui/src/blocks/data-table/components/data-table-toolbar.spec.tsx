import { render, screen } from "@testing-library/react"
import * as React from "react"
import { vi } from "vitest"

vi.mock("./data-table-filter-bar", () => ({
  DataTableFilterBar: ({
    clearAllFiltersLabel,
    children,
  }: {
    clearAllFiltersLabel?: string
    children?: React.ReactNode
  }) => (
    <div data-testid="filter-bar" data-label={clearAllFiltersLabel ?? "default"}>
      {children}
    </div>
  ),
}))

import { DataTableFilterBar } from "./data-table-filter-bar"
import { DataTableToolbar } from "./data-table-toolbar"

describe("DataTableToolbar", () => {
  it("renders its default filter bar when no explicit filter bar is provided", () => {
    render(
      <DataTableToolbar>
        <span>Toolbar content</span>
      </DataTableToolbar>
    )

    expect(screen.getByText("Toolbar content")).toBeInTheDocument()
    expect(screen.getAllByTestId("filter-bar")).toHaveLength(1)
  })

  it("uses an explicit filter bar child instead of rendering a second filter bar", () => {
    render(
      <DataTableToolbar>
        <span>Toolbar content</span>
        <DataTableFilterBar clearAllFiltersLabel="Custom clear" />
      </DataTableToolbar>
    )

    const filterBars = screen.getAllByTestId("filter-bar")

    expect(filterBars).toHaveLength(1)
    expect(filterBars[0]).toHaveAttribute("data-label", "Custom clear")
  })
})
