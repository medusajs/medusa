import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminAddStoreCurrency,
  useAdminDeleteStoreCurrency,
  useAdminUpdateStore,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminUpdateStore hook", () => {
  test("updates a store", async () => {
    const store = {
      name: "medusa-store",
      swap_link_template: "template",
      payment_link_template: "payment",
    }

    const { result, waitFor } = renderHook(() => useAdminUpdateStore(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(store)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.store).toEqual({
      ...fixtures.get("store"),
      ...store,
    })
  })
})

describe("useAdminAddStoreCurrency hook", () => {
  test("adds a currency to the store", async () => {
    const { result, waitFor } = renderHook(() => useAdminAddStoreCurrency(), {
      wrapper: createWrapper(),
    })

    result.current.mutate("eur")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.store).toEqual(fixtures.get("store"))
  })
})

describe("useAdminDeleteStoreCurrency hook", () => {
  test("deletes a currency from the store", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteStoreCurrency(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("eur")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.store).toEqual(fixtures.get("store"))
  })
})
