// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest"

vi.mock("../lib/client", () => ({
  sdk: {
    admin: {
      views: {},
    },
  },
  backendUrl: "http://localhost:9000",
}))

import React from "react"
import { renderHook, act, waitFor } from "@testing-library/react"
import { MemoryRouter, useSearchParams } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTableConfiguration } from "../hooks/table/use-table-configuration"

// Mock the feature flag to enable view_configurations
vi.mock("../providers/feature-flag-provider", () => ({
  useFeatureFlag: (flag: string) => flag === "view_configurations",
}))

// Create mock column data and active view data
const mockApiColumns = [
  { field: "id", name: "ID", sortable: true, filter: { enabled: true } },
  { field: "created_at", name: "Created At", data_type: "date", sortable: true, filter: { enabled: true } },
]

// Controllable mock for useEntityColumns
let mockColumnsLoading = true
let mockColumnsData: any = undefined

vi.mock("../hooks/api/views", () => ({
  useEntityColumns: () => ({
    columns: mockColumnsData,
    isLoading: mockColumnsLoading,
  }),
}))

// Controllable mock for useViewConfigurations
let mockActiveView: any = null
vi.mock("../hooks/use-view-configurations", () => ({
  useViewConfigurations: () => ({
    activeView: mockActiveView,
    createView: { mutateAsync: vi.fn() },
  }),
  useViewConfiguration: () => ({
    updateView: { mutateAsync: vi.fn() },
  }),
}))

// Mock relationship filter options hook
vi.mock("../hooks/table/use-relationship-filter-options", () => ({
  useRelationshipFilterOptions: () => ({
    options: {},
    isLoading: false,
  }),
  getRelationshipFilterConfigs: () => [],
}))

describe("Bug C Reproduction — URL table state disappears after reload or column loading", () => {
  it("demonstrates that active saved view / initial column loading wipes URL filter and sorting parameters", async () => {
    // 1. User has a copied URL or reloads a page with table state:
    // e.g. /orders?o_created_at=%7B%22%24gte%22%3A%222026-10-01T18%3A30%3A00.000Z%22%7D&o_order=-created_at
    const initialUrl = "/orders?o_created_at=%7B%22%24gte%22%3A%222026-10-01T18%3A30%3A00.000Z%22%7D&o_order=-created_at"

    mockColumnsLoading = true
    mockColumnsData = undefined
    mockActiveView = null // No saved view, or default system view with no filters

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    let searchParamsRef: URLSearchParams | null = null

    const wrapper = ({ children }: { children: React.ReactNode }) => {
      const SearchParamsTracker = () => {
        const [params] = useSearchParams()
        searchParamsRef = params
        return null
      }
      return (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[initialUrl]}>
            <SearchParamsTracker />
            {children}
          </MemoryRouter>
        </QueryClientProvider>
      )
    }

    const { rerender } = renderHook(
      () =>
        useTableConfiguration({
          entity: "orders",
          queryPrefix: "o",
        }),
      { wrapper }
    )

    // Initial render while columns are loading
    expect(searchParamsRef!.get("o_order")).toBe("-created_at")
    expect(searchParamsRef!.get("o_created_at")).toBe('{"$gte":"2026-10-01T18:30:00.000Z"}')
    console.log("BEFORE columns load:")
    console.log("  o_order:", searchParamsRef!.get("o_order"))
    console.log("  o_created_at:", searchParamsRef!.get("o_created_at"))

    // 2. Asynchronous column loading finishes (simulating network response from /admin/views/orders/columns)
    act(() => {
      mockColumnsLoading = false
      mockColumnsData = mockApiColumns
    })

    rerender()

    // Wait for effect to settle
    await waitFor(() => {
      // Expect that effect has cleared the search params
      expect(searchParamsRef!.get("o_order")).toBeNull()
    })

    console.log("AFTER columns load (current implementation):")
    console.log("  o_order:", searchParamsRef!.get("o_order"))
    console.log("  o_created_at:", searchParamsRef!.get("o_created_at"))

    // BUG VERIFICATION:
    // The table state in the URL has DISAPPEARED!
    // The filter and sort parameters were deleted!
    expect(searchParamsRef!.get("o_order")).toBeNull()
    expect(searchParamsRef!.get("o_created_at")).toBeNull()
  })
})
