import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCancelOrderEdit,
  useAdminConfirmOrderEdit,
  useAdminCreateOrderEdit,
  useAdminDeleteOrderEdit,
  useAdminDeleteOrderEditItemChange,
  useAdminOrderEditAddLineItem,
  useAdminOrderEditDeleteLineItem,
  useAdminOrderEditUpdateLineItem,
  useAdminRequestOrderEditConfirmation,
  useAdminUpdateOrderEdit,
} from "../../../../src/"
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

describe("useAdminDeleteOrderEdit hook", () => {
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

describe("useAdminOrderEditAddLineItem hook", () => {
  test("Created an order edit line item", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminOrderEditAddLineItem(fixtures.get("order_edit").id),
      {
        wrapper: createWrapper(),
      }
    )

    const payload = {
      variant_id: "var_1",
      quantity: 2,
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

describe("useAdminConfirmOrderEdit hook", () => {
  test("confirm an order edit", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminConfirmOrderEdit(fixtures.get("order_edit").id),
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
          confirmed_at: expect.any(String),
          status: "confirmed",
        },
      })
    )
  })
})

describe("useAdminOrderEditDeleteLineItem hook", () => {
  test("Remove line item of an order edit and create an item change", async () => {
    const id = "oe_1"
    const itemId = "item_1"
    const { result, waitFor } = renderHook(
      () => useAdminOrderEditDeleteLineItem(id, itemId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()
    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order_edit).toEqual(
      expect.objectContaining({
        ...fixtures.get("order_edit"),
        changes: expect.arrayContaining([
          expect.objectContaining({
            type: "item_remove",
          }),
        ]),
      })
    )
  })
})
