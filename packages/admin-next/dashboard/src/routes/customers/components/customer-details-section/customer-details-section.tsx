import { Customer } from "@medusajs/medusa"
import { Container, Heading } from "@medusajs/ui"

type CustomerDetailsSectionProps = {
  customer: Customer
}

export const CustomerDetailsSection = ({
  customer,
}: CustomerDetailsSectionProps) => {
  return (
    <Container className="p-4 px-6">
      <div className="flex items-center justify-between">
        <Heading>
          {customer.first_name} {customer.last_name}
        </Heading>
      </div>
    </Container>
  )
}
