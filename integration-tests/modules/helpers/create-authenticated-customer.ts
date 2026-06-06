import { CreateCustomerDTO } from "@zjedene-medusa/types"

export const createAuthenticatedCustomer = async (
  api: any,
  storeHeaders: Record<any, any>,
  customerData: Partial<CreateCustomerDTO> = {}
) => {
  const email = customerData.email ?? "tony@start.com"
  const signup = await api.post("/auth/customer/emailpass/register", {
    email,
    password: "secret_password",
  })

  const {
    data: { customer },
  } = await api.post(
    "/store/customers",
    {
      email,
      first_name: "John",
      last_name: "Doe",
      metadata: {},
      ...customerData,
    },
    {
      headers: {
        authorization: `Bearer ${signup.data.token}`,
        ...storeHeaders.headers,
      },
    }
  )

  const signin = await api.post("/auth/customer/emailpass", {
    email,
    password: "secret_password",
  })

  return { customer, jwt: signin.data.token }
}
