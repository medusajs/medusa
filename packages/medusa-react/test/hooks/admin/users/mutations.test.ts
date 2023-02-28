import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateUser,
  useAdminDeleteUser,
  useAdminResetPassword,
  useAdminSendResetPasswordToken,
  useAdminUpdateUser,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateUser hook", () => {
  test("creates a user and returns it", async () => {
    const user = {
      email: "lebron@james.com",
      first_name: "Lebron",
      last_name: "James",
      role: "admin" as const,
      password: "test-password",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateUser(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(user)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.user).toEqual(
      expect.objectContaining({
        ...fixtures.get("user"),
        ...user,
      })
    )
  })
})

describe("useAdminUpdateUser hook", () => {
  test("updates a user and returns it", async () => {
    const id = fixtures.get("user").id
    const user = {
      first_name: "Zack",
      last_name: "Medusa",
    }

    const { result, waitFor } = renderHook(() => useAdminUpdateUser(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate(user)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.user).toEqual(
      expect.objectContaining({
        ...fixtures.get("user"),
        ...user,
      })
    )
  })
})

describe("useAdminDeleteUser hook", () => {
  test("deletes a user", async () => {
    const id = fixtures.get("user").id

    const { result, waitFor } = renderHook(() => useAdminDeleteUser(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id,
        deleted: true,
      })
    )
  })
})

describe("useAdminSendResetPasswordToken hook", () => {
  test("sends a token to reset the password", async () => {
    const payload = {
      email: "admin@user.com",
    }

    const { result, waitFor } = renderHook(
      () => useAdminSendResetPasswordToken(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
  })
})

describe("useAdminResetPassword hook", () => {
  test("reset the password", async () => {
    const payload = {
      token: "test-token",
      password: "new-password",
    }

    const { result, waitFor } = renderHook(() => useAdminResetPassword(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.user).toEqual(
      expect.objectContaining(fixtures.get("user"))
    )
  })
})
