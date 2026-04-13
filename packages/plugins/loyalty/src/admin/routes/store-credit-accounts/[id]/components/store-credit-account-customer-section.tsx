import { Container } from "@medusajs/ui";
import { User } from "@medusajs/icons";

import { SidebarLink } from "../../../../components/sidebar-link";
import { useCustomer } from "../../../../hooks/api/customers";
import { Header } from "../../../../components/header";

function StoreCreditAccountCustomerSection({
  customerId,
}: {
  customerId?: string;
}) {
  const { customer, isPending } = useCustomer(customerId as string, undefined, {
    enabled: !!customerId,
  });

  if (isPending || !customer) {
    return null;
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
  );
}

export default StoreCreditAccountCustomerSection;
