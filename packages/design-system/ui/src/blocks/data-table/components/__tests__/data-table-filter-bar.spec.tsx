import { render, screen, waitFor } from "@testing-library/react"
import * as React from "react"

import { DataTable } from "@/blocks/data-table"
import { useDataTable } from "@/blocks/data-table/use-data-table"
import { TooltipProvider } from "@/components/tooltip"

interface Row {
  id: string
  name: string
}

const columns = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }: { row: { original: Row } }) => row.original.name,
  },
]

const data: Row[] = [
  { id: "1", name: "Widget" },
  { id: "2", name: "Gadget" },
]

const filters = [
  {
    id: "status",
    label: "Status",
    type: "select" as const,
    options: [
      { label: "Published", value: "published" },
      { label: "Draft", value: "draft" },
    ],
  },
]

/**
 * A toolbar that renders an explicit `DataTable.FilterBar` as a direct child,
 * which is the documented public pattern for consumers that need the filter
 * bar in a custom position.
 */
const ToolbarWithExplicitFilterBar = ({
  filteringState,
  alwaysShowFilterBar = true,
}: {
  filteringState: Record<string, unknown>
  alwaysShowFilterBar?: boolean
}) => {
  const instance = useDataTable<Row>({
    data,
    columns,
    filters,
    rowCount: data.length,
    getRowId: (row) => row.id,
    filtering: {
      state: filteringState as never,
      onFilteringChange: () => {},
    },
  })

  return (
    <DataTable instance={instance}>
      <DataTable.Toolbar
        alwaysShowFilterBar={alwaysShowFilterBar}
        filterBarContent={null}
      >
        <div>toolbar content</div>
        <DataTable.FilterBar />
      </DataTable.Toolbar>
      <DataTable.Table />
    </DataTable>
  )
}

const wrap = (ui: React.ReactElement) =>
  render(<TooltipProvider>{ui}</TooltipProvider>)

describe("DataTable.FilterBar", () => {
  it("renders a single filter bar when an explicit FilterBar is rendered inside the Toolbar", async () => {
    wrap(
      <ToolbarWithExplicitFilterBar
        filteringState={{ status: { value: "published", operator: "_eq" } }}
      />
    )

    await waitFor(() => {
      expect(screen.getByText("toolbar content")).toBeInTheDocument()
    })

    // The active filter must be represented by exactly one chip. Before the fix
    // the toolbar's implicit bar and the explicit bar both rendered the same
    // chip, because both read the same filtering state from the table context.
    await waitFor(() => {
      expect(screen.getAllByText(/status/i).length).toBe(1)
    })

    // The clear-all affordance must also appear exactly once.
    await waitFor(() => {
      expect(screen.getAllByText("Clear all").length).toBe(1)
    })
  })

  it("renders the filter bar only once when the explicit FilterBar is nested in a wrapper", async () => {
    const NestedToolbar = () => {
      const instance = useDataTable<Row>({
        data,
        columns,
        filters,
        rowCount: data.length,
        getRowId: (row) => row.id,
        filtering: {
          state: { status: { value: "published", operator: "_eq" } } as never,
          onFilteringChange: () => {},
        },
      })

      return (
        <DataTable instance={instance}>
          <DataTable.Toolbar alwaysShowFilterBar filterBarContent={null}>
            <div>toolbar content</div>
            <div className="flex-1">
              <DataTable.FilterBar />
            </div>
          </DataTable.Toolbar>
          <DataTable.Table />
        </DataTable>
      )
    }

    wrap(<NestedToolbar />)

    await waitFor(() => {
      expect(screen.getByText("toolbar content")).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getAllByText("Clear all").length).toBe(1)
    })
  })

  it("renders the filter bar only once when no filter is active", () => {
    wrap(
      <ToolbarWithExplicitFilterBar
        filteringState={{}}
        alwaysShowFilterBar={false}
      />
    )

    // With no active filters and no reserved space, neither bar should render a
    // filter row at all.
    expect(screen.queryByText("Clear all")).not.toBeInTheDocument()
    expect(screen.queryByText(/status/i)).not.toBeInTheDocument()
  })
})
