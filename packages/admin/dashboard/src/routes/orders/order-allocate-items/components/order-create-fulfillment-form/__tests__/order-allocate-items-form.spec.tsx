// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import type { AdminOrder } from "@medusajs/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { OrderAllocateItemsForm } from "../order-allocate-items-form"
import { buildLineItem } from "./fixtures"

const { allocateItems, handleSuccess, invalidateQueries } = vi.hoisted(() => ({
  allocateItems: vi.fn(),
  handleSuccess: vi.fn(),
  invalidateQueries: vi.fn(),
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock("@medusajs/icons", () => ({
  Component: () => null,
  ExclamationCircleSolid: () => null,
  TriangleDownMini: () => null,
}))

vi.mock("@medusajs/ui", async () => {
  const { createElement, forwardRef, Fragment } = await import("react")
  const Select = Object.assign(
    ({ onValueChange, children, ...props }: any) =>
      createElement(
        "select",
        { ...props, onChange: (e: any) => onValueChange(e.target.value) },
        createElement("option", { value: "" }),
        children
      ),
    {
      Trigger: forwardRef(() => null),
      Value: () => null,
      Content: Fragment,
      Item: ({ children, ...props }: any) =>
        createElement("option", props, children),
    }
  )

  return {
    Select,
    Input: forwardRef((props: any, ref) =>
      createElement("input", { ...props, ref })
    ),
    Button: ({
      isLoading: _isLoading,
      size: _size,
      variant: _variant,
      ...props
    }: any) => createElement("button", props),
    Heading: ({ children }: any) => createElement("h1", null, children),
    Text: ({ children, className }: any) =>
      createElement("span", { className }, children),
    Alert: ({ children }: any) =>
      createElement("div", { role: "alert" }, children),
    clx: (...values: any[]) => values.filter(Boolean).join(" "),
    toast: { error: vi.fn() },
  }
})

vi.mock("../../../../../../components/common/form", async () => {
  const { Controller } = await import("react-hook-form")
  const { createElement, Fragment } = await import("react")

  return {
    Form: {
      Field: Controller,
      Item: (props: any) => createElement("div", props),
      Control: Fragment,
      Label: Fragment,
      Hint: Fragment,
      ErrorMessage: () => null,
    },
  }
})

vi.mock("../../../../../../components/common/thumbnail", () => ({
  Thumbnail: () => null,
}))

vi.mock("../../../../../../components/modals", async () => {
  const { createElement, Fragment } = await import("react")
  const { FormProvider } = await import("react-hook-form")

  return {
    useRouteModal: () => ({ handleSuccess }),
    RouteFocusModal: {
      Form: ({ form, children }: any) =>
        createElement(FormProvider, form, children),
      Header: () => null,
      Body: (props: any) => createElement("div", props),
      Footer: Fragment,
      Close: ({ children }: any) => children,
    },
  }
})

vi.mock("../../../../../../components/utilities/keybound-form", async () => {
  const { createElement } = await import("react")
  return {
    KeyboundForm: (props: any) => createElement("form", props),
  }
})

vi.mock("../../../../../../hooks/api/orders", () => ({
  ordersQueryKeys: { details: () => ["orders", "detail"] },
}))

vi.mock("../../../../../../hooks/api/reservations", () => ({
  useCreateReservationItem: () => ({
    mutateAsync: allocateItems,
    isPending: false,
  }),
}))

vi.mock("../../../../../../hooks/api/stock-locations", () => ({
  useStockLocations: () => ({
    stock_locations: [
      { id: "sloc_1", name: "Location 1" },
      { id: "sloc_2", name: "Location 2" },
    ],
  }),
}))

vi.mock("../../../../../../lib/query-client", () => ({
  queryClient: { invalidateQueries },
}))

function renderForm(items = [buildLineItem("a"), buildLineItem("b")]) {
  const result = render(
    <OrderAllocateItemsForm order={{ id: "order_1", items } as AdminOrder} />
  )
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "sloc_1" },
  })

  return {
    ...result,
    submit: screen.getByRole("button", {
      name: "orders.allocateItems.action",
    }) as HTMLButtonElement,
    quantity: (key: string) =>
      result.container.querySelector<HTMLInputElement>(
        `input[name="quantity.${key}"]`
      )!,
  }
}

function changeQuantity(input: HTMLInputElement, value: string) {
  fireEvent.change(input, { target: { value } })
}

