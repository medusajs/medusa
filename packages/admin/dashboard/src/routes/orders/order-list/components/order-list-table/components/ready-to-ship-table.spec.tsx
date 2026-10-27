// @vitest-environment jsdom
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { TooltipProvider } from "@medusajs/ui"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) => {
      return options ? `${key}:${JSON.stringify(options)}` : key
    },
    // `use-date.tsx` (behind `DateCell`, rendered by the bulk-command
    // tests' full `ReadyToShipTable` render below) reads `i18n.language`
    // directly, not just `t`.
    i18n: { language: "en" },
  }),
}))

const {
  mockUseOrders,
  mockBulkFulfillOrders,
  mockUseCreateOrderFulfillment,
  mockBulkFulfillResultSummary,
  mockToastError,
  mockPrompt,
} = vi.hoisted(() => ({
  mockUseOrders: vi.fn(),
  mockBulkFulfillOrders: vi.fn(),
  mockUseCreateOrderFulfillment: vi.fn(),
  mockBulkFulfillResultSummary: vi.fn(),
  mockToastError: vi.fn(),
  mockPrompt: vi.fn(),
}))

// Only `toast.error`/`usePrompt` are swapped out for spies - everything
// else (`Button`, `Checkbox`, `CommandBar`, `Alert`, ...) stays the real
// `@medusajs/ui` implementation, since the bulk-command tests below render
// the real `_DataTable`/`CommandBar` to exercise row selection and the
// command bar, not a stub of them. `usePrompt` is mocked rather than
// rendered for real because the real implementation needs a
// `PromptProvider` higher in the tree, which these tests don't set up -
// defaulting it to resolve `true` keeps every pre-existing bulk-command
// test below (written before the confirm step existed) passing unchanged.
vi.mock("@medusajs/ui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@medusajs/ui")>()
  return {
    ...actual,
    toast: {
      ...actual.toast,
      error: mockToastError,
    },
    usePrompt: () => mockPrompt,
  }
})

// `ready-to-ship-table.tsx` imports `useOrders`/`useBulkFulfillOrders`
// (and, transitively via `FulfillConfirmPopover`, `useCreateOrderFulfillment`),
// which pull in `lib/client` - that module reads build-time defines
// (`__AUTH_TYPE__` etc.) injected by the Vite config and isn't available
// under a plain component test. Mocked out purely to keep module
// evaluation side-effect free; `mockUseOrders`'s return value is
// configured per test via `mockReturnValue` so the plain-cell tests below
// (which never render `ReadyToShipTable` itself) and the bulk-command
// tests (which do) can use different fixtures in the same file.
vi.mock("../../../../../../hooks/api/orders", () => ({
  useOrders: (...args: any[]) => mockUseOrders(...args),
  useBulkFulfillOrders: () => ({
    mutateAsync: mockBulkFulfillOrders,
    isPending: false,
  }),
  useCreateOrderFulfillment: () => ({
    mutateAsync: mockUseCreateOrderFulfillment,
    isPending: false,
  }),
}))

// Stubbed so the bulk-command tests below can assert exactly what props
// `ReadyToShipTable` passes it, without depending on its own i18n
// interpolation - that's covered directly in
// `bulk-fulfill-result-summary.spec.tsx`.
vi.mock("./bulk-fulfill-result-summary", () => ({
  BulkFulfillResultSummary: (props: any) => {
    mockBulkFulfillResultSummary(props)
    return (
      <div data-testid="bulk-fulfill-result-summary">
        succeeded:{props.result.succeeded.join(",")}|failed:
        {props.result.failed
          .map((f: any) => `${f.order_id}:${f.error}`)
          .join(",")}
        <button onClick={props.onDismiss}>dismiss</button>
      </div>
    )
  },
}))

import {
  DisabledFulfillCell,
  PackageCell,
  ReadyToShipTable,
  ShipFromCell,
  ShippingRateCell,
} from "./ready-to-ship-table"

