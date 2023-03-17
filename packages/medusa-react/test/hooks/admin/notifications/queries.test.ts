import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminNotifications } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminNotifications hook", () => {
  test("returns a list of notifications", async () => {
    const notifications = fixtures.list("notification")
    const { result, waitFor } = renderHook(() => useAdminNotifications(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.notifications).toEqual(notifications)
  })
})
