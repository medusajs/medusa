import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminInvites } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminInvites hook", () => {
  test("returns a list of invites", async () => {
    const invites = fixtures.list("invite")
    const { result, waitFor } = renderHook(() => useAdminInvites(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.invites).toEqual(invites)
  })
})
