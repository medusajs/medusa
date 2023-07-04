import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useCreateCustomer, useUpdateMe } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useCreateCustomer hook", () => {
  test("creates a new customer", async () => {
    const customer = {
      first_name: "john",
      last_name: "wick",
      email: "johnwick@medusajs.com",
      password: "supersecret",
      phone: "111111",
    }

    const { result, waitFor } = renderHook(() => useCreateCustomer(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(customer)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.customer).toEqual({
      ...fixtures.get("customer"),
      ...customer,
    })
  })
})

describe("useUpdateMe hook", () => {
  test("updates current customer", async () => {
    const customer = {
      first_name: "lebron",
      last_name: "james",
      email: "lebronjames@medusajs.com",
      password: "supersecret",
      phone: "111111",
    }

    const { result, waitFor } = renderHook(() => useUpdateMe(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({
      id: "cus_test",
      ...customer,
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.customer).toEqual({
      ...fixtures.get("customer"),
      ...customer,
    })
  })
})
