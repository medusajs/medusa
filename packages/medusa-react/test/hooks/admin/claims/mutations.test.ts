import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCancelClaim,
  useAdminCancelClaimFulfillment,
  useAdminCreateClaim,
  useAdminCreateClaimShipment,
  useAdminFulfillClaim,
  useAdminUpdateClaim,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateClaim hook", () => {
  test("creates a claim for an order", async () => {
    const orderId = fixtures.get("order").id

    const claim = {
      type: "refund" as const,
      claim_items: [
        {
          item_id: "test-variant",
          quantity: 1,
        },
      ],
    }

    const { result, waitFor } = renderHook(() => useAdminCreateClaim(orderId), {
      wrapper: createWrapper(),
    })

    result.current.mutate(claim)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminUpdateClaim hook", () => {
  test("updates a claim for an order", async () => {
    const orderId = fixtures.get("order").id
    const claimId = "test-claim"
    const claim = {
      shipping_method: [
        {
          option_id: "test-so",
          price: 1000,
        },
      ],
    }

    const { result, waitFor } = renderHook(() => useAdminUpdateClaim(orderId), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      claim_id: claimId,
      ...claim,
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminFulfillClaim hook", () => {
  test("fulfills a claim", async () => {
    const orderId = fixtures.get("order").id
    const claimId = "test-claim"
    const payload = {
      no_notification: true,
    }

    const { result, waitFor } = renderHook(
      () => useAdminFulfillClaim(orderId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      claim_id: claimId,
      ...payload,
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCreateClaimShipment hook", () => {
  test("creates a claim shipment", async () => {
    const orderId = fixtures.get("order").id
    const claimId = "test-claim"
    const payload = {
      fulfillment_id: "test-id",
      tracking_numbers: [],
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateClaimShipment(orderId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      claim_id: claimId,
      ...payload,
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCancelClaim hook", () => {
  test("cancels a claim for an order", async () => {
    const orderId = fixtures.get("order").id
    const claimId = "test-claim"

    const { result, waitFor } = renderHook(() => useAdminCancelClaim(orderId), {
      wrapper: createWrapper(),
    })

    result.current.mutate(claimId)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})

describe("useAdminCancelClaimFulfillment hook", () => {
  test("cancels a claim's fulfillment", async () => {
    const orderId = fixtures.get("order").id
    const claimId = "test-claim"
    const fulfillmentId = "test-ful"

    const { result, waitFor } = renderHook(
      () => useAdminCancelClaimFulfillment(orderId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ claim_id: claimId, fulfillment_id: fulfillmentId })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})
