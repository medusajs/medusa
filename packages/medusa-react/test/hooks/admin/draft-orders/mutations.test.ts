import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateDraftOrder,
  useAdminDeleteDraftOrder,
  useAdminDraftOrderAddLineItem,
  useAdminDraftOrderRegisterPayment,
  useAdminDraftOrderRemoveLineItem,
  useAdminDraftOrderUpdateLineItem,
  useAdminUpdateDraftOrder,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateDraftOrder hook", () => {
  test("creates a draft order and returns it", async () => {
    const draftOrder = {
      email: "lebron@james.com",
      items: [
        {
          variant_id: "variant_01FGKMYKJVY3DYDZWCRB2GZS0G",
          quantity: 1,
        },
      ],
      shipping_methods: [
        {
          option_id: "opt_01FGKMYKJWQZCZANRNHR3XVRN3",
          price: 0,
        },
      ],
      region_id: "reg_01FGKMYKKG6ACZANRNHR3XVRN3",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateDraftOrder(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(draftOrder)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.draft_order).toEqual(
      expect.objectContaining({
        ...fixtures.get("draft_order"),
        ...draftOrder,
      })
    )
  })
})

describe("useAdminUpdateDraftOrder hook", () => {
  test("updates a draft order and returns it", async () => {
    const id = fixtures.get("draft_order").id
    const draftOrder = {
      country_code: "dk",
    }

    const { result, waitFor } = renderHook(() => useAdminUpdateDraftOrder(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate(draftOrder)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.draft_order).toEqual(
      expect.objectContaining({
        ...fixtures.get("draft_order"),
        ...draftOrder,
      })
    )
  })
})

describe("useAdminDeleteDraftOrder hook", () => {
  test("deletes a draft order", async () => {
    const id = fixtures.get("draft_order").id

    const { result, waitFor } = renderHook(() => useAdminDeleteDraftOrder(id), {
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

describe("useAdminDraftOrderAddLineItem hook", () => {
  test("adds a line item to a draft order", async () => {
    const id = fixtures.get("draft_order").id
    const lineItem = {
      quantity: 2,
      variant_id: "test-variant",
    }

    const { result, waitFor } = renderHook(
      () => useAdminDraftOrderAddLineItem(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(lineItem)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.draft_order).toEqual(fixtures.get("draft_order"))
  })
})

describe("useAdminDraftOrderUpdateLineItem hook", () => {
  test("updates a draft order's line item", async () => {
    const id = fixtures.get("draft_order").id
    const lineItemId = "test-li"
    const newLineItem = {
      quantity: 1,
      variant_id: "test-variant",
    }

    const { result, waitFor } = renderHook(
      () => useAdminDraftOrderUpdateLineItem(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      item_id: lineItemId,
      ...newLineItem,
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.draft_order).toEqual(fixtures.get("draft_order"))
  })
})

describe("useAdminDraftOrderRemoveLineItem hook", () => {
  test("delete a draft order's line item", async () => {
    const id = fixtures.get("draft_order").id
    const lineItemId = "test-li"

    const { result, waitFor } = renderHook(
      () => useAdminDraftOrderRemoveLineItem(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(lineItemId)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.draft_order).toEqual(fixtures.get("draft_order"))
  })
})

describe("useAdminDraftOrderRegisterPayment hook", () => {
  test("marks a draft order as paid", async () => {
    const id = fixtures.get("draft_order").id

    const { result, waitFor } = renderHook(
      () => useAdminDraftOrderRegisterPayment(id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order).toEqual(fixtures.get("order"))
  })
})
