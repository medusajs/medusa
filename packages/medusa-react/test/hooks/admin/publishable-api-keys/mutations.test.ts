import { renderHook } from "@testing-library/react-hooks/dom"

import { fixtures } from "../../../../mocks/data"
import {
  useAdminAddPublishableKeySalesChannelsBatch,
  useAdminCreatePublishableApiKey,
  useAdminDeletePublishableApiKey,
  useAdminRemovePublishableKeySalesChannelsBatch,
  useAdminRevokePublishableApiKey,
  useAdminUpdatePublishableApiKey,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminCreatePublishableApiKey hook", () => {
  test("Created a publishable api key", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminCreatePublishableApiKey(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ title: "Mandatory title" })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        publishable_api_key: {
          title: "Mandatory title",
          ...fixtures.get("publishable_api_key"),
        },
      })
    )
  })
})

describe("useAdminUpdatePublishableApiKey hook", () => {
  test("updates an publishable key and returns it", async () => {
    const pubKey = {
      title: "changed title",
    }

    const { result, waitFor } = renderHook(
      () =>
        useAdminUpdatePublishableApiKey(fixtures.get("publishable_api_key").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(pubKey)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.publishable_api_key).toEqual(
      expect.objectContaining({
        ...fixtures.get("publishable_api_key"),
        ...pubKey,
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

describe("useAdminAddPublishableKeySalesChannelsBatch hook", () => {
  test("Adds a SC to the publishable api key scope", async () => {
    const id = "pubkey_1234"

    const { result, waitFor } = renderHook(
      () => useAdminAddPublishableKeySalesChannelsBatch(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      sales_channel_ids: [{ id: "rand_id" }],
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.publishable_api_key).toEqual(
      expect.objectContaining({
        ...fixtures.get("publishable_api_key"),
      })
    )
  })
})

describe("useAdminRemovePublishableKeySalesChannelsBatch hook", () => {
  test("Deletes a SC from the publishable api key scope", async () => {
    const id = "pubkey_1234"
    const { result, waitFor } = renderHook(
      () => useAdminRemovePublishableKeySalesChannelsBatch(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      sales_channel_ids: [{ id: "rand_id" }],
    })
    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.publishable_api_key).toEqual(
      expect.objectContaining({
        ...fixtures.get("publishable_api_key"),
      })
    )
  })
})
