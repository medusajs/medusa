import { renderHook } from "@testing-library/react-hooks"

import { createWrapper } from "../../../utils"
import {
  useAdminDeletePublishableApiKey,
  useAdminRevokePublishableApiKey,
} from "../../../../src"
import { fixtures } from "../../../../mocks/data"
import { useAdminCreatePublishableApiKey } from "../../../../src"

describe("useAdminCreatePublishableApiKey hook", () => {
  test("Created a publishable api key", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminCreatePublishableApiKey(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({})

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        publishable_api_key: {
          ...fixtures.get("publishable_api_key"),
        },
      })
    )
  })
})

describe("useAdminRevokePublishableApiKey hook", () => {
  test("Revoke a publishable api key", async () => {
    const id = "pubkey_1234"
    const { result, waitFor } = renderHook(
      () => useAdminRevokePublishableApiKey(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        publishable_api_key: {
          ...fixtures.get("publishable_api_key"),
          revoked_at: "2022-11-10 11:17:46.666Z",
          revoked_by: "admin_user",
          id,
        },
      })
    )
  })
})

describe("useAdminDeletePublishableApiKey hook", () => {
  test("Deletes a publishable api key", async () => {
    const id = "pubkey_1234"
    const { result, waitFor } = renderHook(
      () => useAdminDeletePublishableApiKey(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()
    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id,
        object: "publishable_api_key",
        deleted: true,
      })
    )
  })
})
