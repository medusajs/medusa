import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateStockLocation,
  useAdminDeleteStockLocation,
  useAdminUpdateStockLocation,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminUpdateStockLocation hook", () => {
  test("updates a stock location", async () => {
    const payload = {
      name: "updated name",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateStockLocation("stock-location-id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.stock_location).toEqual(
      expect.objectContaining({
        id: "stock-location-id",
        name: "updated name",
      })
    )
  })
})

describe("useAdminCreateStockLocation hook", () => {
  test("creates a stock location", async () => {
    const locationFixture = fixtures.get("stock_location")
    const payload = {
      name: "updated name",
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateStockLocation(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.stock_location).toEqual(
      expect.objectContaining({
        ...locationFixture,
        ...payload,
      })
    )
  })
})

describe("useAdminDeleteStockLocation hook", () => {
  test("deletes a stock location", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteStockLocation("stock-location-id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: "stock-location-id",
        object: "stock_location",
        deleted: true,
      })
    )
  })
})
