import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateShippingOption,
  useAdminDeleteShippingOption,
  useAdminUpdateShippingOption,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateShippingOption hook", () => {
  test("creates a shipping option and returns it", async () => {
    const so = {
      name: "test-so",
      region_id: "test-region",
      provider_id: "test-provider",
      data: {},
      price_type: "flat",
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateShippingOption(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(so)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.shipping_option).toEqual(
      expect.objectContaining({
        ...fixtures.get("shipping_option"),
        ...so,
      })
    )
  })
})

describe("useAdminUpdateShippingOption hook", () => {
  test("updates a shipping option and returns it", async () => {
    const so = {
      name: "test-so",
      requirements: [
        {
          id: "test-so-req",
          type: "thing",
          amount: 500,
        },
      ],
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateShippingOption(fixtures.get("shipping_option").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(so)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.shipping_option).toEqual(
      expect.objectContaining({
        ...fixtures.get("shipping_option"),
        ...so,
      })
    )
  })
})

describe("useAdminDeleteShippingOption hook", () => {
  test("deletes a shipping option", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteShippingOption(fixtures.get("shipping_option").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("shipping_option").id,
        deleted: true,
      })
    )
  })
})