describe("OrderAllocateItemsForm allocation validation", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    allocateItems.mockResolvedValue({})
    invalidateQueries.mockResolvedValue(undefined)
  })

  afterEach(cleanup)

  it("keeps submission blocked when another item is edited or an invalid item is hidden", () => {
    const { submit, quantity } = renderForm()
    changeQuantity(quantity("a-iitem_a"), "4")
    changeQuantity(quantity("b-iitem_b"), "1")

    expect(submit.disabled).toBe(true)
    expect(quantity("a-iitem_a").getAttribute("aria-invalid")).toBe("true")

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "b" } })
    changeQuantity(quantity("b-iitem_b"), "2")

    expect(submit.disabled).toBe(true)
    expect(screen.getByRole("alert").textContent).toBe(
      "orders.allocateItems.error.invalidQuantity"
    )
    expect(allocateItems).not.toHaveBeenCalled()
  })

  it("blocks direct form submission with invalid quantities and submits after correction", async () => {
    const { container, submit, quantity } = renderForm()
    changeQuantity(quantity("a-iitem_a"), "4")
    changeQuantity(quantity("b-iitem_b"), "1")

    await act(async () => {
      fireEvent.submit(container.querySelector("form")!)
    })
    expect(allocateItems).not.toHaveBeenCalled()

    changeQuantity(quantity("a-iitem_a"), "3")
    expect(submit.disabled).toBe(false)
    fireEvent.submit(container.querySelector("form")!)

    await waitFor(() => expect(allocateItems).toHaveBeenCalledTimes(2))
    expect(allocateItems).toHaveBeenCalledWith({
      line_item_id: "a",
      inventory_item_id: "iitem_a",
      location_id: "sloc_1",
      quantity: 3,
    })
    await waitFor(() =>
      expect(handleSuccess).toHaveBeenCalledWith("/orders/order_1")
    )
  })

  it("shows zero stock and flags a positive allocation at zero availability", () => {
    const { submit, quantity } = renderForm([
      buildLineItem("a", [{ id: "iitem_a", available: 0, required: 1 }]),
    ])

    expect(screen.getAllByText("0")).toHaveLength(2)
    changeQuantity(quantity("a-iitem_a"), "1")
    expect(submit.disabled).toBe(true)
    expect(quantity("a-iitem_a").getAttribute("aria-invalid")).toBe("true")

    changeQuantity(quantity("a-iitem_a"), "0")
    expect(submit.disabled).toBe(false)
  })

  it("validates kit components even when the kit is collapsed", () => {
    const { submit, quantity } = renderForm([
      buildLineItem("kit", [
        { id: "iitem_a", available: 5, required: 2 },
        { id: "iitem_b", available: 1, required: 1 },
      ]),
      buildLineItem("b"),
    ])
    changeQuantity(quantity("kit-"), "2")
    changeQuantity(quantity("b-iitem_b"), "1")

    expect(submit.disabled).toBe(true)
    expect(quantity("kit-").getAttribute("aria-invalid")).toBe("true")

    changeQuantity(quantity("kit-"), "1")
    expect(submit.disabled).toBe(false)
  })

  it("resets stale quantities and errors when the location changes", () => {
    const { submit, quantity } = renderForm()
    changeQuantity(quantity("a-iitem_a"), "4")
    expect(submit.disabled).toBe(true)

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "sloc_2" },
    })
    expect(quantity("a-iitem_a").value).toBe("")
    expect(submit.disabled).toBe(false)
    expect(screen.queryByRole("alert")).toBeNull()

    changeQuantity(quantity("a-iitem_a"), "4")
    expect(submit.disabled).toBe(false)
  })

  it("keeps kit errors when another component is edited independently", () => {
    const { submit, quantity } = renderForm([
      buildLineItem("kit", [
        { id: "iitem_a", available: 5, required: 2 },
        { id: "iitem_b", available: 1, required: 1 },
      ]),
    ])
    fireEvent.click(screen.getByText("orders.allocateItems.consistsOf"))
    changeQuantity(quantity("kit-iitem_a"), "6")
    changeQuantity(quantity("kit-iitem_b"), "1")

    expect(submit.disabled).toBe(true)
    expect(quantity("kit-iitem_a").getAttribute("aria-invalid")).toBe("true")
    expect(quantity("kit-").value).toBe("")

    changeQuantity(quantity("kit-iitem_a"), "5")
    expect(submit.disabled).toBe(false)
  })

  it("preserves the unallocated-items check", async () => {
    const { container } = renderForm()
    fireEvent.submit(container.querySelector("form")!)

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toBe(
        "orders.allocateItems.error.quantityNotAllocated"
      )
    )
    expect(allocateItems).not.toHaveBeenCalled()
  })
})
