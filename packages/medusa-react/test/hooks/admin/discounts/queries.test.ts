import {
  useAdminDiscount,
  useAdminDiscounts,
  useAdminGetDiscountByCode,
} from "../../../../src"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminDiscounts hook", () => {
  test("returns a list of discounts", async () => {
    const discounts = fixtures.list("discount")
    const { result, waitFor } = renderHook(() => useAdminDiscounts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.discounts).toEqual(discounts)
  })
})

describe("useAdminGetDiscountByCode hook", () => {
  test("retrieves a discount by discount code", async () => {
    const discount = fixtures.get("discount")
    const { result, waitFor } = renderHook(
      () => useAdminGetDiscountByCode("10DISC"),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.discount).toEqual(discount)
  })
})

describe("useAdminDiscount hook", () => {
  test("returns a discount", async () => {
    const discount = fixtures.get("discount")
    const { result, waitFor } = renderHook(
      () => useAdminDiscount(discount.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.discount).toEqual(discount)
  })
})
