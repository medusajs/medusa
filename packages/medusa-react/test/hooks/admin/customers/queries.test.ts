import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminCustomer, useAdminCustomers } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminCustomers hook", () => {
  test("returns a list of customers", async () => {
    const customers = fixtures.list("customer")
    const { result, waitFor } = renderHook(() => useAdminCustomers(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.customers).toEqual(customers)
  })
})

describe("useAdminCustomer hook", () => {
  test("returns a customer", async () => {
    const customer = fixtures.get("customer")
    const { result, waitFor } = renderHook(
      () => useAdminCustomer(customer.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.customer).toEqual(customer)
  })
})