afterEach(() => {
  cleanup()
  mockUseOrders.mockReset()
  mockBulkFulfillOrders.mockReset()
  mockUseCreateOrderFulfillment.mockReset()
  mockBulkFulfillResultSummary.mockReset()
  mockToastError.mockReset()
  // `mockClear()`, not `mockReset()`: clears call history between tests
  // but keeps the `mockResolvedValue(true)` default below, so every
  // pre-existing bulk-command test (written before the confirm step
  // existed, and which never sets `mockPrompt` itself) keeps triggering
  // the mutation as if the user confirmed. The confirm-gating tests below
  // override it per-call with `mockResolvedValueOnce`.
  mockPrompt.mockClear()
})

mockUseOrders.mockReturnValue({
  orders: [],
  count: 0,
  isLoading: false,
  isError: false,
  error: undefined,
})

mockPrompt.mockResolvedValue(true)

describe("ReadyToShipTable shipping rate / fulfill", () => {
  it("shows $0.00 for a free shipping method, distinct from no shipping method at all", () => {
    // order A: shipping_methods[0].amount === 0 -> renders "$0.00"
    const { unmount } = render(
      <ShippingRateCell
        shippingMethod={
          {
            id: "sm_1",
            order_id: "order_1",
            name: "Free Shipping",
            amount: 0,
            is_tax_inclusive: false,
            shipping_option_id: "so_1",
            data: null,
          } as any
        }
        currencyCode="usd"
      />
    )

    expect(screen.getByText("Free Shipping")).toBeTruthy()
    expect(screen.getByText(/0\.00/)).toBeTruthy()

    unmount()

    // order B: shipping_methods is empty -> renders empty cell, visibly
    // distinct from the $0.00 case above
    const { container } = render(
      <ShippingRateCell shippingMethod={undefined} currencyCode="usd" />
    )

    expect(container.textContent).toBe("")
    expect(screen.queryByText("Free Shipping")).toBeNull()
    expect(screen.queryByText(/0\.00/)).toBeNull()
  })

  it("renders a disabled Fulfill button with a 'No shipping method' tooltip - this is the only state DisabledFulfillCell renders, since FulfillConfirmPopover wires the enabled case up itself", async () => {
    const user = userEvent.setup()

    render(
      <TooltipProvider>
        <DisabledFulfillCell />
      </TooltipProvider>
    )

    const disabledButton = screen.getByRole("button", {
      name: "orders.readyToShip.fulfill",
    }) as HTMLButtonElement
    expect(disabledButton.disabled).toBe(true)

    await user.hover(disabledButton)

    await waitFor(() => {
      expect(
        screen.getAllByText("orders.readyToShip.noShippingMethod").length
      ).toBeGreaterThan(0)
    })
  })
})

describe("ShipFromCell", () => {
  it("renders the resolved location name", () => {
    render(
      <ShipFromCell
        shippingMethod={
          {
            id: "sm_1",
            order_id: "order_1",
            name: "Standard Shipping",
            amount: 1000,
            is_tax_inclusive: false,
            shipping_option_id: "so_1",
            data: null,
            shipping_option: {
              service_zone: {
                fulfillment_set: {
                  location: { name: "Warehouse A" },
                },
              },
            },
          } as any
        }
      />
    )

    expect(screen.getByText("Warehouse A")).toBeTruthy()
  })

  it("renders empty when there is no shipping method - the same precondition the Shipping Rate column fails under", () => {
    const { container } = render(<ShipFromCell shippingMethod={undefined} />)

    expect(container.textContent).toBe("")
  })
})

