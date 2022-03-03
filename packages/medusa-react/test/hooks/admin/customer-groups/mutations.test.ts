import { renderHook } from "@testing-library/react-hooks"

import { useAdminCreateCustomerGroup } from "../../../../src/"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminCreateCustomerGroup hook", () => {
  test("creates a customer group and returns it", async () => {
    const group = {
      name: "Group 1",
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateCustomerGroup(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(group)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.customer_group).toEqual(
      expect.objectContaining({})
    )
  })
})
