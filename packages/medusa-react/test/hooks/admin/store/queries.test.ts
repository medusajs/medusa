import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminStore, useAdminStorePaymentProviders } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminStore hook", () => {
  test("returns the store", async () => {
    const store = fixtures.get("store")
    const { result, waitFor } = renderHook(() => useAdminStore(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.store).toEqual(store)
  })
})

describe("useAdminListPaymentProviders hook", () => {
  test("returns a list of the store's payment providers", async () => {
    const store = fixtures.get("store")
    const { result, waitFor } = renderHook(
      () => useAdminStorePaymentProviders(),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.payment_providers).toEqual(store.payment_providers)
  })
})
