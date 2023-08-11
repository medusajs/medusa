import { renderHook } from "@testing-library/react-hooks/dom"

import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateCustomerGroup,
  useAdminUpdateCustomerGroup,
} from "../../../../src/"
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
      expect.objectContaining(group)
    )
  })

  describe("useAdminUpdateCustomerGroup hook", () => {
    test("updates a customer group and returns it", async () => {
      const group = {
        name: "Changeed name",
      }

      const { result, waitFor } = renderHook(
        () => useAdminUpdateCustomerGroup(fixtures.get("customer_group").id),
        {
          wrapper: createWrapper(),
        }
      )

      result.current.mutate(group)

      await waitFor(() => result.current.isSuccess)

      expect(result.current.data.response.status).toEqual(200)
      expect(result.current.data.customer_group).toEqual(
        expect.objectContaining({
          ...fixtures.get("customer_group"),
          ...group,
        })
      )
    })
  })
})
