import { ArrowPath, EllipsisHorizontal, PencilSquare } from "@medusajs/icons"
import { Customer } from "@medusajs/medusa"
import {
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Text,
} from "@medusajs/ui"
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
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <IconButton size="small" variant="transparent">
              <EllipsisHorizontal />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <Link to={`/customers/${customer.id}/edit`}>
              <DropdownMenu.Item className="flex items-center gap-x-2">
                <PencilSquare className="text-ui-fg-subtle" />
                <span>{t("general.edit")}</span>
              </DropdownMenu.Item>
            </Link>
            <Link to={`/customers/${customer.id}/change-password`}>
              <DropdownMenu.Item className="flex items-center gap-x-2">
                <ArrowPath className="text-ui-fg-subtle" />
                <span>{t("customers.changePassword")}</span>
              </DropdownMenu.Item>
            </Link>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-evenly flex-wrap">
        <Bulletpoint
          title="Name"
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
          title="First seen"
          value={format(new Date(customer.created_at), "MMM d, yyyy")}
        />
        <Bulletpoint title="Phone" value={customer.phone} />
        <Bulletpoint title="Orders" value={customer.orders.length} />
        <Bulletpoint
          title="Status"
          value={customer.has_account ? "Signed up" : "Guest"}
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
