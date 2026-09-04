import { Container } from "@medusajs/ui"
import { User } from "@medusajs/icons"

import { Header } from "../../../../components/header"
import { SidebarLink } from "@medusajs/dashboard/components"
import { useCustomer } from "@medusajs/dashboard/hooks"

function StoreCreditAccountCustomerSection({
  customerId,
}: {
  customerId?: string
}) {
  const { customer, isPending } = useCustomer(customerId as string, undefined, {
    enabled: !!customerId,
  })

  if (isPending || !customer) {
    return null
  }

  return (
    <Container className="p-0">
      <Header title="Customer" />

      <SidebarLink
        icon={<User />}
        key={customer.id}
        labelKey={customer.email || "N/A"}
        descriptionKey={
          !customer.first_name && !customer.last_name
            ? "N/A"
            : `${customer.first_name} ${customer.last_name}`
        }
        to={`/customers/${customer.id}`}
      />
    </Container>
  )
}

export default StoreCreditAccountCustomerSection
