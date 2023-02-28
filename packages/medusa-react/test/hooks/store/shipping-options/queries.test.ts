import { renderHook } from "@testing-library/react-hooks/dom"
import { rest } from "msw"
import { fixtures } from "../../../../mocks/data"
import { server } from "../../../../mocks/server"
import { useCartShippingOptions, useShippingOptions } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useShippingOptions hook", () => {
  test("returns a list of shipping options", async () => {
    const shippingOptions = fixtures.list("shipping_option", 5)
    const { result, waitFor } = renderHook(() => useShippingOptions(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.shipping_options).toEqual(shippingOptions)
  })

  test("when shipping options params are provided, then they should be sent as query params", async () => {
    const shippingOptions = fixtures.list("shipping_option")

    server.use(
      rest.get("/store/shipping-options/", (req, res, ctx) => {
        const product_ids = req.url.searchParams.get("product_ids")
        const is_return = req.url.searchParams.get("is_return")
        const region_id = req.url.searchParams.get("region_id")

        expect({
          product_ids,
          is_return,
          region_id,
        }).toEqual({
          product_ids: "1,2,3",
          is_return: "false",
          region_id: "test-region",
        })

        return res(
          ctx.status(200),
          ctx.json({
            shipping_options: fixtures.list("shipping_option"),
          })
        )
      })
    )

    const { result, waitFor } = renderHook(
      () =>
        useShippingOptions({
          product_ids: "1,2,3",
          is_return: "false",
          region_id: "test-region",
        }),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.shipping_options).toEqual(shippingOptions)
  })
})

describe("useCartShippingOptions hook", () => {
  test("success", async () => {
    const cartShippingOptions = fixtures.list("shipping_option")
    const { result, waitFor } = renderHook(
      () => useCartShippingOptions("cart_test"),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.shipping_options).toEqual(cartShippingOptions)
  })
})
