import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminOrder, useAdminOrders } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminOrders hook", () => {
  test("returns a list of orders", async () => {
    const orders = fixtures.list("order")
    const { result, waitFor } = renderHook(() => useAdminOrders(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.orders).toEqual(orders)
  })
})

describe("useAdminOrder hook", () => {
  test("returns a order", async () => {
    const order = fixtures.get("order")
    const { result, waitFor } = renderHook(() => useAdminOrder(order.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.order).toEqual(order)
  })
})