describe("PackageCell", () => {
  it("renders 'Not set' for each missing weight/dimension field instead of a fabricated default", () => {
    render(
      <PackageCell
        items={[
          {
            id: "item_1",
            quantity: 2,
            detail: { fulfilled_quantity: 0 },
            variant: {
              weight: null,
              length: null,
              width: null,
              height: null,
            },
          } as any,
        ]}
      />
    )

    expect(
      screen.getByText("orders.readyToShip.weight: orders.readyToShip.notSet")
    ).toBeTruthy()
    expect(
      screen.getByText(
        "orders.readyToShip.notSet x orders.readyToShip.notSet x orders.readyToShip.notSet"
      )
    ).toBeTruthy()
  })

  it("renders the computed parcel when the dimensions are set", () => {
    render(
      <PackageCell
        items={[
          {
            id: "item_1",
            quantity: 2,
            detail: { fulfilled_quantity: 0 },
            variant: {
              weight: 5,
              length: 10,
              width: 20,
              height: 30,
            },
          } as any,
        ]}
      />
    )

    expect(screen.getByText("orders.readyToShip.weight: 10")).toBeTruthy()
    expect(screen.getByText("10 x 20 x 30")).toBeTruthy()
  })
})

/**
 * A minimal but render-complete `ReadyToShipOrder` fixture: one value for
 * every field each column in `useReadyToShipTableColumns` reads (customer,
 * shipping method -> shipping option -> service zone -> fulfillment set ->
 * location, items/variant dimensions, total, created_at), so the full
 * `ReadyToShipTable` - not just an individual cell - renders without
 * throwing or falling back to placeholder cells.
 */
const makeReadyToShipOrder = (id: string): any => ({
  id,
  display_id: Number(id.replace(/\D/g, "")) || 1,
  customer: {
    first_name: "Jane",
    last_name: "Doe",
    email: "jane@example.com",
  },
  currency_code: "usd",
  total: 1000,
  created_at: "2024-01-01T00:00:00.000Z",
  shipping_methods: [
    {
      id: `sm_${id}`,
      name: "Standard Shipping",
      amount: 500,
      shipping_option_id: `so_${id}`,
      shipping_option: {
        service_zone: {
          fulfillment_set: {
            location: { id: `loc_${id}`, name: "Warehouse A" },
          },
        },
      },
    },
  ],
  items: [
    {
      id: `item_${id}`,
      quantity: 1,
      detail: { fulfilled_quantity: 0 },
      variant: { weight: 1, length: 1, width: 1, height: 1 },
    },
  ],
})

// jsdom doesn't implement `Element.prototype.scroll` - `_DataTable`
// (`data-table-root.tsx`) calls it unconditionally on every page-index
// change, which would otherwise throw as soon as the full table (not just
// an individual cell, like the describe blocks above this one) is
// rendered.
if (!Element.prototype.scroll) {
  Element.prototype.scroll = vi.fn()
}

const renderReadyToShipTable = () =>
  render(
    <MemoryRouter>
      <TooltipProvider>
        <ReadyToShipTable />
      </TooltipProvider>
    </MemoryRouter>
  )

