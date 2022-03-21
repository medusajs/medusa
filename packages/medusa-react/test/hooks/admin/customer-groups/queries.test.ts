import { renderHook } from "@testing-library/react-hooks"

import { useAdminCustomerGroup, useAdminCustomerGroups } from "../../../../src"
import { fixtures } from "../../../../mocks/data"
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
})
