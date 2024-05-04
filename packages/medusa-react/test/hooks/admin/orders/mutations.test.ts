import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminAddShippingMethod,
  useAdminArchiveOrder,
  useAdminCancelFulfillment,
  useAdminCancelOrder,
  useAdminCapturePayment,
  useAdminCompleteOrder,
  useAdminCreateFulfillment,
  useAdminCreateShipment,
  useAdminRefundPayment,
  useAdminUpdateOrder,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminUpdateOrder hook", () => {
  test("updates a order and returns it", async () => {
    const order = {
      email: "medusa@medusa.com",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateOrder(fixtures.get("order").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(order)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(
      expect.objectContaining({
        ...fixtures.get("order"),
        ...order,
      })
    )
  })
})

describe("useAdminCancelOrder hook", () => {
  test("cancels an order", async () => {
    const id = fixtures.get("order").id

    const { result, waitFor } = renderHook(() => useAdminCancelOrder(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminArchiveOrder hook", () => {
  test("archives an order", async () => {
    const id = fixtures.get("order").id

    const { result, waitFor } = renderHook(() => useAdminArchiveOrder(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCompleteOrder hook", () => {
  test("completes an order", async () => {
    const id = fixtures.get("order").id

    const { result, waitFor } = renderHook(() => useAdminCompleteOrder(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCapturePayment hook", () => {
  test("captures an order's payment", async () => {
    const id = fixtures.get("order").id

    const { result, waitFor } = renderHook(() => useAdminCapturePayment(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminRefundPayment hook", () => {
  test("captures an order's payment", async () => {
    const id = fixtures.get("order").id

    const payload = {
      amount: 100,
      reason: "wrong item",
    }

    const { result, waitFor } = renderHook(() => useAdminRefundPayment(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCreateShipment hook", () => {
  test("creates a shipment for an order", async () => {
    const id = fixtures.get("order").id

    const payload = {
      fulfillment_id: "test-ful",
      tracking_numbers: [],
    }

    const { result, waitFor } = renderHook(() => useAdminCreateShipment(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminAddShippingMethod hook", () => {
  test("adds a shipping method to an order", async () => {
    const id = fixtures.get("order").id

    const payload = {
      price: 1000,
      option_id: "test-so",
    }

    const { result, waitFor } = renderHook(
      () => useAdminAddShippingMethod(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCreateFulfillment hook", () => {
  test("creates a fulfillment for an order", async () => {
    const id = fixtures.get("order").id

    const fulfillment = {
      items: [
        {
          item_id: "test-item",
          quantity: 2,
        },
      ],
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateFulfillment(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(fulfillment)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCancelFulfillment hook", () => {
  test("cancels a fulfillment for an order", async () => {
    const id = fixtures.get("order").id
    const fulfillmentId = "test-ful"

    const { result, waitFor } = renderHook(
      () => useAdminCancelFulfillment(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(fulfillmentId)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})
