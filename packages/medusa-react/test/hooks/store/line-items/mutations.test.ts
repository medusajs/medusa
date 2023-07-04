import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useCreateLineItem,
  useDeleteLineItem,
  useUpdateLineItem,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useCreateLineItem hook", () => {
  test("creates a line item", async () => {
    const lineItem = {
      variant_id: "test-variant",
      quantity: 1,
    }

    const { result, waitFor } = renderHook(
      () => useCreateLineItem("test-cart"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(lineItem)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...lineItem,
        }),
      ])
    )
  })
})

describe("useUpdateLineItem hook", () => {
  test("updates a line item", async () => {
    const lineItem = {
      lineId: "some-item-id",
      quantity: 3,
    }

    const { result, waitFor } = renderHook(
      () => useUpdateLineItem("test-cart"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(lineItem)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: lineItem.lineId,
          quantity: lineItem.quantity,
        }),
      ])
    )
  })
})

describe("useDeleteLineItem hook", () => {
  test("deletes a line item", async () => {
    const lineItem = {
      lineId: "some-item-id",
    }

    const { result, waitFor } = renderHook(
      () => useDeleteLineItem("test-cart"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(lineItem)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.cart).toEqual(fixtures.get("cart"))
  })
})
