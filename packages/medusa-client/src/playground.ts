import Medusa from "."
import { Customer } from "../generated/admin/model/customer"

const client = new Medusa({
  baseUrl: "http://localhost:9000/",
  apiKey: "YOUR_API_KEY",
  maxRetries: 0,
})

async function updateCustomer(): Promise<Customer | undefined> {
  const res = await client.admin.customers.postCustomersCustomer(
    "cus_01",
    {
      email: "user@test.com",
    },
    {
      expand: ["groups", "billing_address"],
    }
  )

  return res.customer
}

updateCustomer().catch((err) => console.log(err))
