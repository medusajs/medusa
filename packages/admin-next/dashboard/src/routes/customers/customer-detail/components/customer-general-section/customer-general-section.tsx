import { Customer } from "@medusajs/medusa"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import format from "date-fns/format"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

type CustomerGeneralSectionProps = {
  customer: Customer
}

export const CustomerGeneralSection = ({
  customer,
}: CustomerGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="px-6 py-4 flex flex-col gap-y-3">
      <div className="flex items-center justify-between">
        <Heading>{customer.email}</Heading>
        <Link to={`/customers/${customer.id}/edit`}>
          <Button size="small" variant="secondary">
            {t("general.edit")}
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Bulletpoint
          title={t("fields.name")}
          value={
            customer.first_name && customer.last_name
              ? `${customer.first_name} ${customer.last_name}`
              : customer.last_name
                ? customer.last_name
                : customer.first_name
                  ? customer.first_name
                  : null
          }
        />
        <Bulletpoint
          title={t("customers.firstSeen")}
          value={format(new Date(customer.created_at), "MMM d, yyyy")}
        />
        <Bulletpoint title="Phone" value={customer.phone} />
        <Bulletpoint title="Orders" value={customer.orders.length} />
        <Bulletpoint
          title={t("fields.account")}
          value={
            customer.has_account
              ? t("customers.registered")
              : t("customers.guest")
          }
        />
      </div>
    </Container>
  )
}

const Bulletpoint = ({ title, value }: { title: string; value: ReactNode }) => {
  return (
    <div className="flex flex-col flex-1">
      <Text
        size="small"
        weight="plus"
        leading="compact"
        className="text-ui-fg-muted"
      >
        {title}
      </Text>
      <div className="text-ui-fg-subtle txt-small-plus">{value ?? "-"}</div>
    </div>
  )
}
