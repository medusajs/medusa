import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminUser, useAdminUsers } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminUsers hook", () => {
  test("returns a list of users", async () => {
    const users = fixtures.list("user")
    const { result, waitFor } = renderHook(() => useAdminUsers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.users).toEqual(users)
  })
})

describe("useAdminUser hook", () => {
  test("returns a user", async () => {
    const user = fixtures.get("user")
    const { result, waitFor } = renderHook(() => useAdminUser(user.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.user).toEqual(user)
  })
})
