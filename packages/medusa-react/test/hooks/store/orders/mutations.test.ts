import { renderHook } from "@testing-library/react-hooks/dom"
import { useGrantOrderAccess, useRequestOrderAccess } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useGrantOrderAccess hook", () => {
  test("Grant access to token", async () => {
    const { result, waitFor } = renderHook(() => useGrantOrderAccess(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ token: "store_order_edit" })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
  })
})

describe("useRequestOrderAccess hook", () => {
  test("Requests access to ids", async () => {
    const { result, waitFor } = renderHook(() => useRequestOrderAccess(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ order_ids: [""] })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
  })
})
