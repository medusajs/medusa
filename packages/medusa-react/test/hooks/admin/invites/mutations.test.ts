import { renderHook } from "@testing-library/react-hooks/dom"
import {
  useAdminAcceptInvite,
  useAdminCreateInvite,
  useAdminDeleteInvite,
  useAdminResendInvite,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminAcceptInvite hook", () => {
  test("accepts an invite", async () => {
    const payload = {
      token: "test-token",
      user: {
        first_name: "zak",
        last_name: "medusa",
        password: "test-password",
      },
    }

    const { result, waitFor } = renderHook(() => useAdminAcceptInvite(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
  })
})

describe("useAdminCreateInvite hook", () => {
  test("creates an invite", async () => {
    const payload = {
      user: "test-id",
      role: "admin" as const,
    }

    const { result, waitFor } = renderHook(() => useAdminCreateInvite(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
  })
})

describe("useAdminDeleteInvite hook", () => {
  test("deletes an invite", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteInvite("test-invite"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: "test-invite",
        deleted: true,
      })
    )
  })
})

describe("useAdminResend hook", () => {
  test("resends an invite", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminResendInvite("test-invite"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
  })
})
