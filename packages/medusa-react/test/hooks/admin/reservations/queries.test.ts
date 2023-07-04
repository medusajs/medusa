import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminReservation, useAdminReservations } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminShippingProfiles hook", () => {
  test("returns a list of shipping profiles", async () => {
    const reservations = fixtures.list("reservation")
    const { result, waitFor } = renderHook(() => useAdminReservations(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.reservations).toEqual(reservations)
  })
})

describe("useAdminShippingProfile hook", () => {
  test("returns a shipping profile", async () => {
    const reservation = fixtures.get("reservation")
    const { result, waitFor } = renderHook(
      () => useAdminReservation(reservation.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.reservation).toEqual(reservation)
  })
})
