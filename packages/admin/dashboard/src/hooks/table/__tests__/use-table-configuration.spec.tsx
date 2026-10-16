// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react"
import { Fragment, StrictMode } from "react"
import { MemoryRouter, useLocation } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

type ViewConfiguration = {
  filters: Record<string, unknown>
  sorting: { id: string; desc: boolean } | null
  search: string
}

type ActiveView = {
  isLoading: boolean
  view_configuration?: { id: string; configuration: ViewConfiguration }
}

const mocks = vi.hoisted(() => ({
  activeView: { isLoading: true } as ActiveView,
  columns: [{ field: "created_at" }],
  filters: [{ id: "created_at", type: "date", label: "Created" }],
  noRelationshipOptions: {},
}))

vi.mock("../../use-view-configurations", () => ({
  useViewConfigurations: () => ({
    activeView: mocks.activeView,
    createView: {},
  }),
  useViewConfiguration: () => ({ updateView: {} }),
}))
vi.mock("../../api/views", () => ({
  useEntityColumns: () => ({ columns: mocks.columns, isLoading: false }),
}))
vi.mock("../../../providers/feature-flag-provider", () => ({
  useFeatureFlag: () => true,
}))
vi.mock("../columns/use-column-state", () => ({
  useColumnState: () => ({
    visibleColumns: {},
    columnOrder: [],
    currentColumns: { visible: [], order: [] },
    setColumnOrder: () => {},
    handleColumnVisibilityChange: () => {},
    handleViewChange: () => {},
  }),
}))
vi.mock("../../../lib/table/field-utils", () => ({
  calculateRequiredFields: () => "",
}))
vi.mock("../../../lib/table/filter-utils", () => ({
  generateFiltersFromColumns: () => mocks.filters,
  getRelationshipFilterConfigs: () => [],
}))
vi.mock("../use-relationship-filter-options", () => ({
  useRelationshipFilterOptions: () => ({
    options: mocks.noRelationshipOptions,
    isLoading: false,
  }),
}))

import { useTableConfiguration } from "../use-table-configuration"

const loadedView = (id: string, configuration: Partial<ViewConfiguration>) => ({
  isLoading: false,
  view_configuration: {
    id,
    configuration: { filters: {}, sorting: null, search: "", ...configuration },
  },
})

const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20))
  })

// A link shared from the Orders list. Filters are stored in the URL as JSON.
const CREATED_AT = JSON.stringify({ $gte: "2026-10-01T17:00:00.000Z" })
const PENDING = JSON.stringify(["pending"])
const DEEP_LINK = `/orders?o_order=-id&o_created_at=${CREATED_AT}`
const DEEP_LINK_SEARCH = `?o_order=-id&o_created_at=${CREATED_AT}`

function renderConfiguration(url: string, strict = false) {
  const location = { search: "" }

  const Probe = () => {
    useTableConfiguration({ entity: "orders", queryPrefix: "o" })
    location.search = decodeURIComponent(useLocation().search)
    return null
  }

  const Tree = () => {
    const Wrapper = strict ? StrictMode : Fragment
    return (
      <Wrapper>
        <MemoryRouter initialEntries={[url]}>
          <Probe />
        </MemoryRouter>
      </Wrapper>
    )
  }

  const { rerender } = render(<Tree />)

  return {
    getSearch: () => location.search,
    // The mocked view hooks read `mocks.activeView` on every render.
    setActiveView: async (activeView: ActiveView) => {
      mocks.activeView = activeView
      rerender(<Tree />)
      await settle()
    },
  }
}

describe("useTableConfiguration", () => {
  beforeEach(() => {
    mocks.activeView = { isLoading: true }
  })

  afterEach(() => {
    cleanup()
  })

  describe.each([false, true])(
    "with table state in the URL when it mounts (strict mode: %s)",
    (strict) => {
      it("keeps the URL while the active view is loading and after it has loaded", async () => {
        const { getSearch, setActiveView } = renderConfiguration(
          DEEP_LINK,
          strict
        )
        await settle()
        expect(getSearch()).toBe(DEEP_LINK_SEARCH)

        await setActiveView(loadedView("v1", {}))

        expect(getSearch()).toBe(DEEP_LINK_SEARCH)
      })

      it("applies a view that is switched to afterwards", async () => {
        const { getSearch, setActiveView } = renderConfiguration(
          DEEP_LINK,
          strict
        )
        await setActiveView(loadedView("v1", {}))

        await setActiveView(
          loadedView("v2", { filters: { status: ["pending"] } })
        )

        expect(getSearch()).toBe(`?o_status=${PENDING}`)
      })

      it("applies the first view when switching back to it", async () => {
        const { getSearch, setActiveView } = renderConfiguration(
          DEEP_LINK,
          strict
        )
        await setActiveView(loadedView("v1", {}))
        await setActiveView(
          loadedView("v2", { filters: { status: ["pending"] } })
        )

        await setActiveView(loadedView("v1", {}))

        expect(getSearch()).toBe("")
      })
    }
  )

  it("applies the active view on mount when the URL has no table state", async () => {
    mocks.activeView = loadedView("v2", {
      filters: { status: ["pending"] },
      sorting: { id: "id", desc: true },
    })

    const { getSearch } = renderConfiguration("/orders?tab=x")
    await settle()

    expect(getSearch()).toBe(`?tab=x&o_status=${PENDING}&o_order=-id`)
  })
})
