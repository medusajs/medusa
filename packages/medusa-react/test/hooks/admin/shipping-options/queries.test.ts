import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminShippingOption,
  useAdminShippingOptions,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminShippingOptions hook", () => {
  test("returns a list of shipping options", async () => {
    const shippingOptions = fixtures.list("shipping_option")
    const { result, waitFor } = renderHook(() => useAdminShippingOptions(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.shipping_options).toEqual(shippingOptions)
  })
})

describe("useAdminShippingOption hook", () => {
  test("returns a shipping option", async () => {
    const shippingOption = fixtures.get("shipping_option")
    const { result, waitFor } = renderHook(
      () => useAdminShippingOption(shippingOption.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.shipping_option).toEqual(shippingOption)
  })
})
