import { renderHook } from "@testing-library/react-hooks/dom"

import { fixtures } from "../../../../mocks/data"
import {
  useAdminPublishableApiKey,
  useAdminPublishableApiKeys,
  useAdminPublishableApiKeySalesChannels,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminPublishableApiKey hook", () => {
  test("returns an publishable api key", async () => {
    const publishable_api_key = fixtures.get("publishable_api_key")
    const { result, waitFor } = renderHook(
      () => useAdminPublishableApiKey(publishable_api_key.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.publishable_api_key).toEqual(publishable_api_key)
  })
})

describe("useAdminPublishableApiKeys hook", () => {
  test("returns a list of publishable api keys", async () => {
    const publishable_api_key = fixtures.get("publishable_api_key")
    const { result, waitFor } = renderHook(() => useAdminPublishableApiKeys(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.publishable_api_keys).toEqual(
      expect.arrayContaining([publishable_api_key])
    )
  })
})

describe("useAdminPublishableApiKeySalesChannels hook", () => {
  test("returns a list of sales channels of a publishable api key", async () => {
    const publishable_api_key = fixtures.get("publishable_api_key")

    const { result, waitFor } = renderHook(
      () => useAdminPublishableApiKeySalesChannels(publishable_api_key.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.sales_channels).toEqual(
      fixtures.get("sales_channels")
    )
  })
})
