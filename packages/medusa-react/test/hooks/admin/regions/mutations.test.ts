import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateRegion,
  useAdminDeleteRegion,
  useAdminRegionAddFulfillmentProvider,
  useAdminRegionAddPaymentProvider,
  useAdminRegionDeleteFulfillmentProvider,
  useAdminRegionDeletePaymentProvider,
  useAdminUpdateRegion,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateRegion hook", () => {
  test("creates a region and returns it", async () => {
    const region = {
      name: "test region",
      currency_code: "eur",
      tax_rate: 10,
      payment_providers: [],
      fulfillment_providers: [],
      countries: [],
    }

    const { result, waitFor } = renderHook(() => useAdminCreateRegion(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(region)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.region).toEqual(
      expect.objectContaining({
        ...fixtures.get("region"),
        ...region,
      })
    )
  })
})

describe("useAdminUpdateRegion hook", () => {
  test("updates a region and returns it", async () => {
    const region = {
      name: "Africa",
    }
    const id = fixtures.get("region").id

    const { result, waitFor } = renderHook(() => useAdminUpdateRegion(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate(region)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.region).toEqual(
      expect.objectContaining({
        ...fixtures.get("region"),
        ...region,
      })
    )
  })
})

describe("useAdminDeleteRegion hook", () => {
  test("deletes a region", async () => {
    const id = fixtures.get("region").id

    const { result, waitFor } = renderHook(() => useAdminDeleteRegion(id), {
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

describe("useAdminRegionAddFulfillmentProvider hook", () => {
  test("adds a fulfillment provider to a region", async () => {
    const payload = {
      provider_id: "test-ful",
    }
    const id = fixtures.get("region").id

    const { result, waitFor } = renderHook(
      () => useAdminRegionAddFulfillmentProvider(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.region).toEqual(fixtures.get("region"))
  })
})

describe("useAdminRegionDeleteFulfillmentProvider hook", () => {
  test("deletes a region's fulfillment provider", async () => {
    const id = fixtures.get("region").id

    const { result, waitFor } = renderHook(
      () => useAdminRegionDeleteFulfillmentProvider(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("test-ful")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.region).toEqual(fixtures.get("region"))
  })
})

describe("useAdminRegionAddPaymentProvider hook", () => {
  test("adds a payment provider to a region", async () => {
    const payload = {
      provider_id: "test-pay",
    }
    const id = fixtures.get("region").id

    const { result, waitFor } = renderHook(
      () => useAdminRegionAddPaymentProvider(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.region).toEqual(fixtures.get("region"))
  })
})

describe("useAdminRegionDeletePaymentProvider hook", () => {
  test("deletes a region's payment provider", async () => {
    const id = fixtures.get("region").id

    const { result, waitFor } = renderHook(
      () => useAdminRegionDeletePaymentProvider(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("test-pay")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.region).toEqual(fixtures.get("region"))
  })
})
