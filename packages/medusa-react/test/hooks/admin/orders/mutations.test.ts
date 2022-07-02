import {
  useAdminCreateOrder,
  useAdminUpdateOrder,
  useAdminDeleteOrderMetadata,
  useAdminCompleteOrder,
  useAdminCapturePayment,
  useAdminRefundPayment,
  useAdminCreateShipment,
  useAdminCancelOrder,
  useAdminAddShippingMethod,
  useAdminArchiveOrder,
  useAdminCreateFulfillment,
  useAdminCancelFulfillment,
} from "../../../../src/"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminCreateOrder hook", () => {
  test("creates a order and returns it", async () => {
    const order = {
      email: "lebron@james.com",
      billing_address: {
        company: "medusa",
        first_name: "Jane",
        last_name: "Medusan",
        address_1: "jane street",
        address_2: "2nd floor",
        city: "copenhagen",
        country_code: "dk",
        province: "copenhagen",
        postal_code: "382793",
        phone: "4897394",
        metadata: null,
      },
      shipping_address: {
        company: "medusa",
        first_name: "Jane",
        last_name: "Medusan",
        address_1: "jane street",
        address_2: "2nd floor",
        city: "copenhagen",
        country_code: "dk",
        province: "copenhagen",
        postal_code: "382793",
        phone: "4897394",
        metadata: null,
      },
      items: [
        {
          variant_id: "test-variant",
          quantity: 1,
        },
      ],
      region: "test-region",
      customer_id: "cus_test",
      payment_method: {
        provider_id: "test-pay",
      },
    }

    const { result, waitFor } = renderHook(() => useAdminCreateOrder(), {
      wrapper: createWrapper(),
    })

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

describe("useAdminDeleteOrderMetadata hook", () => {
  test("remove metadata field on order", async () => {
    const id = fixtures.get("order").id

    const { result, waitFor } = renderHook(
      () => useAdminDeleteOrderMetadata(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("some_key")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})
