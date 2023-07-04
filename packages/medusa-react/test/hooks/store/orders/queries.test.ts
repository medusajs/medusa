import { renderHook } from "@testing-library/react-hooks/dom"
import { rest } from "msw"
import { fixtures } from "../../../../mocks/data"
import { server } from "../../../../mocks/server"
import { useCartOrder, useOrder } from "../../../../src/"
import { useOrders } from "../../../../src/hooks"
import { createWrapper } from "../../../utils"

describe("useOrder hook", () => {
  test("returns an order", async () => {
    const order = fixtures.get("order")
    const { result, waitFor } = renderHook(() => useOrder(order.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.order).toEqual(order)
  })
})

describe("useCartOrder hook", () => {
  test("returns a cart order", async () => {
    const order = fixtures.get("order")
    const { result, waitFor } = renderHook(() => useCartOrder("test_cart"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.order).toEqual(order)
  })
})

describe("useOrders hook", () => {
  test("propagates the query params and returns an order", async () => {
    const order = fixtures.get("order")
    const displayId = 400,
      emailParam = "customer@test.com"

    server.use(
      rest.get("/store/orders", (req, res, ctx) => {
        const display_id = req.url.searchParams.get("display_id")
        const email = req.url.searchParams.get("email")
        expect({
          display_id,
          email,
        }).toEqual({
          email: emailParam,
          display_id: displayId.toString(),
        })
        return res(
          ctx.status(200),
          ctx.json({
            order,
          })
        )
      })
    )

    const { result, waitFor } = renderHook(
      () =>
        useOrders({
          display_id: displayId,
          email: emailParam,
        }),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.order).toEqual(order)
  })
})
