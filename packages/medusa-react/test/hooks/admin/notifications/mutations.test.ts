import { useAdminResendNotification } from "../../../../src/"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminResendNotification hook", () => {
  test("resends a notification", async () => {
    const notif = {
      to: "me@me.me",
    }

    const { result, waitFor } = renderHook(
      () => useAdminResendNotification("test-notification"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(notif)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.notification).toEqual(
      expect.objectContaining({
        ...fixtures.get("notification"),
        ...notif,
        id: "test-notification",
      })
    )
  })
})
