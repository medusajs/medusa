import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateReservation,
  useAdminDeleteReservation,
  useAdminUpdateReservation,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateShippingProfile hook", () => {
  test("creates a shipping profile and returns it", async () => {
    const reservationPayload = {
      location_id: "loc_1",
      inventory_item_id: "inv_1",
      quantity: 2,
    }

    const { result, waitFor } = renderHook(() => useAdminCreateReservation(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(reservationPayload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.reservation).toEqual(
      expect.objectContaining({
        ...fixtures.get("reservation"),
        ...reservationPayload,
      })
    )
  })
})

describe("useAdminUpdateShippingProfile hook", () => {
  test("updates a shipping profile and returns it", async () => {
    const reservationPayload = {
      quantity: 3,
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateReservation(fixtures.get("reservation").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(reservationPayload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.reservation).toEqual(
      expect.objectContaining({
        ...fixtures.get("reservation"),
        quantity: 3,
      })
    )
  })
})

describe("useAdminDeleteShippingProfile hook", () => {
  test("deletes a shipping profile", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteReservation(fixtures.get("reservation").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("reservation").id,
        object: "reservation",
        deleted: true,
      })
    )
  })
})
