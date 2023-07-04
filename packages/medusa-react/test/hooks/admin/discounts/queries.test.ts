import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminDiscount,
  useAdminDiscounts,
  useAdminGetDiscountByCode,
  useAdminGetDiscountCondition,
} from "../../../../src"
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

describe("useAdminGetDiscountCondition hook", () => {
  test("returns a discount condition", async () => {
    const discount = fixtures.get("discount")
    const { result, waitFor } = renderHook(
      () =>
        useAdminGetDiscountCondition(
          discount.id,
          discount.rule.conditions[0].id
        ),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.discount_condition).toEqual(
      discount.rule.conditions[0]
    )
  })
})
