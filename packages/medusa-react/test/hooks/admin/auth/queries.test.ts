import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminGetSession } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminGetSession hook", () => {
  test("returns the authenticated user", async () => {
    const user = fixtures.get("user")
    const { result, waitFor } = renderHook(() => useAdminGetSession(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.user).toEqual(user)
  })
})
