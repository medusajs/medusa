import { Container, Heading } from "@medusajs/ui"
import { useAdminCustomers } from "medusa-react"
import { Link } from "react-router-dom"

export const CustomersList = () => {
  const { customers } = useAdminCustomers()

  return (
    <div>
      <Container>
        <Heading>Customers</Heading>
        <div>
          <ul>
            {customers?.map((c) => (
              <li key={c.id}>
                <Link to={`/customers/${c.id}`}>{c.email}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  )
}
