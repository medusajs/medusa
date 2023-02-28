import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminShippingProfile,
  useAdminShippingProfiles,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminShippingProfiles hook", () => {
  test("returns a list of shipping profiles", async () => {
    const shippingProfiles = fixtures.list("shipping_profile")
    const { result, waitFor } = renderHook(() => useAdminShippingProfiles(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.shipping_profiles).toEqual(shippingProfiles)
  })
})

describe("useAdminShippingProfile hook", () => {
  test("returns a shipping profile", async () => {
    const shippingProfile = fixtures.get("shipping_profile")
    const { result, waitFor } = renderHook(
      () => useAdminShippingProfile(shippingProfile.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.shipping_profile).toEqual(shippingProfile)
  })
})
