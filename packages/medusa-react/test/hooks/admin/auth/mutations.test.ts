import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminDeleteSession, useAdminLogin } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminLogin hook", () => {
  test("logs in a user", async () => {
    const payload = {
      email: "lebron@james.com",
      password: "supersecure",
    }

    const { result, waitFor } = renderHook(() => useAdminLogin(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.user).toEqual(fixtures.get("user"))
  })
})

describe("useAdminDeleteSession hook", () => {
  test("deletes a collection", async () => {
    const { result, waitFor } = renderHook(() => useAdminDeleteSession(), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
  })
})
