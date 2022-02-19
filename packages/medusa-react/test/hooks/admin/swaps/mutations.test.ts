import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateSwap,
  useAdminFulfillSwap,
  useAdminCancelSwap,
  useAdminCancelSwapFulfillment,
  useAdminCreateSwap,
  useAdminCreateSwapShipment,
  useAdminFulfillSwap,
  useAdminProcessSwapPayment,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateSwap hook", () => {
  test("creates a swap and returns the order", async () => {
    const orderId = fixtures.get("order").id
    const swap = {
      return_items: [
        {
          item_id: "test-item",
          quantity: 1,
        },
      ],
      additional_items: [
        {
          variant_id: "another-item",
          quantity: 1,
        },
      ],
    }

    const { result, waitFor } = renderHook(() => useAdminCreateSwap(orderId), {
      wrapper: createWrapper(),
    })

    result.current.mutate(swap)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminFulfillSwap hook", () => {
  test("receives a swap", async () => {
    const orderId = fixtures.get("order").id
    const swapId = "test-swap"
    const payload = {
      no_notification: false,
    }

    const { result, waitFor } = renderHook(() => useAdminFulfillSwap(orderId), {
      wrapper: createWrapper(),
    })

    result.current.mutate({ swap_id: swapId, ...payload })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCreateSwapShipment hook", () => {
  test("creates a swap shipment", async () => {
    const orderId = fixtures.get("order").id
    const swapId = "test-swap"
    const payload = {
      fulfillment_id: "test-ful",
      tracking_numbers: [],
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateSwapShipment(orderId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ swap_id: swapId, ...payload })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminProcessSwapPayment hook", () => {
  test("process a swap's payment", async () => {
    const orderId = fixtures.get("order").id
    const swapId = "test-swap"

    const { result, waitFor } = renderHook(
      () => useAdminProcessSwapPayment(orderId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(swapId)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCancelSwap hook", () => {
  test("cancels a swap", async () => {
    const orderId = fixtures.get("order").id
    const swapId = "test-swap"

    const { result, waitFor } = renderHook(() => useAdminCancelSwap(orderId), {
      wrapper: createWrapper(),
    })

    result.current.mutate(swapId)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCancelSwapFulfillment hook", () => {
  test("cancels a swap", async () => {
    const orderId = fixtures.get("order").id
    const swapId = "test-swap"
    const fulfillmentId = "test-ful"

    const { result, waitFor } = renderHook(
      () => useAdminCancelSwapFulfillment(orderId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ swap_id: swapId, fulfillment_id: fulfillmentId })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})
