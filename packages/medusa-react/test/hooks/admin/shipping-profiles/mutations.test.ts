import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateShippingProfile,
  useAdminDeleteShippingProfile,
  useAdminUpdateShippingProfile,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateShippingProfile hook", () => {
  test("creates a shipping profile and returns it", async () => {
    const sp = {
      name: "test-sp",
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateShippingProfile(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(sp)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.shipping_profile).toEqual(
      expect.objectContaining({
        ...fixtures.get("shipping_profile"),
        ...sp,
      })
    )
  })
})

describe("useAdminUpdateShippingProfile hook", () => {
  test("updates a shipping profile and returns it", async () => {
    const sp = {
      name: "test-sp",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateShippingProfile(fixtures.get("shipping_profile").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(sp)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.shipping_profile).toEqual(
      expect.objectContaining({
        ...fixtures.get("shipping_profile"),
        ...sp,
      })
    )
  })
})

describe("useAdminDeleteShippingProfile hook", () => {
  test("deletes a shipping profile", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteShippingProfile(fixtures.get("shipping_profile").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("shipping_profile").id,
        deleted: true,
      })
    )
  })
})
