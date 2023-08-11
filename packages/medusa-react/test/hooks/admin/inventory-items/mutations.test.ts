import { renderHook } from "@testing-library/react-hooks/dom"
import {
  useAdminCreateLocationLevel,
  useAdminDeleteInventoryItem,
  useAdminDeleteLocationLevel,
  useAdminUpdateInventoryItem,
  useAdminUpdateLocationLevel,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminUpdateInventoryItem hook", () => {
  test("updates an inventory item", async () => {
    const payload = {
      sku: "test-sku",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateInventoryItem("inventory-item-id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.inventory_item).toEqual(
      expect.objectContaining({
        id: "inventory-item-id",
        sku: "test-sku",
      })
    )
  })
})

describe("useAdminDeleteInventoryItem hook", () => {
  test("Deletes an inventory item", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteInventoryItem("inventory-item-id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: "inventory-item-id",
        deleted: true,
      })
    )
  })
})

describe("useAdminUpdateLocationLevel hook", () => {
  test("Updates a location level", async () => {
    const payload = {
      incoming_quantity: 10,
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateLocationLevel("inventory-item-id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ ...payload, stockLocationId: "location_id" })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.inventory_item).toEqual(
      expect.objectContaining({
        id: "inventory-item-id",
        location_levels: [
          expect.objectContaining({
            incoming_quantity: 10,
          }),
        ],
      })
    )
  })
})

describe("useAdminDeleteLocationLevel hook", () => {
  test("removes a location level", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteLocationLevel("inventory-item-id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("location_id")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.inventory_item).toEqual(
      expect.objectContaining({
        id: "inventory-item-id",
        location_levels: [],
      })
    )
  })
})

describe("useAdminCreateLocationLevel hook", () => {
  test("creates a location level", async () => {
    const payload = {
      location_id: "loc_1",
      incoming_quantity: 10,
      stocked_quantity: 10,
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateLocationLevel("inventory-item-id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.inventory_item).toEqual(
      expect.objectContaining({
        id: "inventory-item-id",
        location_levels: expect.arrayContaining([
          expect.objectContaining({ ...payload }),
        ]),
      })
    )
  })
})
