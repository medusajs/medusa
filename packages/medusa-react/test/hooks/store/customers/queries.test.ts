import { renderHook } from "@testing-library/react-hooks/dom"
import { rest } from "msw"
import { fixtures } from "../../../../mocks/data"
import { server } from "../../../../mocks/server"
import { useCustomerOrders, useMeCustomer } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useMeCustomer hook", () => {
  test("returns customer", async () => {
    const customer = fixtures.get("customer")
    const { result, waitFor } = renderHook(() => useMeCustomer(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.customer).toEqual(customer)
  })
})

describe("useCustomerOrders hook", () => {
  test("returns customer's orders", async () => {
    const orders = fixtures.list("order", 5)

    const { result, waitFor } = renderHook(() => useCustomerOrders(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.orders).toEqual(orders)
    expect(result.current.limit).toEqual(5)
    expect(result.current.offset).toEqual(0)
  })

  test("propagates query params and returns customer's orders", async () => {
    const orders = fixtures.list("order")

    server.use(
      rest.get("/store/customers/me/orders", (req, res, ctx) => {
        const limit = req.url.searchParams.get("limit")
        const offset = req.url.searchParams.get("offset")
        const expand = req.url.searchParams.get("expand")
        const fields = req.url.searchParams.get("fields")
        expect({
          limit,
          offset,
          expand,
          fields,
        }).toEqual({
          limit: "2",
          offset: "5",
          expand: "relation_1,relation_2",
          fields: "field_1,field_2",
        })
        return res(
          ctx.status(200),
          ctx.json({
            orders,
            limit: 2,
            offset: 5,
          })
        )
      })
    )

    const { result, waitFor } = renderHook(
      () =>
        useCustomerOrders({
          limit: 2,
          offset: 5,
          expand: "relation_1,relation_2",
          fields: "field_1,field_2",
        }),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.orders).toEqual(orders)
    expect(result.current.limit).toEqual(2)
    expect(result.current.offset).toEqual(5)
  })
})
