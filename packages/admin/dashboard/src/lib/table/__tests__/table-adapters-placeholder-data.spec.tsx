// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, renderHook, waitFor } from "@testing-library/react"
import React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.hoisted(() => {
  const g = global as any
  g.__BACKEND_URL__ = "http://localhost:9000"
  g.__AUTH_TYPE__ = "session"
  g.__JWT_TOKEN_STORAGE_KEY__ = ""
})

const { inventoryList, reservationList, stockLocationList } = vi.hoisted(
  () => ({
    inventoryList: vi.fn(),
    reservationList: vi.fn(),
    stockLocationList: vi.fn(),
  })
)

vi.mock("../../client", () => ({
  sdk: {
    admin: {
      inventoryItem: { list: inventoryList },
      reservation: { list: reservationList },
      stockLocation: { list: stockLocationList },
    },
  },
}))

import { createInventoryTableAdapter } from "../../../routes/inventory/inventory-list/components/inventory-table-adapter"
import { createLocationTableAdapter } from "../../../routes/locations/location-list/location-table-adapter"
import { createReservationTableAdapter } from "../../../routes/reservations/reservation-list/components/reservation-list-table/reservation-table-adapter"

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const t = ((key: string) => key) as any

const cases = [
  {
    name: "inventory",
    adapter: () =>
      createInventoryTableAdapter({
        t,
        navigate: vi.fn(),
        canUpdate: true,
        canDelete: true,
      }),
    list: inventoryList,
    key: "inventory_items",
  },
  {
    name: "reservations",
    adapter: () => createReservationTableAdapter({ t }),
    list: reservationList,
    key: "reservations",
  },
  {
    name: "locations",
    adapter: () => createLocationTableAdapter({ t }),
    list: stockLocationList,
    key: "stock_locations",
  },
]

describe.each(cases)("$name table adapter", ({ adapter, list, key }) => {
  it("should keep the previous rows while a new search is loading", async () => {
    const rows = [{ id: "row_1" }, { id: "row_2" }]
    list
      .mockResolvedValueOnce({ [key]: rows, count: 2 })
      .mockReturnValueOnce(new Promise(() => {}))

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { useData } = adapter()
    const { result, rerender } = renderHook(
      ({ q }: { q: string }) => useData("id", { q, limit: 20, offset: 0 }),
      { wrapper, initialProps: { q: "ca" } }
    )

    await waitFor(() => expect(result.current.data).toEqual(rows))

    rerender({ q: "cab" })

    await waitFor(() => expect(list).toHaveBeenCalledTimes(2))
    expect(result.current.data).toEqual(rows)
    expect(result.current.count).toBe(2)
  })
})
