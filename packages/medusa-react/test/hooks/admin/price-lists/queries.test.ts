import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminPriceList, useAdminPriceLists } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminPriceLists hook", () => {
  test("returns a list of price lists", async () => {
    const priceLists = fixtures.list("price_list")
    const { result, waitFor } = renderHook(() => useAdminPriceLists(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.price_lists).toEqual(priceLists)
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
