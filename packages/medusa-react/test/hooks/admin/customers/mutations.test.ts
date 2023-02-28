import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateCustomer,
  useAdminUpdateCustomer,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateCustomer hook", () => {
  test("creates a customer and returns it", async () => {
    const customer = {
      email: "lebron@james.com",
      first_name: "Lebron",
      last_name: "James",
      password: "password",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateCustomer(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(customer)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.customer).toEqual(
      expect.objectContaining({
        ...fixtures.get("customer"),
        ...customer,
      })
    )
  })
})

describe("useAdminUpdateCustomer hook", () => {
  test("updates a customer and returns it", async () => {
    const customer = {
      email: "lebron@james.com",
      first_name: "Lebron",
      last_name: "James",
      password: "password",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateCustomer(fixtures.get("customer").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(customer)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.customer).toEqual(
      expect.objectContaining({
        ...fixtures.get("customer"),
        ...customer,
      })
    )
  })
})
