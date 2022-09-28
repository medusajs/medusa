import { renderHook } from "@testing-library/react-hooks"
import {
  useAdminCancelOrderEdit,
  useAdminCreateOrderEdit,
  useAdminDeleteOrderEdit,
  useAdminDeleteOrderEditItemChange,
  useAdminOrderEditUpdateLineItem,
  useAdminRequestOrderEditConfirmation,
  useAdminUpdateOrderEdit,
} from "../../../../src/"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminOrderEditUpdateLineItem hook", () => {
  test("Update line item of an order edit and create or update an item change", async () => {
    const id = "oe_1"
    const itemId = "item_1"
    const { result, waitFor } = renderHook(
      () => useAdminOrderEditUpdateLineItem(id, itemId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ quantity: 3 })
    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order_edit).toEqual(
      expect.objectContaining({
        ...fixtures.get("order_edit"),
        changes: expect.arrayContaining([
          expect.objectContaining({
            quantity: 3,
          }),
        ]),
      })
    )
  })
})

describe("useAdminDeleteOrderEditItemChange hook", () => {
  test("Deletes an order edit item change", async () => {
    const id = "oe_1"
    const itemChangeId = "oeic_1"
    const { result, waitFor } = renderHook(
      () => useAdminDeleteOrderEditItemChange(id, itemChangeId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()
    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: itemChangeId,
        object: "item_change",
        deleted: true,
      })
    )
  })
})

describe("useAdminDelete hook", () => {
  test("Deletes an order edit", async () => {
    const id = "oe_1"
    const { result, waitFor } = renderHook(() => useAdminDeleteOrderEdit(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate()
    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id,
        object: "order_edit",
        deleted: true,
      })
    )
  })
})

describe("useAdminUpdateOrderEdit hook", () => {
  test("updates an order edit and returns it", async () => {
    const orderEdit = {
      internal_note: "changed note",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateOrderEdit(fixtures.get("order_edit").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(orderEdit)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order_edit).toEqual(
      expect.objectContaining({
        ...fixtures.get("order_edit"),
        ...orderEdit,
      })
    )
  })
})

describe("useAdminCreateOrderEdit hook", () => {
  test("Created an order edit", async () => {
    const { result, waitFor } = renderHook(() => useAdminCreateOrderEdit(), {
      wrapper: createWrapper(),
    })

    const payload = {
      order_id: "ord_1",
      internal_note: "This is an internal note",
    }

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        order_edit: {
          ...fixtures.get("order_edit"),
          ...payload,
        },
      })
    )
  })
})

describe("useAdminRequestOrderEditConfirmation hook", () => {
  test("Requests an order edit", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminRequestOrderEditConfirmation(fixtures.get("order_edit").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data?.order_edit).toEqual(
      expect.objectContaining({
        ...fixtures.get("order_edit"),
        requested_at: expect.any(String),
        status: "requested",
      })
    )
  })
})

describe("useAdminCancelOrderEdit hook", () => {
  test("cancel an order edit", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminCancelOrderEdit(fixtures.get("order_edit").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        order_edit: {
          ...fixtures.get("order_edit"),
          canceled_at: expect.any(String),
          status: "canceled",
        },
      })
    )
  })
})