describe("ReadyToShipTable bulk Fulfill command", () => {
  it("renders no 'Fulfill selected' command when no rows are selected - _DataTable's own CommandBar open-gating (data-table-root.tsx:97,331-332), not duplicated in this component", () => {
    mockUseOrders.mockReturnValue({
      orders: [makeReadyToShipOrder("order_1")],
      count: 1,
      isLoading: false,
      isError: false,
      error: undefined,
    })

    renderReadyToShipTable()

    expect(screen.queryByRole("button", { name: /fulfillSelected/ })).toBeNull()
  })

  it("selecting a single row and triggering 'Fulfill selected' calls useBulkFulfillOrders's mutateAsync with exactly that row's id", async () => {
    mockUseOrders.mockReturnValue({
      orders: [
        makeReadyToShipOrder("order_1"),
        makeReadyToShipOrder("order_2"),
      ],
      count: 2,
      isLoading: false,
      isError: false,
      error: undefined,
    })
    mockBulkFulfillOrders.mockResolvedValue({
      succeeded: ["order_1"],
      failed: [],
    })

    const user = userEvent.setup()
    renderReadyToShipTable()

    // index 0 is the header "select all" checkbox; data rows start at 1.
    const checkboxes = screen.getAllByRole("checkbox")
    await user.click(checkboxes[1])

    const fulfillSelected = await screen.findByRole("button", {
      name: /fulfillSelected/,
    })
    await user.click(fulfillSelected)

    await waitFor(() => {
      expect(mockBulkFulfillOrders).toHaveBeenCalledWith({
        order_ids: ["order_1"],
      })
    })
    expect(mockBulkFulfillOrders).toHaveBeenCalledTimes(1)
  })

  it("selecting multiple rows calls mutateAsync with exactly the selected rows' ids", async () => {
    mockUseOrders.mockReturnValue({
      orders: [
        makeReadyToShipOrder("order_1"),
        makeReadyToShipOrder("order_2"),
        makeReadyToShipOrder("order_3"),
      ],
      count: 3,
      isLoading: false,
      isError: false,
      error: undefined,
    })
    mockBulkFulfillOrders.mockResolvedValue({
      succeeded: ["order_1", "order_2"],
      failed: [],
    })

    const user = userEvent.setup()
    renderReadyToShipTable()

    // Re-queried between clicks (rather than reusing one stale snapshot of
    // `getAllByRole`), since selecting the first row re-renders the table.
    await user.click(screen.getAllByRole("checkbox")[1])
    await user.click(screen.getAllByRole("checkbox")[2])

    const fulfillSelected = await screen.findByRole("button", {
      name: /fulfillSelected/,
    })
    await user.click(fulfillSelected)

    await waitFor(() => {
      expect(mockBulkFulfillOrders).toHaveBeenCalledTimes(1)
    })
    const call = mockBulkFulfillOrders.mock.calls[0][0]
    expect([...call.order_ids].sort()).toEqual(["order_1", "order_2"])
  })

  it("on a successful mutation, passes the exact structured { succeeded, failed } result to BulkFulfillResultSummary, and dismissing it removes it from the DOM", async () => {
    mockUseOrders.mockReturnValue({
      orders: [makeReadyToShipOrder("order_1")],
      count: 1,
      isLoading: false,
      isError: false,
      error: undefined,
    })
    const result = {
      succeeded: ["order_1"],
      failed: [
        { order_id: "order_2", error: "Unable to buy a shipping label" },
      ],
    }
    mockBulkFulfillOrders.mockResolvedValue(result)

    const user = userEvent.setup()
    renderReadyToShipTable()

    const checkboxes = screen.getAllByRole("checkbox")
    await user.click(checkboxes[1])
    await user.click(
      await screen.findByRole("button", { name: /fulfillSelected/ })
    )

    const summary = await screen.findByTestId("bulk-fulfill-result-summary")

    expect(mockBulkFulfillResultSummary).toHaveBeenCalledWith(
      expect.objectContaining({ result })
    )
    expect(summary.textContent).toContain("succeeded:order_1")
    expect(summary.textContent).toContain(
      "failed:order_2:Unable to buy a shipping label"
    )

    await user.click(within(summary).getByRole("button", { name: "dismiss" }))

    expect(screen.queryByTestId("bulk-fulfill-result-summary")).toBeNull()
  })

  it("on a request-level failure (the mutation's promise rejecting, not a per-order failure in a successful response), shows a toast and never renders BulkFulfillResultSummary", async () => {
    mockUseOrders.mockReturnValue({
      orders: [makeReadyToShipOrder("order_1")],
      count: 1,
      isLoading: false,
      isError: false,
      error: undefined,
    })
    mockBulkFulfillOrders.mockRejectedValue(new Error("Network request failed"))

    const user = userEvent.setup()
    renderReadyToShipTable()

    const checkboxes = screen.getAllByRole("checkbox")
    await user.click(checkboxes[1])
    await user.click(
      await screen.findByRole("button", { name: /fulfillSelected/ })
    )

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Network request failed")
    })

    expect(screen.queryByTestId("bulk-fulfill-result-summary")).toBeNull()
    expect(mockBulkFulfillResultSummary).not.toHaveBeenCalled()
  })

  it("shows a confirm prompt naming the selected order count before fulfilling, and declining it never calls mutateAsync - each fulfillment buys a real shipping label", async () => {
    mockUseOrders.mockReturnValue({
      orders: [
        makeReadyToShipOrder("order_1"),
        makeReadyToShipOrder("order_2"),
      ],
      count: 2,
      isLoading: false,
      isError: false,
      error: undefined,
    })
    mockPrompt.mockResolvedValueOnce(false)

    const user = userEvent.setup()
    renderReadyToShipTable()

    await user.click(screen.getAllByRole("checkbox")[1])
    await user.click(screen.getAllByRole("checkbox")[2])

    const fulfillSelected = await screen.findByRole("button", {
      name: /fulfillSelected/,
    })
    await user.click(fulfillSelected)

    await waitFor(() => {
      expect(mockPrompt).toHaveBeenCalledWith({
        title: "general.areYouSure",
        description:
          'orders.readyToShip.fulfillSelectedConfirmDescription:{"count":2}',
        confirmText: "actions.continue",
        cancelText: "actions.cancel",
      })
    })

    expect(mockBulkFulfillOrders).not.toHaveBeenCalled()
    expect(mockToastError).not.toHaveBeenCalled()
  })

  it("triggering the command a second time while the first hasn't settled is a no-op - it never fires a second, overlapping request for the same selection", async () => {
    mockUseOrders.mockReturnValue({
      orders: [makeReadyToShipOrder("order_1")],
      count: 1,
      isLoading: false,
      isError: false,
      error: undefined,
    })

    let resolveBulkFulfill: (value: any) => void = () => {}
    mockBulkFulfillOrders.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveBulkFulfill = resolve
        })
    )

    const user = userEvent.setup()
    renderReadyToShipTable()

    await user.click(screen.getAllByRole("checkbox")[1])

    // First click: confirms (the default `mockPrompt` resolution) and
    // starts the still-pending mutation.
    await user.click(
      await screen.findByRole("button", { name: /fulfillSelected/ })
    )
    await waitFor(() => {
      expect(mockBulkFulfillOrders).toHaveBeenCalledTimes(1)
    })

    // Second click while the first batch hasn't settled: the
    // `isBulkFulfilling` guard must make this a no-op, not a second
    // overlapping request for the same orders.
    await user.click(screen.getByRole("button", { name: /fulfillSelected/ }))
    expect(mockBulkFulfillOrders).toHaveBeenCalledTimes(1)
    expect(mockPrompt).toHaveBeenCalledTimes(1)

    resolveBulkFulfill({ succeeded: ["order_1"], failed: [] })

    await waitFor(() => {
      expect(screen.queryByTestId("bulk-fulfill-result-summary")).toBeTruthy()
    })
  })
})

