import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminStockLocation, useAdminStockLocations } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminUpdateStockLocation hook", () => {
  test("gets a stock location", async () => {
    const stockLocation = fixtures.get("stock_location")
    const { result, waitFor } = renderHook(
      () => useAdminStockLocation("stock-location-id"),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.stock_location).toEqual(
      expect.objectContaining({
        ...stockLocation,
        id: "stock-location-id",
      })
    )
  })
})

describe("useAdminUpdateStockLocations hook", () => {
  test("lists stock locations", async () => {
    const stockLocation = fixtures.list("stock_location")
    const { result, waitFor } = renderHook(() => useAdminStockLocations(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.stock_locations).toEqual(stockLocation)
  })
})
