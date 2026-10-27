// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { createMemoryRouter, RouterProvider } from "react-router-dom"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// `order-list-table.tsx` (via its All-tab body) pulls in `useOrders`,
// which pulls in `lib/client` - that module reads build-time defines
// (`__AUTH_TYPE__` etc.) injected by the Vite config and isn't available
// under a plain component test. Mocking the hook (the same one all three
// tab tables call) keeps module evaluation side-effect free, same as the
// existing `ready-to-ship-table.spec.tsx` / `shipped-table.spec.tsx`.
// Returning `count: 0` puts every table's `_DataTable` on its cheap
// "no records" path, so none of them render the heavier
// search/filter/column machinery this test doesn't care about.
vi.mock("../../../../../hooks/api/orders", () => ({
  useOrders: () => ({
    orders: [],
    count: 0,
    isLoading: false,
    isError: false,
    error: undefined,
  }),
}))

// `useOrderTableFilters` (the All tab only) calls `useRegions` /
// `useSalesChannels` / `useOrderTags`, which also reach `lib/client`.
// The All tab's filters aren't what this test is about, so the hook is
// replaced with an empty list.
vi.mock("../../../../../hooks/table/filters", () => ({
  useOrderTableFilters: () => [],
}))

// `useOrderTableColumns` renders `OrderNotesIndicatorCell`, which reaches
// `lib/client` via the order notes hook. With `count: 0` above, no
// columns are ever actually rendered (the table takes the "no records"
// branch), so an empty column list is equivalent for this test.
vi.mock("../../../../../hooks/table/columns/use-order-table-columns", () => ({
  useOrderTableColumns: () => [],
}))

// The bulk-tag modal module imports `sdk` from `lib/client` at module
// scope, so importing it at all (even unrendered) throws under test.
// It's only ever rendered after a bulk action is triggered, which this
// test never does.
vi.mock("./components/bulk-tag-orders-modal", () => ({
  BulkTagOrdersModal: () => null,
}))

import { OrderListTable } from "./order-list-table"

afterEach(() => {
  cleanup()
})

const renderOrderListTableAt = (initialPath: string) => {
  const router = createMemoryRouter(
    [{ path: "*", element: <OrderListTable /> }],
    { initialEntries: [initialPath] }
  )

  render(<RouterProvider router={router} />)

  return router
}

const ALL_MESSAGE = "orders.list.noRecordsMessage"
const READY_TO_SHIP_MESSAGE = "orders.readyToShip.noRecordsMessage"
const SHIPPED_MESSAGE = "orders.shipped.noRecordsMessage"

describe("OrderListTable view/tab wiring", () => {
  it("renders the All table by default, with no view param in the URL", () => {
    const router = renderOrderListTableAt("/orders")

    expect(router.state.location.search).toBe("")
    expect(screen.getByText(ALL_MESSAGE)).toBeTruthy()
    expect(screen.queryByText(READY_TO_SHIP_MESSAGE)).toBeNull()
    expect(screen.queryByText(SHIPPED_MESSAGE)).toBeNull()
  })

  it("navigating directly to ?view=ready-to-ship renders ReadyToShipTable immediately, never the All table's results", () => {
    const router = renderOrderListTableAt("/orders?view=ready-to-ship")

    // Asserted on first render, with no intervening `act`/`waitFor` tick:
    // the All table's stale/default content must never have been in the
    // document at all, not just be gone by the time we look.
    expect(router.state.location.search).toBe("?view=ready-to-ship")
    expect(screen.getByText(READY_TO_SHIP_MESSAGE)).toBeTruthy()
    expect(screen.queryByText(ALL_MESSAGE)).toBeNull()
    expect(screen.queryByText(SHIPPED_MESSAGE)).toBeNull()
  })

  it("navigating directly to ?view=shipped renders ShippedTable immediately, never the All table's results", () => {
    const router = renderOrderListTableAt("/orders?view=shipped")

    expect(router.state.location.search).toBe("?view=shipped")
    expect(screen.getByText(SHIPPED_MESSAGE)).toBeTruthy()
    expect(screen.queryByText(ALL_MESSAGE)).toBeNull()
    expect(screen.queryByText(READY_TO_SHIP_MESSAGE)).toBeNull()
  })

  it("clicking the Ready to Ship tab updates the URL's view query param via the router (not just internal state), and swaps to its table with no stale All content left behind", async () => {
    const user = userEvent.setup()
    const router = renderOrderListTableAt("/orders")

    expect(router.state.location.search).toBe("")
    expect(screen.getByText(ALL_MESSAGE)).toBeTruthy()

    await user.click(
      screen.getByRole("tab", { name: "orders.list.tabs.readyToShip" })
    )

    // The router's own location is the source of truth here, not just
    // what got rendered - this is what proves the tab is a real
    // navigation and not a client-only toggle.
    expect(router.state.location.pathname).toBe("/orders")
    expect(router.state.location.search).toBe("?view=ready-to-ship")

    expect(screen.getByText(READY_TO_SHIP_MESSAGE)).toBeTruthy()
    expect(screen.queryByText(ALL_MESSAGE)).toBeNull()
  })

  it("clicking back to the All tab from Ready to Ship updates the URL back and shows no stale Ready to Ship content", async () => {
    const user = userEvent.setup()
    const router = renderOrderListTableAt("/orders?view=ready-to-ship")

    expect(screen.getByText(READY_TO_SHIP_MESSAGE)).toBeTruthy()

    await user.click(screen.getByRole("tab", { name: "orders.list.tabs.all" }))

    expect(router.state.location.search).toBe("")
    expect(screen.getByText(ALL_MESSAGE)).toBeTruthy()
    expect(screen.queryByText(READY_TO_SHIP_MESSAGE)).toBeNull()
  })

  it("clicking the Shipped tab updates the URL to view=shipped", async () => {
    const user = userEvent.setup()
    const router = renderOrderListTableAt("/orders")

    await user.click(
      screen.getByRole("tab", { name: "orders.list.tabs.shipped" })
    )

    expect(router.state.location.search).toBe("?view=shipped")
    expect(screen.getByText(SHIPPED_MESSAGE)).toBeTruthy()
    expect(screen.queryByText(ALL_MESSAGE)).toBeNull()
  })
})