/**
 * Regression coverage for the final-review Finding 1: `_DataTable`
 * (`data-table-root.tsx`) wraps every non-`select` cell - including the
 * `fulfill` column - in a react-router `Link` to `navigateTo`'s target
 * whenever one is configured, which `ReadyToShipTable` does (to the order
 * detail page). Unlike `fulfill-confirm-popover.spec.tsx`, which renders
 * `FulfillConfirmPopover` in isolation with no surrounding `Link` at all,
 * this renders the real, fully composed `ReadyToShipTable` under an actual
 * `/orders` + `/orders/:id` router so a click that bubbles to that `Link`
 * actually navigates, the way it would have in the real app.
 */
describe("ReadyToShipTable Fulfill popover - composed tree (regression)", () => {
  const renderComposedReadyToShipTable = () =>
    render(
      <MemoryRouter initialEntries={["/orders"]}>
        <TooltipProvider>
          <Routes>
            <Route path="/orders" element={<ReadyToShipTable />} />
            <Route
              path="/orders/:id"
              element={<div data-testid="order-detail-page">detail</div>}
            />
          </Routes>
        </TooltipProvider>
      </MemoryRouter>
    )

  it("clicking the row's Fulfill button opens the confirm popover instead of navigating to the order detail page", async () => {
    mockUseOrders.mockReturnValue({
      orders: [makeReadyToShipOrder("order_1")],
      count: 1,
      isLoading: false,
      isError: false,
      error: undefined,
    })

    const user = userEvent.setup()
    renderComposedReadyToShipTable()

    await user.click(
      screen.getByRole("button", { name: "orders.readyToShip.fulfill" })
    )

    expect(
      await screen.findByText("orders.readyToShip.confirmHeading")
    ).toBeTruthy()
    expect(screen.queryByTestId("order-detail-page")).toBeNull()
  })

  it("clicking Confirm inside the popover fulfills the order and stays on the list - it never reaches the row's Link", async () => {
    mockUseOrders.mockReturnValue({
      orders: [makeReadyToShipOrder("order_1")],
      count: 1,
      isLoading: false,
      isError: false,
      error: undefined,
    })
    mockUseCreateOrderFulfillment.mockResolvedValue({})

    const user = userEvent.setup()
    renderComposedReadyToShipTable()

    await user.click(
      screen.getByRole("button", { name: "orders.readyToShip.fulfill" })
    )
    await screen.findByText("orders.readyToShip.confirmHeading")

    await user.click(screen.getByRole("button", { name: "actions.confirm" }))

    await waitFor(() => {
      expect(mockUseCreateOrderFulfillment).toHaveBeenCalledWith({
        location_id: "loc_order_1",
        shipping_option_id: "so_order_1",
        items: [{ id: "item_order_1", quantity: 1 }],
      })
    })

    // Still on the list route, not navigated to the order detail page.
    expect(screen.queryByTestId("order-detail-page")).toBeNull()
    expect(
      screen.getByRole("button", { name: "orders.readyToShip.fulfill" })
    ).toBeTruthy()
  })
})

