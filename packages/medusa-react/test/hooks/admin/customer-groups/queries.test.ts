import { renderHook } from "@testing-library/react-hooks"

import { useAdminCustomerGroup } from "../../../../src"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminCustomerGroup hook", () => {
  test("returns a customer group", async () => {
    const group = fixtures.list("customer_group")
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
})
