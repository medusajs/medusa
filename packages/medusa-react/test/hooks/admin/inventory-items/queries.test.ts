import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminInventoryItem,
  useAdminInventoryItemLocationLevels,
  useAdminInventoryItems,
  useAdminPriceList,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminInventoryItems hook", () => {
  test("returns a list of inventory items", async () => {
    const inventoryItems = fixtures.list("inventory_item")
    const { result, waitFor } = renderHook(() => useAdminInventoryItems(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.inventory_items).toEqual(inventoryItems)
  })
})

describe("useAdminInventoryItem hook", () => {
  test("returns a single inventory item", async () => {
    const inventoryItem = fixtures.get("inventory_item")
    const { result, waitFor } = renderHook(
      () => useAdminInventoryItem(inventoryItem.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.inventory_item).toEqual(inventoryItem)
  })
})

describe("useAdminInventoryItem hook", () => {
  test("returns a location levels for an inventory item", async () => {
    const inventoryItem = fixtures.get("inventory_item")
    const { result, waitFor } = renderHook(
      () => useAdminInventoryItemLocationLevels(inventoryItem.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.inventory_item).toEqual(inventoryItem)
  })
})

describe("useAdminPriceList hook", () => {
  test("returns a price list", async () => {
    const priceList = fixtures.get("price_list")
    const { result, waitFor } = renderHook(
      () => useAdminPriceList(priceList.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.price_list).toEqual(priceList)
  })
})