/**
 * Regression coverage for the final-review Finding 4: the single-row
 * Fulfill button is already disabled for an order with no shipping
 * method (`DisabledFulfillCell`), but the bulk row-selection checkbox had
 * no equivalent guard - a user could select such an order via the
 * checkbox and it would only fail once the batch ran, server-side.
 */
describe("ReadyToShipTable bulk row selection - no shipping method guard", () => {
  it("disables the row checkbox for an order with no shipping method, matching the single-row Fulfill button's own guard", async () => {
    mockUseOrders.mockReturnValue({
      orders: [
        makeReadyToShipOrder("order_1"),
        { ...makeReadyToShipOrder("order_2"), shipping_methods: [] },
      ],
      count: 2,
      isLoading: false,
      isError: false,
      error: undefined,
    })

    renderReadyToShipTable()

    // index 0: header "select all" checkbox; 1: order_1 (has a shipping
    // method); 2: order_2 (none).
    const [, order1Checkbox, order2Checkbox] = (await screen.findAllByRole(
      "checkbox"
    )) as HTMLButtonElement[]

    expect(order1Checkbox.disabled).toBe(false)
    expect(order2Checkbox.disabled).toBe(true)
  })

  it("the header 'select all' checkbox only selects rows with a shipping method, so a bulk fulfill never includes the unselectable order", async () => {
    mockUseOrders.mockReturnValue({
      orders: [
        makeReadyToShipOrder("order_1"),
        { ...makeReadyToShipOrder("order_2"), shipping_methods: [] },
      ],
      count: 2,
      isLoading: false,
      isError: false,
      error: undefined,
    })
    mockBulkFulfillOrders.mockResolvedValue({
      succeeded: ["order_1"],
      failed: [],
    })

    const user = userEvent.setup()
    renderReadyToShipTable()

    const [selectAll] = await screen.findAllByRole("checkbox")
    await user.click(selectAll)

    await user.click(
      await screen.findByRole("button", { name: /fulfillSelected/ })
    )

    await waitFor(() => {
      expect(mockBulkFulfillOrders).toHaveBeenCalledWith({
        order_ids: ["order_1"],
      })
    })
  })
})
