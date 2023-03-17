import { renderHook } from "@testing-library/react-hooks/dom"

import { fixtures } from "../../../../mocks/data"
import {
  useAdminCustomerGroup,
  useAdminCustomerGroupCustomers,
  useAdminCustomerGroups,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminCustomerGroup hook", () => {
  test("returns a customer group", async () => {
    const group = fixtures.get("customer_group")
    const { result, waitFor } = renderHook(
      () => useAdminCustomerGroup(group.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.customer_group).toEqual(group)
  })

  test("returns a list of customer groups", async () => {
    const groups = fixtures.list("customer_group")
    const { result, waitFor } = renderHook(() => useAdminCustomerGroups(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.customer_groups).toEqual(groups)
  })

  test("returns a list of customers that belong to a group", async () => {
    const groups = fixtures.list("customer_group")
    const customers = fixtures.list("customer")

    const { result, waitFor } = renderHook(
      () => useAdminCustomerGroupCustomers(groups[0].id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.customers).toEqual(customers)
  })
})
