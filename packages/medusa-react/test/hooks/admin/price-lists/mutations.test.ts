import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreatePriceList,
  useAdminCreatePriceListPrices,
  useAdminDeletePriceList,
  useAdminDeletePriceListPrices,
  useAdminDeletePriceListProductPrices,
  useAdminDeletePriceListVariantPrices,
  useAdminUpdatePriceList,
} from "../../../../src"
import { createWrapper } from "../../../utils"

import { PriceListType } from "@medusajs/medusa/dist/types/price-list"

describe("useAdminCreatePriceList hook", () => {
  test("creates a price list and returns it", async () => {
    const priceList = {
      name: "talked to customer",
      type: PriceListType.SALE,
      description: "test",
      prices: [],
    }

    const { result, waitFor } = renderHook(() => useAdminCreatePriceList(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(priceList)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.price_list).toEqual(
      expect.objectContaining({
        ...fixtures.get("price_list"),
        ...priceList,
      })
    )
  })
})

describe("useAdminUpdatePriceList hook", () => {
  test("updates a price list and returns it", async () => {
    const priceList = {
      name: "talked to customer",
      type: PriceListType.SALE,
      prices: [],
      customer_groups: [],
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdatePriceList(fixtures.get("price_list").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(priceList)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.price_list).toEqual(
      expect.objectContaining({
        ...fixtures.get("price_list"),
        ...priceList,
      })
    )
  })
})

describe("useAdminDeletePriceList hook", () => {
  test("deletes a price list", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeletePriceList(fixtures.get("price_list").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("price_list").id,
        deleted: true,
      })
    )
  })
})

describe("useAdminDeletePriceListBatch hook", () => {
  test("deletes a money amounts from price list", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeletePriceListPrices(fixtures.get("price_list").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ price_ids: [fixtures.get("money_amount").id] })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        ids: [fixtures.get("money_amount").id],
        deleted: true,
      })
    )
  })
})

describe("useAdminDeletePriceList hook", () => {
  test("Adds prices to price list", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminCreatePriceListPrices(fixtures.get("price_list").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({ prices: [] })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        price_list: {
          ...fixtures.get("price_list"),
        },
      })
    )
  })
})

describe("useAdminDeletePriceListProductPrices hook", () => {
  test("should delete prices from a price list for all the variants related to the specified product", async () => {
    const { result, waitFor } = renderHook(
      () =>
        useAdminDeletePriceListProductPrices(
          fixtures.get("price_list").id,
          fixtures.get("product").id
        ),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        ids: [],
        object: "money-amount",
        deleted: true,
      })
    )
  })
})

describe("useAdminDeletePriceListVariantPrices hook", () => {
  test("should delete prices from a price list for the specified variant", async () => {
    const { result, waitFor } = renderHook(
      () =>
        useAdminDeletePriceListVariantPrices(
          fixtures.get("price_list").id,
          fixtures.get("product_variant").id
        ),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        ids: [],
        object: "money-amount",
        deleted: true,
      })
    )
  })
})
