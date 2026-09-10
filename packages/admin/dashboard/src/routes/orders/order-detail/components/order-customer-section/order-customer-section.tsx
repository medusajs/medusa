import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ArrowPath, CurrencyDollar, Envelope, FlyingBox } from "@medusajs/icons"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { CustomerInfo } from "../../../../../components/common/customer-info"
import { HttpTypes } from "@medusajs/types"
import { PermissionGuard } from "../../../../../components/common/permission-guard"
import {
  useCustomerAddressPermissions,
  useCustomerPermissions,
  useOrderPermissions,
} from "../../../../../hooks/use-resource-permissions"

type OrderCustomerSectionProps = {
  order: HttpTypes.AdminOrder
}

export const OrderCustomerSection = ({ order }: OrderCustomerSectionProps) => {
  return (
    <Container className="divide-y p-0">
      <Header />
      <CustomerInfo.ID data={order} />
      <CustomerInfo.Contact data={order} />
      <CustomerInfo.Company data={order} />
      <PermissionGuard permission="customer_address:read">
        <CustomerInfo.Addresses data={order} />
      </PermissionGuard>
    </Container>
  )
}

const Header = () => {
  const { t } = useTranslation()

  const { canUpdate: canUpdateCustomers } = useCustomerPermissions()
  const { canUpdate: canUpdateAdresses } = useCustomerAddressPermissions()
  const { canUpdate: canUpdateOrders } = useOrderPermissions()

  const canUpdateCustomer = canUpdateCustomers && canUpdateOrders
  const canUpdateCustomerAddresses =
    canUpdateAdresses && canUpdateCustomers && canUpdateOrders

  const groups: ActionGroup[] = []

  if (canUpdateCustomer) {
    groups.push({
      actions: [
        {
          label: t("transferOwnership.label"),
          to: `transfer`,
          icon: <ArrowPath />,
        },
      ],
    })
  }

  if (canUpdateCustomerAddresses) {
    groups.push({
      actions: [
        {
          label: t("addresses.shippingAddress.editLabel"),
          to: "shipping-address",
          icon: <FlyingBox />,
        },
        {
          label: t("addresses.billingAddress.editLabel"),
          to: "billing-address",
          icon: <CurrencyDollar />,
        },
      ],
    })
  }

  if (canUpdateCustomer) {
    groups.push({
      actions: [
        {
          label: t("email.editLabel"),
          to: `email`,
          icon: <Envelope />,
        },
      ],
    })
  }

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Heading level="h2">{t("fields.customer")}</Heading>
      {groups.length > 0 && <ActionMenu groups={groups} />}
    </div>
  )
}
