import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { useAdminCancelReturn, useAdminReceiveReturn } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCancel hook", () => {
  test("cancels a return", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminCancelReturn("test-return"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminReceiveReturn hook", () => {
  test("marks a return as received", async () => {
    const payload = {
      items: [
        {
          item_id: "test_id",
          quantity: 1,
        },
      ],
    }

    const { result, waitFor } = renderHook(
      () => useAdminReceiveReturn("test-return"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ ...payload })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.return).toEqual(fixtures.get("return"))
  })
})
