import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateReturnReason,
  useAdminDeleteReturnReason,
  useAdminUpdateReturnReason,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateReturnReason hook", () => {
  test("creates a return reason and returns it", async () => {
    const rr = {
      value: "too_big",
      label: "Too big",
      description: "Shirt is too big in length",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateReturnReason(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(rr)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.return_reason).toEqual(
      expect.objectContaining({
        ...fixtures.get("return_reason"),
        ...rr,
      })
    )
  })
})

describe("useAdminUpdateReturnReason hook", () => {
  test("updates a return reason and returns it", async () => {
    const rr = {
      value: "too_small",
      label: "Too small",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateReturnReason(fixtures.get("return_reason").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(rr)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.return_reason).toEqual(
      expect.objectContaining({
        ...fixtures.get("return_reason"),
        ...rr,
      })
    )
  })
})

describe("useAdminDeleteReturnReason hook", () => {
  test("deletes a return reason", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteReturnReason(fixtures.get("return_reason").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("return_reason").id,
        deleted: true,
      })
    )
  })
})
